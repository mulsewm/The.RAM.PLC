"use client"

import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-provider"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "./providers"
import ConditionalLayout from "@/components/conditional-layout"
import ChatWidget from "@/components/chatbot/ChatWidget"

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Providers>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <ChatWidget />
          </Providers>
        </Suspense>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
} 