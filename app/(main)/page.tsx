import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import ServicesSection from "@/components/services-section"
import ClientLogos from "@/components/client-logos"
import WhyChooseUsSection from "@/components/why-choose-us-section"
import TestimonialsSection from "@/components/testimonials-section"
import ContactSection from "@/components/contact-section"

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ClientLogos />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  )
}
