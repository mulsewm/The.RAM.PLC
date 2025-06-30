import { VisaTypesSection } from "@/components/visa-types-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle, Clock, Users, Award } from "lucide-react"

export default function VisaServicesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/world-map-detailed.svg"
            alt="World Map"
            fill
            className="object-cover opacity-10"
          />
        </div>
        <div className="container mx-auto px-4 z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Healthcare Visa Services for GCC
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Streamlined visa processing for healthcare professionals looking to advance their careers in the Gulf region.
            </p>
            <div className="flex gap-4">
              <Link href="/visa-services/requirements">
                <Button className="bg-primary hover:bg-primary/90 text-lg px-8 py-6">
                  View Requirements
                </Button>
              </Link>
              <Link href="/apply">
                <Button variant="outline" className="text-lg px-8 py-6 border-primary text-primary hover:bg-primary/10">
                  Start Application
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white -mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-1">98%</div>
                  <div className="text-gray-600">Success Rate</div>
                  <p className="text-sm text-gray-500 mt-2">Consistently high approval rate for healthcare professionals</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-1">15-30</div>
                  <div className="text-gray-600">Days Processing</div>
                  <p className="text-sm text-gray-500 mt-2">Fast-track processing for healthcare visas</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 duration-300">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-1">5000+</div>
                  <div className="text-gray-600">Professionals Placed</div>
                  <p className="text-sm text-gray-500 mt-2">Successfully placed healthcare experts across GCC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-primary">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive support throughout your visa application journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Award className="h-8 w-8" />,
                title: "Expert Guidance",
                description: "Dedicated visa specialists to guide you through the process"
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: "Fast Processing",
                description: "Expedited processing with priority handling"
              },
              {
                icon: <CheckCircle className="h-8 w-8" />,
                title: "High Success Rate",
                description: "Proven track record of successful applications"
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "24/7 Support",
                description: "Round-the-clock assistance for all your queries"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-primary/5 transition-colors">
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2 text-primary">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visa Types Section */}
      <VisaTypesSection />

      {/* CTA Section */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-2">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-6 text-primary-foreground/90">
            Join thousands of healthcare professionals who have successfully relocated to the GCC region.
          </p>
          <Link href="/apply">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              Apply Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
} 