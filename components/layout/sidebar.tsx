"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, FileText, Users, Settings, HelpCircle, LogOut, Shield, FileDown, CheckSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { hasPermission } from "@/lib/roles"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3, permission: "view_dashboard" },
  { name: "Generate Report", href: "/generate-report", icon: FileText, permission: "generate_reports" },
  { name: "Review Reports", href: "/admin/review-reports", icon: CheckSquare, permission: "edit_reports" },
  { name: "Manage Users", href: "/manage-users", icon: Users, permission: "manage_users" },
  { name: "Generate PDF", href: "/generate-pdf", icon: FileDown, permission: "save_csv" },
  { name: "Policies", href: "/policies", icon: HelpCircle, permission: "view_dashboard" },
  { name: "Settings", href: "/settings", icon: Settings, permission: "view_dashboard" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const { user, signOut } = useAuth()

  const handleLogout = () => {
    signOut()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    })
  }

  if (!user) return null

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900">
      <div className="flex items-center px-6 py-4">
        <Shield className="h-8 w-8 text-blue-400" />
        <div className="ml-3">
          <h1 className="text-lg font-semibold text-white">Malaysia Scam</h1>
          <p className="text-sm text-gray-400">Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">MENU</div>
        {navigation.map((item) => {
          // Hide items based on user permissions
          if (!hasPermission(user.role, item.permission)) {
            return null
          }

          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}

        <div className="pt-6">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">OTHERS</div>
          <button
            onClick={handleLogout}
            className="group flex w-full items-center px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </nav>
    </div>
  )
}
