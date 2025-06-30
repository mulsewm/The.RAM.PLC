import { VisaRequirementsSection } from "@/components/visa-requirements-section"
import { VisaProcessSection } from "@/components/visa-process-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RequirementsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 text-primary">
              Visa Requirements & Process
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Everything you need to know about the documentation and steps required for your healthcare visa application.
            </p>
          </div>
        </div>
      </section>

      {/* Requirements Section with updated styling */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <VisaRequirementsSection />
        </div>
      </section>

      {/* Process Section with updated styling */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <VisaProcessSection />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-primary/5 p-6 rounded-lg hover:bg-primary/10 transition-colors">
              <h3 className="font-semibold mb-2">How long does the visa process take?</h3>
              <p className="text-gray-600">The standard processing time is 15-30 days, though this can vary based on the type of visa and your specific circumstances.</p>
            </div>
            <div className="bg-primary/5 p-6 rounded-lg hover:bg-primary/10 transition-colors">
              <h3 className="font-semibold mb-2">Do I need to have a job offer first?</h3>
              <p className="text-gray-600">While having a job offer can expedite the process, we also assist healthcare professionals in securing positions after arrival.</p>
            </div>
            <div className="bg-primary/5 p-6 rounded-lg hover:bg-primary/10 transition-colors">
              <h3 className="font-semibold mb-2">What happens after I submit my application?</h3>
              <p className="text-gray-600">Our team will review your application within 48 hours and guide you through the next steps, including document verification and authority submissions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Application?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Our team is here to support you throughout the entire process.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/apply">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Start Application
              </Button>
            </Link>
            <Link href="/chat">
              <Button size="lg" variant="outline" className="text-black border-white hover:bg-primary-dark">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 