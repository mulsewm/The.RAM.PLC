"use client"

import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "./providers"
import ConditionalLayout from "@/components/conditional-layout"
import ChatWidget from "@/components/chatbot/ChatWidget"

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Providers>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <ChatWidget />
      </Providers>
      <Toaster />
    </Suspense>
  )
} 