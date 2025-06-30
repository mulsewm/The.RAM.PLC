import { SuccessStoriesSection } from "@/components/success-stories-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 bg-gradient-to-b from-primary/5 to-white">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image
            src="/grid-pattern.svg"
            alt="Background Pattern"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-2 text-primary">
              Success Stories
            </h1>
            <p className="text-xl text-gray-600">
              Discover how healthcare professionals like you have successfully started their careers in the GCC region.
            </p>
          </div>
        </div>
      </section>

      {/* Success Stories Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <SuccessStoriesSection />
        </div>
      </section>

      {/* Video Testimonials Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2 text-primary">Video Testimonials</h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Watch our healthcare professionals share their experiences and success stories.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Placeholder for video testimonials */}
            {[1, 2, 3].map((index) => (
              <div key={index} className="aspect-video bg-white rounded-lg shadow-lg hover:shadow-xl transition-all">
                <div className="w-full h-full flex items-center justify-center text-primary/60">
                  Video Testimonial {index}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">2000+</div>
              <div className="text-gray-600">Doctors Placed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1500+</div>
              <div className="text-gray-600">Nurses Hired</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Partner Hospitals</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">6</div>
              <div className="text-gray-600">GCC Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-2">Join Our Success Stories</h2>
          <p className="text-xl mb-6 text-primary-foreground/90">
            Take the first step towards your career in the GCC healthcare sector.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/apply">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Apply Now
              </Button>
            </Link>
            <Link href="/visa-services/requirements">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-primary-dark">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 