"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { StickyHeader } from "@/components/sticky-header"

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/test-login')
  
  return (
    <>
      {!isAdminPage && !isAuthPage && (
        <>
          <Navbar />
          <StickyHeader />
        </>
      )}
      <main>{children}</main>
      {!isAdminPage && !isAuthPage && <Footer />}
    </>
  )
}
