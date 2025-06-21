import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return mock recent reports
    const mockReports = [
      {
        id: "#0599",
        date: "2024-06-14",
        type: "Investment Scam",
        amount: 25000,
        state: "Selangor",
        status: "Scam",
        summary: "Fake cryptocurrency investment scheme",
      },
      {
        id: "#0598",
        date: "2024-06-14",
        type: "Love Scam",
        amount: 15000,
        state: "Kuala Lumpur",
        status: "Scam",
        summary: "Romance scam via dating app",
      },
      {
        id: "#0597",
        date: "2024-06-13",
        type: "Phishing",
        amount: 0,
        state: "Penang",
        status: "Scam",
        summary: "Fake bank email requesting credentials",
      },
      {
        id: "#0596",
        date: "2024-06-13",
        type: "Online Purchase",
        amount: 500,
        state: "Johor",
        status: "Legitimate",
        summary: "Delayed delivery complaint resolved",
      },
      {
        id: "#0595",
        date: "2024-06-12",
        type: "Job Scam",
        amount: 2000,
        state: "Pahang",
        status: "Scam",
        summary: "Fake job offer requiring upfront payment",
      },
    ]

    return NextResponse.json(mockReports)
  } catch (error) {
    console.error("Error in fallback reports:", error)
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 })
  }
}
