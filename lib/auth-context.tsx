"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { UserRole, hasPermission } from "./roles"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface User {
  id: string
  username: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (username: string, password: string) => Promise<void>
  signOut: () => void
  hasPermission: (permissionId: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (username: string, password: string) => {
    try {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${username}@local.user`,
        password,
      });
      if (error || !data.user) {
        throw new Error(error?.message || "Failed to sign in");
      }
      // Store user info (id, username, role) in state and localStorage
      const userData = {
        id: data.user.id,
        username: username,
        role: data.user.user_metadata?.role || 'user',
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      throw error;
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  const checkPermission = (permissionId: string): boolean => {
    if (!user) return false
    return hasPermission(user.role, permissionId)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        hasPermission: checkPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
