"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { StickyHeader } from "@/components/sticky-header"
import dynamic from 'next/dynamic'

// Dynamically import the ChatWidget with SSR disabled
const ChatWidget = dynamic(
  () => import('@/components/chatbot/ChatWidget').then((mod) => mod.default),
  { ssr: false }
)

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
      <ChatWidget />
    </>
  )
}