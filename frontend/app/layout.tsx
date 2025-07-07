import { Inter } from "next/font/google"
import { ClientWrapper } from "./client-wrapper"
import "./globals.css"
import { metadata } from "./metadata"
import { SiteLayout } from "@/components/layout/site-layout"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
})

export { metadata }

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ClientWrapper>
          <SiteLayout>
            {children}
          </SiteLayout>
        </ClientWrapper>
      </body>
    </html>
  )
}
