import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ConditionalLayout from "@/components/conditional-layout"
import ChatWidget from "@/components/chatbot/ChatWidget"
import { ToastProvider } from "@/components/providers/toast-provider"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "the.RAM.plc | African Expertise in Global Verification & Analytics",
  description:
    "Experts in Primary Source Verification, Background Screening, Mystery Shopping, Data Analytics, and Risk Assessment across Africa.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <ChatWidget />
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}
