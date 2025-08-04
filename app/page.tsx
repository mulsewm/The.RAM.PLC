import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Import HeroSection directly since it's a core component
import { HeroSection } from '@/components/ui/hero-section';

// Lazy load other sections for better performance
const AboutSection = dynamic(() => import('@/components/about-section'), { 
  ssr: true,
  loading: () => <div className="h-96 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
});

const ServicesSection = dynamic(() => import('@/components/services-section'), { 
  ssr: true,
  loading: () => <div className="h-96 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
});

const NumbersSection = dynamic(() => import('@/components/numbers-section'), { 
  ssr: true,
  loading: () => <div className="h-64 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
});

const ClientLogos = dynamic(() => import('@/components/client-logos'), { 
  ssr: true,
  loading: () => <div className="h-40 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
});

const WhyChooseUsSection = dynamic(() => import('@/components/why-choose-us-section'), { 
  ssr: true,
  loading: () => <div className="h-96 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
});

const TestimonialsSection = dynamic(() => import('@/components/testimonials-section'), { 
  ssr: true,
  loading: () => <div className="h-96 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
});

const ContactSection = dynamic(() => import('@/components/contact-section'), { 
  ssr: true,
  loading: () => <div className="h-96 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
});

const GlobalReachSection = dynamic(() => import('@/components/global-reach-section'), { 
  ssr: true,
  loading: () => <div className="h-96 w-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" />
});

export const metadata: Metadata = {
  title: 'The.RAM.PLC - Trusted Verification & Risk Assessment',
  description: 'Premier global consultancy services in verification, data analytics, and risk assessment for confident business decisions.',
  keywords: ['verification', 'risk assessment', 'data analytics', 'business consultancy', 'GCC application'],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <AboutSection />
      <GlobalReachSection />
      <WhyChooseUsSection />
      <NumbersSection />
      <ServicesSection />
      <ClientLogos />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}