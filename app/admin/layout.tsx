"use client"

import { useState, useEffect, Suspense } from "react"
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
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button"
const inter = Inter({ subsets: ["latin"] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isLoading && isClient && (!user || user.role !== "ADMIN")) {
      router.push("/unauthorized")
    }
  }, [user, isLoading, isClient, router])

  if (isLoading || !isClient) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!user || user.role !== "ADMIN") {
    return null
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Partnerships', href: '/admin/partnerships', icon: Handshake },
    { name: 'Documents', href: '/admin/documents', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <PartnershipProvider>
      <div className="flex h-screen">
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <SidebarGroup>
                <SidebarGroupLabel className="text-lg font-semibold">
                  Admin Panel
                </SidebarGroupLabel>
              </SidebarGroup>
            </SidebarHeader>
            <SidebarContent>
              <nav className="space-y-1 p-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.name}
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => router.push(item.href)}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  )
                })}
              </nav>
            </SidebarContent>
            <SidebarFooter>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </SidebarFooter>
          </Sidebar>
          <main className="flex-1 overflow-y-auto p-8">
            <Suspense fallback={<div>Loading...</div>}>
              {children}
            </Suspense>
          </main>
          <ChatWidget />
        </SidebarProvider>
      </div>
    </PartnershipProvider>
  )
}