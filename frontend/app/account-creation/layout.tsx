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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              {children}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Info Card */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Healthcare Visa Application
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Complete your visa application for healthcare positions in the GCC region. 
                  Our streamlined process helps medical professionals secure their visas efficiently.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="visa-services/requirements">
                    <FileText className="mr-2 h-4 w-4" />
                    View Requirements
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Success Stories Card */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Success Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Dr. Sarah Johnson</p>
                      <p className="text-sm text-gray-600">Secured a position in Dubai within 3 weeks</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Nurse Michael Tan</p>
                      <p className="text-sm text-gray-600">Successfully relocated to Riyadh with family</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="border-0 shadow-md bg-blue-50 border-l-4 border-blue-500">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <HelpCircle className="h-5 w-5 text-blue-600 mr-2" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Our support team is available 24/7 to assist you with your application.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
