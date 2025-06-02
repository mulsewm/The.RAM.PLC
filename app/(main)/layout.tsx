"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { StickyHeader } from "@/components/sticky-header"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <StickyHeader />
      <main>{children}</main>
      <Footer />
    </>
  )
}
