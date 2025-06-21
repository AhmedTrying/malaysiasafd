import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin access not configured" }, { status: 500 })
    }
    // Get recent reports with related data using service role
    const { data: reports, error } = await supabaseAdmin
      .from("fraud_reports")
      .select(`
        id,
        case_id,
        report_date,
        amount_lost,
        case_status,
        summary,
        scam_types(name),
        states(name)
      `)
      .order("report_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(5)

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    // Format the data for the frontend
    const formattedReports =
      reports?.map((report: any) => ({
        id: report.case_id,
        date: report.report_date,
        type: Array.isArray(report.scam_types)
          ? ((report.scam_types[0] as { name?: string })?.name || "Unknown")
          : (report.scam_types?.name || "Unknown"),
        amount: report.amount_lost || 0,
        state: Array.isArray(report.states)
          ? ((report.states[0] as { name?: string })?.name || "Unknown")
          : (report.states?.name || "Unknown"),
        status:
          report.case_status === "scam" ? "Scam" : report.case_status === "legitimate" ? "Legitimate" : "Under Review",
        summary: report.summary,
      })) || []

    return NextResponse.json(formattedReports)
  } catch (error) {
    console.error("Error reading reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}
