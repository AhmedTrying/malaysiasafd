import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (type === "states") {
      const { data: states, error } = await supabaseAdmin.from("states").select("id, name, code").order("name")

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }
      return NextResponse.json(states || [])
    }

    if (type === "scam_types") {
      const { data: scamTypes, error } = await supabaseAdmin
        .from("scam_types")
        .select("id, name, description")
        .order("name")

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }
      return NextResponse.json(scamTypes || [])
    }

    return NextResponse.json({ error: "Invalid lookup type" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching lookup data:", error)
    return NextResponse.json({ error: "Failed to fetch lookup data" }, { status: 500 })
  }
}
