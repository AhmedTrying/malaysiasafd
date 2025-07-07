import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// Get pending reports
export async function GET() {
  try {
    const { data: pendingReports, error } = await supabaseAdmin
      .from("pending_reports")
      .select(`
        id,
        case_id,
        summary,
        amount_lost,
        predicted_status,
        confidence_score,
        status,
        submitted_at,
        scam_types(name),
        states(name),
        users!pending_reports_submitted_by_fkey(username)
      `)
      .eq("status", "pending")
      .order("submitted_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Format the data for the frontend
    const formattedReports =
      pendingReports?.map((report) => ({
        "Case ID": report.case_id,
        Date: new Date(report.submitted_at).toLocaleDateString(),
        Summary: report.summary,
        "Amount Lost": report.amount_lost?.toString() || "0",
        "Scam Type": report.scam_types?.name || "Unknown",
        State: report.states?.name || "Unknown",
        Scam_NonScam: report.predicted_status === "scam" ? "1" : "0",
        Confidence: report.confidence_score?.toString() || "0",
        "Submitted By": report.users?.username || "Unknown",
        "Submitted At": report.submitted_at,
        id: report.id,
      })) || []

    return NextResponse.json(formattedReports)
  } catch (error) {
    console.error("Error fetching pending reports:", error)
    return NextResponse.json({ error: "Failed to fetch pending reports" }, { status: 500 })
  }
}

// Add new pending report
export async function POST(request: NextRequest) {
  try {
    // Extract access token from Authorization header
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Get user from Supabase using the access token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
    if (!user || userError) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const reportData = await request.json()

    // Get scam type ID
    const { data: scamType } = await supabaseAdmin
      .from("scam_types")
      .select("id")
      .eq("name", reportData.scamType)
      .single()

    // Get state ID
    const { data: state } = await supabaseAdmin.from("states").select("id").eq("name", reportData.state).single()

    // Generate case ID using a simple counter approach
    const { data: existingReports } = await supabaseAdmin
      .from("pending_reports")
      .select("case_id")
      .order("created_at", { ascending: false })
      .limit(1)

    let nextNumber = 2000
    if (existingReports && existingReports.length > 0) {
      const lastCaseId = existingReports[0].case_id
      const lastNumber = Number.parseInt(lastCaseId.replace("#P", ""))
      nextNumber = lastNumber + 1
    }

    const caseId = `#P${nextNumber.toString().padStart(4, "0")}`

    // Insert pending report
    const { data: newReport, error } = await supabaseAdmin
      .from("pending_reports")
      .insert({
        case_id: caseId,
        summary: reportData.summary,
        amount_lost: Number.parseFloat(reportData.amountLost) || 0,
        scam_type_id: scamType?.id,
        state_id: state?.id,
        predicted_status: reportData.prediction.toLowerCase(),
        confidence_score: reportData.confidence,
        submitted_by: user.id, // Use the authenticated user's ID
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, caseId })
  } catch (error) {
    console.error("Error saving report:", error)
    return NextResponse.json({ error: "Failed to save report" }, { status: 500 })
  }
}
