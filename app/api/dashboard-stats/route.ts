import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")
    const stateFilter = searchParams.get("state_filter")
    const scamTypeFilter = searchParams.get("scam_type_filter")

    // For now, let's calculate stats directly instead of using the function
    // to avoid potential RLS issues with the function
    let query = supabaseAdmin.from("fraud_reports").select("case_status, amount_lost, state_id")

    // Apply filters
    if (startDate) {
      query = query.gte("report_date", startDate)
    }
    if (endDate) {
      query = query.lte("report_date", endDate)
    }
    if (stateFilter && stateFilter !== "all") {
      query = query.eq("state_id", Number.parseInt(stateFilter))
    }
    if (scamTypeFilter && scamTypeFilter !== "all") {
      query = query.eq("scam_type_id", Number.parseInt(scamTypeFilter))
    }

    const { data: reports, error } = await query

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    // Calculate statistics
    const totalReports = reports?.length || 0
    const detectedScams = reports?.filter((r) => r.case_status === "scam").length || 0
    const legitimateCases = reports?.filter((r) => r.case_status === "legitimate").length || 0
    const detectionRate = totalReports > 0 ? (detectedScams / totalReports) * 100 : 0
    const financialLoss = reports?.reduce((sum, r) => sum + (r.amount_lost || 0), 0) || 0

    // Get unique states with scam reports for high-risk areas
    const scamStates = new Set(reports?.filter((r) => r.case_status === "scam" && r.state_id).map((r) => r.state_id))
    const highRiskAreas = scamStates.size

    const stats = {
      totalReports,
      detectedScams,
      legitimateCases,
      detectionRate: Math.round(detectionRate * 100) / 100,
      financialLoss,
      activeCases: detectedScams,
      highRiskAreas,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 })
  }
}
