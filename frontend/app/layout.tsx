import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import ConditionalLayout from "@/components/conditional-layout"
import ChatWidget from "@/components/chatbot/ChatWidget"

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
        <Providers>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <ChatWidget />
        </Providers>
      </body>
    </html>
  )
}
