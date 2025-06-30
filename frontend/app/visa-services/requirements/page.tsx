import { VisaRequirementsSection } from "@/components/visa-requirements-section"
import { VisaProcessSection } from "@/components/visa-process-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RequirementsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Visa Requirements & Process
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
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
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-foreground">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-muted/50 p-6 rounded-lg hover:bg-muted transition-colors">
              <h3 className="font-semibold text-lg mb-2">How long does the visa process take?</h3>
              <p className="text-muted-foreground">The standard processing time is 15-30 days, though this can vary based on the type of visa and your specific circumstances.</p>
            </div>
            <div className="bg-muted/50 p-6 rounded-lg hover:bg-muted transition-colors">
              <h3 className="font-semibold text-lg mb-2">Do I need to have a job offer first?</h3>
              <p className="text-muted-foreground">While having a job offer can expedite the process, we also assist healthcare professionals in securing positions after arrival.</p>
            </div>
            <div className="bg-muted/50 p-6 rounded-lg hover:bg-muted transition-colors">
              <h3 className="font-semibold text-lg mb-2">What documents will I need?</h3>
              <p className="text-muted-foreground">Typical requirements include your passport, educational certificates, professional licenses, and a clean criminal record. See our requirements section for a complete list.</p>
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
            <Link href="/account-creation">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Create Account
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
    </>
  )
}