import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return mock dashboard statistics
    const mockStats = {
      totalReports: 1342,
      detectedScams: 892,
      legitimateCases: 450,
      detectionRate: 66.5,
      financialLoss: 3400000,
      activeCases: 785,
      highRiskAreas: 8,
    }

    return NextResponse.json(mockStats)
  } catch (error) {
    console.error("Error in fallback dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 })
  }
}
