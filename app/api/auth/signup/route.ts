import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// --- ONE-TIME ADMIN CREATION SCRIPT ---
(async () => {
  if (!supabaseAdmin) return
  const adminEmail = "admin@example.com"
  const adminPassword = "password"
  const adminUsername = "admin"
  const adminFullName = "Administrator"
  const adminRole = "admin"

  // Check if admin already exists
  const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
  if (!listError && !existingUsers.users.some((user) => user.email === adminEmail)) {
    // Create admin user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        username: adminUsername,
        full_name: adminFullName,
        role: adminRole,
      },
    })
    if (!authError && authData?.user) {
      // Create user profile
      await supabaseAdmin.from("users").upsert({
        id: authData.user.id,
        username: adminUsername,
        full_name: adminFullName,
        role: adminRole,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id', ignoreDuplicates: false })
      console.log("✅ Admin user created: admin@example.com / password")
    }
  }
})();
// --- END ADMIN CREATION SCRIPT ---

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin access not configured" }, { status: 500 })
    }

    const { username, password, role } = await request.json()

    console.log("=== SIGNUP ATTEMPT ===")
    console.log("Username:", username)
    console.log("Role:", role)

    // Validation
    if (!username || !password) {
      console.log("❌ Validation failed: Missing required fields")
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      console.log("❌ Validation failed: Password too short")
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    // Check if username already exists
    const { data: existingUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("username")
      .eq("username", username)
      .single()

    if (userError && userError.code !== "PGRST116") { // PGRST116 is "no rows returned"
      console.error("❌ Failed to check username:", userError)
      return NextResponse.json({ error: "Failed to check username availability" }, { status: 500 })
    }

    if (existingUser) {
      console.log("❌ Username already exists")
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }

    // Create auth user with username as email
    console.log("🚀 Creating auth user...")
    let authUserId: string
    try {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: `${username}@local.user`, // Use a dummy email format
        password,
        email_confirm: true, // Auto-confirm since we're not using email
        user_metadata: {
          username,
          role: role || "viewer",
        },
      })

      if (authError) {
        console.error("❌ Auth user creation failed:", authError)
        return NextResponse.json(
          {
            error: "Failed to create user account",
            details: authError.message,
          },
          { status: 400 },
        )
      }

      if (!authData?.user) {
        console.error("❌ Auth user creation returned no user data")
        return NextResponse.json(
          {
            error: "User creation failed - no user data returned",
          },
          { status: 500 },
        )
      }

      authUserId = authData.user.id
      console.log("✅ Auth user created successfully:", authUserId)
    } catch (authErr) {
      console.error("❌ Auth creation exception:", authErr)
      return NextResponse.json(
        {
          error: "Authentication service error",
          details: authErr instanceof Error ? authErr.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    // Create user profile
    console.log("📝 Creating user profile...")
    try {
      // First, check if the user profile already exists
      const { data: existingProfile, error: checkError } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("id", authUserId)
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        console.error("❌ Failed to check existing profile:", checkError)
        return NextResponse.json(
          {
            error: "Failed to check existing profile",
            details: checkError.message,
          },
          { status: 500 },
        )
      }

      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabaseAdmin
          .from("users")
          .update({
            username,
            role: role || "viewer",
            updated_at: new Date().toISOString(),
          })
          .eq("id", authUserId)

        if (updateError) {
          console.error("❌ Profile update failed:", updateError)
          return NextResponse.json(
            {
              error: "Failed to update user profile",
              details: updateError.message,
            },
            { status: 500 },
          )
        }
        console.log("✅ User profile updated successfully")
      } else {
        // Create new profile
        const { error: insertError } = await supabaseAdmin
          .from("users")
          .insert({
            id: authUserId,
            username,
            role: role || "viewer",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

        if (insertError) {
          console.error("❌ Profile creation failed:", insertError)
          return NextResponse.json(
            {
              error: "Failed to create user profile",
              details: insertError.message,
            },
            { status: 500 },
          )
        }
        console.log("✅ User profile created successfully")
      }
    } catch (profileErr) {
      console.error("❌ Profile creation/update exception:", profileErr)
      return NextResponse.json(
        {
          error: "Profile operation failed",
          details: profileErr instanceof Error ? profileErr.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    console.log("🎉 User signup completed successfully")
    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      user: {
        id: authUserId,
        username,
        role,
      },
    })
  } catch (error) {
    console.error("❌ Signup process exception:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
