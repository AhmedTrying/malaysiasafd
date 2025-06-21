import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// --- ONE-TIME ADMIN2 CREATION SCRIPT ---
(async () => {
  if (!supabaseAdmin) return
  const username = "admin2"
  const password = "password"
  const role = "admin"

  // Check if admin2 already exists
  const { data: existingAdmin, error: checkError } = await supabaseAdmin
    .from("users")
    .select("username")
    .eq("username", username)
    .single()

  if (!existingAdmin && (!checkError || checkError.code === "PGRST116")) {
    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: `${username}@local.user`,
      password,
      email_confirm: true,
      user_metadata: {
        username,
        role,
      },
    })
    if (!authError && authData?.user) {
      // Create user profile
      await supabaseAdmin.from("users").insert({
        id: authData.user.id,
        username,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      console.log("✅ Admin2 user created: admin2 / password")
    }
  }
})()
// --- END ONE-TIME ADMIN2 CREATION SCRIPT ---

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin access not configured" }, { status: 500 })
    }

    const { username, password } = await request.json()

    // Validation
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if admin already exists
    const { data: existingAdmin, error: checkError } = await supabaseAdmin
      .from("users")
      .select("username")
      .eq("username", username)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      console.error("❌ Failed to check admin existence:", checkError)
      return NextResponse.json({ error: "Failed to check admin existence" }, { status: 500 })
    }

    if (existingAdmin) {
      return NextResponse.json({ error: "Admin user already exists" }, { status: 400 })
    }

    // Create auth user
    console.log("🚀 Creating admin auth user...")
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: `${username}@local.user`,
      password,
      email_confirm: true,
      user_metadata: {
        username,
        role: "admin",
      },
    })

    if (authError) {
      console.error("❌ Admin auth user creation failed:", authError)
      return NextResponse.json(
        {
          error: "Failed to create admin account",
          details: authError.message,
        },
        { status: 400 },
      )
    }

    if (!authData?.user) {
      console.error("❌ Admin auth user creation returned no user data")
      return NextResponse.json(
        {
          error: "Admin creation failed - no user data returned",
        },
        { status: 500 },
      )
    }

    // Create admin profile
    console.log("📝 Creating admin profile...")
    const { error: profileError } = await supabaseAdmin.from("users").insert({
      id: authData.user.id,
      username,
      role: "admin",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (profileError) {
      console.error("❌ Admin profile creation failed:", profileError)
      return NextResponse.json(
        {
          error: "Failed to create admin profile",
          details: profileError.message,
        },
        { status: 500 },
      )
    }

    console.log("✅ Admin user created successfully")
    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      user: {
        id: authData.user.id,
        username,
        role: "admin",
      },
    })
  } catch (error) {
    console.error("❌ Admin creation process exception:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
} 