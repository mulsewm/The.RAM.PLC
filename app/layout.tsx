import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { StickyHeader } from "@/components/sticky-header"

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
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
