'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { hasPermission, UserRole } from '@/lib/roles'

interface RouteGuardProps {
  children: React.ReactNode
  requiredPermission?: string
  requiredRole?: UserRole
}

export function RouteGuard({ children, requiredPermission, requiredRole }: RouteGuardProps) {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (requiredRole && user.role !== requiredRole) {
      router.push('/dashboard')
      return
    }

    if (requiredPermission && !hasPermission(user.role as UserRole, requiredPermission)) {
      router.push('/dashboard')
      return
    }
  }, [user, router, requiredPermission, requiredRole])

  if (!user) {
    return null
  }

  if (requiredRole && user.role !== requiredRole) {
    return null
  }

  if (requiredPermission && !hasPermission(user.role as UserRole, requiredPermission)) {
    return null
  }

  return <>{children}</>
} 