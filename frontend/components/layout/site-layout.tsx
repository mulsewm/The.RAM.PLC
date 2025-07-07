"use client"

import { ReactNode } from "react"
import { MainNav } from "../ui/main-nav"
import { SiteFooter } from "../ui/site-footer"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SiteLayoutProps {
  children: ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/test-login'
  const isAdminPage = pathname?.startsWith('/admin')

  // Don't show layout for auth pages or admin pages
  if (isAuthPage || isAdminPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="relative">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <MainNav />
          </div>
        </header>
      </div>
      <main className="flex-1 relative z-10">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
