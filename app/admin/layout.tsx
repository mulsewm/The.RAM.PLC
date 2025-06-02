"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Users, 
  Briefcase, 
  BarChart, 
  Settings, 
  Menu, 
  X,
  LogOut
} from "lucide-react"
import { PartnershipProvider } from "@/lib/partnership-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: BarChart,
    },
    {
      name: "Partnership Applications",
      href: "/admin/partnerships",
      icon: Briefcase,
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
                            <motion.div
                              layoutId="sidebar-indicator"
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
                <Link
                  href="/"
                  className="flex items-center p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <LogOut size={20} className="mr-3" />
                  <span>Back to Website</span>
                </Link>
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
