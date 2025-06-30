import { RegistrationForm } from "@/components/registration/registration-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex mb-8 text-sm text-gray-500">
            <Link href="/visa-services" className="hover:text-primary">
              Visa Services
            </Link>
            <span className="mx-2">/</span>
            <span className="text-primary">Apply</span>
          </nav>

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-primary">Healthcare Visa Application</h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Complete your visa application for healthcare positions in the GCC region. Our streamlined process helps medical professionals secure their visas efficiently.
            </p>
            <div className="flex justify-center gap-4 mb-12">
              <Link href="/visa-services/requirements">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  View Requirements
                </Button>
              </Link>
              <Link href="/visa-services/testimonials">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  Success Stories
                </Button>
              </Link>
            </div>
          </div>

          {/* Support Info */}
          <div className="bg-primary/5 rounded-lg p-6 mb-12">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1 text-primary">Need Help?</h3>
                <p className="text-sm text-gray-600">Our support team is available 24/7 to assist you with your application.</p>
              </div>
              <Link href="/contact">
                <Button variant="secondary" className="bg-primary text-white hover:bg-primary/90">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>

          {/* Application Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <RegistrationForm />
          </div>
        </div>
      </div>
    </div>
  )
} 