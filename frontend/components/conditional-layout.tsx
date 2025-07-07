"use client"

import { usePathname } from "next/navigation"

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/test-login')
  
  // Don't wrap with layout for auth pages or admin pages
  if (isAuthPage || isAdminPage) {
    return <>{children}</>
  }
  
  return <>{children}</>
}
