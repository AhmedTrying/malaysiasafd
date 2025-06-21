import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { caseId, action, adminNotes } = await request.json()

    // Get the pending report using service role
    const { data: pendingReport, error: fetchError } = await supabaseAdmin
      .from("pending_reports")
      .select(`
        *,
        scam_types(name),
        states(name)
      `)
      .eq("case_id", caseId)
      .eq("status", "pending")
      .single()

    if (fetchError || !pendingReport) {
      return NextResponse.json({ error: "Pending report not found" }, { status: 404 })
    }

    if (action === "approve") {
      // Generate new case ID for approved report
      const { data: existingReports } = await supabaseAdmin
        .from("fraud_reports")
        .select("case_id")
        .order("created_at", { ascending: false })
        .limit(1)

      let nextNumber = 1000
      if (existingReports && existingReports.length > 0) {
        const lastCaseId = existingReports[0].case_id
        const lastNumber = Number.parseInt(lastCaseId.replace("#", ""))
        nextNumber = lastNumber + 1
      }

      const newCaseId = `#${nextNumber.toString().padStart(4, "0")}`

      // Insert into fraud_reports
      const { error: insertError } = await supabaseAdmin.from("fraud_reports").insert({
        case_id: newCaseId,
        summary: pendingReport.summary,
        amount_lost: pendingReport.amount_lost,
        scam_type_id: pendingReport.scam_type_id,
        state_id: pendingReport.state_id,
        case_status: pendingReport.predicted_status,
        confidence_score: pendingReport.confidence_score,
        created_by: pendingReport.submitted_by,
        report_date: new Date().toISOString().split("T")[0],
        title: `User Report - ${pendingReport.scam_types?.name || "Unknown"}`,
      })

      if (insertError) {
        console.error("Error inserting approved report:", insertError)
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }
    }

    // Map action to valid enum value for status
    let statusValue = action;
    if (action === "approve") statusValue = "approved";
    if (action === "reject") statusValue = "rejected";

    // Update pending report status
    const { error: updateError } = await supabaseAdmin
      .from("pending_reports")
      .update({
        status: statusValue,
        reviewed_at: new Date().toISOString(),
        admin_notes: adminNotes || "",
      })
      .eq("id", pendingReport.id)

    if (updateError) {
      console.error("Error updating pending report:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message:
        action === "approve"
          ? "Report approved and added to dataset. It will now appear in Recent Reports."
          : "Report rejected and removed from pending queue.",
    })
  } catch (error) {
    console.error("Error processing report:", error)
    return NextResponse.json({ error: "Failed to process report" }, { status: 500 })
  }
}
