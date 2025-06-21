import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST() {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Admin access not configured" }, { status: 500 })
  }
  const username = "admin2"
  const password = "password"
  const role = "admin"
  let deleted = false
  let created = false
  let userId: string | null = null
  let errors: string[] = []

  // 1. Find and delete from users table
  const { data: userRow, error: userRowError } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("username", username)
    .single()
  if (userRow && userRow.id) {
    userId = userRow.id
    // Delete from Auth
    if (typeof userId === "string") {
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
      if (authDeleteError) errors.push("Auth delete: " + authDeleteError.message)
    }
    // Delete from users table
    const { error: userDeleteError } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", userId)
    if (userDeleteError) errors.push("Users table delete: " + userDeleteError.message)
    deleted = true
  }

  // 2. Create new admin2 user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: `${username}@local.user`,
    password,
    email_confirm: true,
    user_metadata: {
      username,
      role,
    },
  })
  if (authError) {
    errors.push("Auth create: " + authError.message)
    return NextResponse.json({ error: errors.join("; ") }, { status: 500 })
  }
  if (authData?.user) {
    userId = authData.user.id
    // Delete any users table row with this id (in case of orphaned row)
    await supabaseAdmin.from("users").delete().eq("id", userId)
    // Now insert the new profile
    const { error: profileError } = await supabaseAdmin.from("users").insert({
      id: userId,
      username,
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    if (profileError) {
      errors.push("Profile create: " + profileError.message)
      return NextResponse.json({ error: errors.join("; ") }, { status: 500 })
    }
    created = true
  }

  return NextResponse.json({
    success: true,
    deleted,
    created,
    user: { username, password, role },
    errors: errors.length ? errors : undefined,
  })
} 