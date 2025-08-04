import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpCircle, FileText, MessageSquare, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ApplicationLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
          {/* Main Content - Takes full width on mobile, 3/4 on larger screens */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden bg-white shadow-xl sm:rounded-2xl">
              {children}
            </div>
          </div>

          {/* Sidebar - Stacks below on mobile, right on larger screens */}
          <div className="space-y-4 lg:space-y-6">
            {/* Application Info Card */}
            <Card className="border-0 shadow-md">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg font-bold text-gray-900 sm:text-xl">
                  Healthcare Visa Application
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                <p className="mb-4 text-sm text-gray-600 sm:text-base">
                  Complete your visa application for healthcare positions in the GCC region. 
                  Our streamlined process helps medical professionals secure their visas efficiently.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="visa-services/requirements" className="flex items-center justify-center">
                    <FileText className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span>View Requirements</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Success Stories Card */}
            <Card className="border-0 shadow-md">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg font-bold text-gray-900 sm:text-xl">
                  Success Stories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-0 sm:space-y-4 sm:p-6 sm:pt-0">
                {[
                  { text: "Dr. Sarah secured a position in Dubai within 2 weeks!", icon: "🇦🇪" },
                  { text: "Nurse James found his dream job in Riyadh through our platform.", icon: "🇸🇦" },
                  { text: "Over 500+ healthcare professionals placed in GCC countries.", icon: "🏥" },
                ].map((story, i) => (
                  <div key={i} className="flex items-start">
                    <span className="mr-2 mt-0.5 text-lg">{story.icon}</span>
                    <p className="text-sm text-gray-600">{story.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Support Card */}
            <Card className="border-0 shadow-md">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg font-bold text-gray-900 sm:text-xl">
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
                <p className="text-sm text-gray-600 sm:text-base">
                  Our support team is available 24/7 to assist you with your application.
                </p>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-center" asChild>
                    <Link href="/contact" className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>Contact Support</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-center" asChild>
                    <Link href="/faq" className="flex items-center">
                      <HelpCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span>View FAQ</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
