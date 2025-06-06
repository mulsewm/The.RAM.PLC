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
import { AuthProvider, useAuth } from "@/lib/auth-provider"
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
    <AuthProvider>
      <AdminLayoutContent>
        {children}
        <ChatWidget />
      </AdminLayoutContent>
    </AuthProvider>
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

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      toast.error("Please login to access the admin dashboard")
    }
  }, [isLoading, isAuthenticated, router])

  // Handle logout
  const handleLogout = async () => {
    await logout()
  }

  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Mobile sidebar toggle */}
            <div className="lg:hidden fixed top-0 left-0 w-full bg-white dark:bg-gray-800 z-50 flex items-center justify-between p-4 border-b">
              <Link href="/admin" className="font-bold text-xl text-teal-600">
                the.RAM.plc Admin
              </Link>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Overlay to close sidebar on mobile */}
            <div
              className={`fixed inset-0 z-40 ${sidebarOpen ? 'block' : 'hidden'} bg-black/50 lg:hidden`}
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div
              className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 w-64 shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
              }`}
            >
              <div className="p-6 border-b">
                <Link href="/admin" className="font-bold text-xl text-teal-600">
                  the.RAM.plc Admin
                </Link>
              </div>
              <nav className="mt-6 px-4">
                <ul className="space-y-2">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`flex items-center p-3 rounded-md transition-colors ${
                            isActive
                              ? "bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <item.icon size={20} className="mr-3" />
                          <span>{item.name}</span>
                          {isActive && (
                            <div
                              className="absolute left-0 w-1 h-8 bg-teal-600 dark:bg-teal-400 rounded-r-md"
                            />
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
              <div className="absolute bottom-0 left-0 w-full p-4 border-t">
                <div className="flex items-center gap-2 px-2">
                  <div className="h-8 w-8 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium">{user?.name || "Admin User"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || "admin@example.com"}</p>
                  </div>
                </div>
                <nav className="grid items-start px-2 text-sm font-medium">
                  <Link
                    href="/admin"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent",
                      pathname === "/admin" ? "bg-accent" : "transparent"
                    )}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  {/* Only show Users link for ADMIN and SUPER_ADMIN */}
                  {user?.role && ["ADMIN", "SUPER_ADMIN"].includes(user.role) && (
                    <Link
                      href="/admin/users"
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent",
                        pathname === "/admin/users" ? "bg-accent" : "transparent"
                      )}
                    >
                      <Users className="h-4 w-4" />
                      <span>Users</span>
                    </Link>
                  )}
                  <Link
                    href="/admin/partnerships"
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent",
                      pathname === "/admin/partnerships" ? "bg-accent" : "transparent"
                    )}
                  >
                    <Handshake className="h-4 w-4" />
                    <span>Partnerships</span>
                  </Link>
                  {/* Only show Settings link for ADMIN and SUPER_ADMIN */}
                  {user?.role && ["ADMIN", "SUPER_ADMIN"].includes(user.role) && (
                    <Link
                      href="/admin/settings"
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent",
                        pathname === "/admin/settings" ? "bg-accent" : "transparent"
                      )}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  )}
                  {/* Only show Audit Logs link for ADMIN and SUPER_ADMIN */}
                  {user?.role && ["ADMIN", "SUPER_ADMIN"].includes(user.role) && (
                    <Link
                      href="/admin/audit-logs"
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent",
                        pathname === "/admin/audit-logs" ? "bg-accent" : "transparent"
                      )}
                    >
                      <FileText className="h-4 w-4" />
                      <span>Audit Logs</span>
                    </Link>
                  )}
                  {/* Logout button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-accent mt-4 text-red-500"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64 pt-16 lg:pt-0">
              <PartnershipProvider>
                <main className="p-6">{children}</main>
                {/* Simple copyright footer */}
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
