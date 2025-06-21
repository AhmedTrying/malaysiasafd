import { NextResponse } from "next/server"

// Fallback lookup data for when Supabase is not available
const fallbackStates = [
  { id: 1, name: "Johor", code: "JHR" },
  { id: 2, name: "Kedah", code: "KDH" },
  { id: 3, name: "Kelantan", code: "KTN" },
  { id: 4, name: "Kuala Lumpur", code: "KUL" },
  { id: 5, name: "Labuan", code: "LBN" },
  { id: 6, name: "Malacca", code: "MLK" },
  { id: 7, name: "Negeri Sembilan", code: "NSN" },
  { id: 8, name: "Pahang", code: "PHG" },
  { id: 9, name: "Penang", code: "PNG" },
  { id: 10, name: "Perak", code: "PRK" },
  { id: 11, name: "Perlis", code: "PLS" },
  { id: 12, name: "Putrajaya", code: "PJY" },
  { id: 13, name: "Sabah", code: "SBH" },
  { id: 14, name: "Sarawak", code: "SWK" },
  { id: 15, name: "Selangor", code: "SGR" },
  { id: 16, name: "Terengganu", code: "TRG" },
]

const fallbackScamTypes = [
  { id: 1, name: "Investment Scam", description: "Fraudulent investment schemes" },
  { id: 2, name: "Love Scam", description: "Romance scams" },
  { id: 3, name: "Phishing", description: "Identity theft attempts" },
  { id: 4, name: "Online Purchase", description: "E-commerce fraud" },
  { id: 5, name: "Job Scam", description: "Fake job offers" },
  { id: 6, name: "Loan Scam", description: "Fraudulent loan offers" },
  { id: 7, name: "Impersonation", description: "Authority impersonation" },
  { id: 8, name: "Other", description: "Other fraud types" },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (type === "states") {
      return NextResponse.json(fallbackStates)
    }

    if (type === "scam_types") {
      return NextResponse.json(fallbackScamTypes)
    }

    return NextResponse.json({ error: "Invalid lookup type" }, { status: 400 })
  } catch (error) {
    console.error("Error in fallback lookup:", error)
    return NextResponse.json({ error: "Failed to fetch lookup data" }, { status: 500 })
  }
}
