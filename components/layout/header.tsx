"use client"

import { useRouter } from "next/navigation"
import { Search, Bell } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"

export function Header() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem("user")
    sessionStorage.clear()

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    })

    // Redirect to login page
    router.push("/login")
  }

  const handleProfile = () => {
    router.push("/profile")
  }

  const handleSettings = () => {
    router.push("/settings")
  }

  const handleFeedback = () => {
    router.push("/feedback")
  }

  const handleAdminDashboard = () => {
    router.push("/admin")
  }

  const handleManageScamTypes = () => {
    router.push("/admin/scam-types")
  }

  const handleViewFeedback = () => {
    router.push("/admin/feedback")
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search..." className="pl-10 bg-gray-50 border-gray-200" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <Button variant="ghost" onClick={handleFeedback}>
              Provide Feedback
            </Button>
          )}

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user?.username?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user?.username || "User"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleProfile}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings}>Settings</DropdownMenuItem>
              {user?.role === 'admin' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleAdminDashboard}>Admin Dashboard</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleManageScamTypes}>Manage Scam Types</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleViewFeedback}>View Feedback</DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
