import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// Get all users (admin only)
export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin access not configured" }, { status: 500 })
    }

    const { data: users, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Format users for the frontend
    const formattedUsers =
      users?.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email || "N/A",
        role: user.role,
        created: user.created_at?.split("T")[0] || "Unknown",
        lastLogin: user.last_login?.split("T")[0] || undefined,
      })) || []

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// Create new user (admin only)
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin access not configured" }, { status: 500 })
    }

    const { username, email, password, role } = await request.json()

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        username,
        role,
      },
    })

    if (authError) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    // Insert into users table with correct role
    if (authData?.user) {
      const { error: profileError } = await supabaseAdmin.from("users").insert({
        id: authData.user.id,
        username,
        email,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
      })
      if (profileError) {
        console.error("Profile creation failed:", profileError)
        return NextResponse.json({ error: profileError.message }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      user: authData.user,
      message: "User created successfully",
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

// Delete user (admin only)
export async function DELETE(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin access not configured" }, { status: 500 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // First, get the user's auth_id
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("auth_id")
      .eq("id", id)
      .single()

    if (userError) {
      console.error("Error fetching user:", userError)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete from auth.users
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      userData.auth_id
    )

    if (authError) {
      console.error("Error deleting auth user:", authError)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    // Delete from users table
    const { error: deleteError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", id)

    if (deleteError) {
      console.error("Error deleting user:", deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
