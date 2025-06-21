import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin access not configured" }, { status: 500 })
    }

    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 })
    }

    // First, get the user's email from the users table
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, username, role")
      .eq("username", username)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
    }

    // Authenticate user using the dummy email format
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: `${username}@local.user`,
      password,
    })

    if (signInError || !signInData.user) {
      return NextResponse.json({ message: "Invalid username or password" }, { status: 401 })
    }

    return NextResponse.json({
      id: userData.id,
      username: userData.username,
      role: userData.role,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { message: "Internal server error", details: error instanceof Error ? error.message : error },
      { status: 500 }
    )
  }
} 