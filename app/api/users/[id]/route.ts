import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// Update user
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin access not configured" }, { status: 500 })
    }
    const { username, email, role } = await request.json()
    const userId = params.id

    // Always use a valid email format
    const validEmail = email && email.includes('@') ? email : `${username}@local.user`

    // Update user profile
    const { error: profileError } = await supabaseAdmin
      .from("users")
      .update({
        username,
        role,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (profileError) {
      console.error("Profile update error:", profileError)
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // Update auth user email if changed
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email: validEmail,
      user_metadata: { username, role },
    })

    if (authError) {
      console.error("Auth update error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

// Delete user
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin access not configured" }, { status: 500 })
    }
    const userId = params.id

    // Delete from Auth
    if (typeof userId === "string") {
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
      // If error is 404 (user not found), ignore it
      if (authDeleteError && authDeleteError.status !== 404) {
        return NextResponse.json({ error: authDeleteError.message }, { status: 500 })
      }
    }
    // Always delete from users table
    const { error: userDeleteError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", userId)
    if (userDeleteError) {
      return NextResponse.json({ error: userDeleteError.message }, { status: 500 })
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
