"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Settings,
  Handshake,
  FileText,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { PartnershipProvider } from "@/lib/partnership-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import ChatWidget from "@/components/chatbot/ChatWidget"
const inter = Inter({ subsets: ["latin"] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminLayoutContent>
      {children}
      <ChatWidget />
    </AdminLayoutContent>
  )
}

function AdminLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, isLoading, user });
    
    // Redirect to login if not authenticated and not loading
    if (!isLoading && !isAuthenticated) {
      console.log('Redirecting to login, not authenticated');
      router.replace('/login');
      return;
    }
  }, [isAuthenticated, isLoading, router, user]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Successfully logged out')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to log out. Please try again.')
    }
  }

  // Show loading state or nothing if not authenticated
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Partnership Applications",
      href: "/admin/partnerships",
      icon: Handshake,
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: Users,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
    {
      name: "Audit Logs",
      href: "/admin/audit-logs",
      icon: FileText,
    },
  ]

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <div className="flex h-screen">
            {/* Sidebar */}
            <div className={cn(
              "fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out dark:bg-gray-800 lg:translate-x-0 lg:shadow-none",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="absolute right-4 top-4 lg:hidden"
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              {/* Sidebar content */}
              <div className="flex h-full flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                  <nav>
                    <ul className="space-y-1">
                      {navItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={cn(
                                "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                isActive
                                  ? "bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                              )}
                            >
                              <item.icon size={20} className="mr-3" />
                              <span>{item.name}</span>
                              {isActive && (
                                <div className="absolute left-0 w-1 h-8 bg-teal-600 dark:bg-teal-400 rounded-r-md" />
                              )}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  </nav>
                </div>

                {/* User info and logout */}
                <div className="border-t p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">{user?.name || "Admin User"}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || "admin@example.com"}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 lg:pl-64">
              <PartnershipProvider>
                <main className="container mx-auto p-6">
                  {children}
                </main>
                <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                  © {new Date().getFullYear()} the.RAM.plc. All rights reserved.
                </footer>
              </PartnershipProvider>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}