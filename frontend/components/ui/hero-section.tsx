"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion, useReducedMotion, Variants } from "framer-motion"
import { PartnerCTA } from "@/components/partner-cta"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Animation variants with proper TypeScript types
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1] // Custom ease curve
      }
    },
  };

  const image: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
        delay: 0.2 
      }
    },
  };

  const shouldAnimate = !prefersReducedMotion

  return (
    <section
      id="home"
      className="relative min-h-[90vh] md:min-h-screen flex items-center pt-16 md:pt-20 bg-gradient-to-br from-gray-50 to-teal-50 dark:from-gray-900 dark:to-gray-800"
      aria-label="Hero Section"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-teal-100 dark:bg-teal-900 rounded-l-full transform translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-3/4 h-1/3 bg-teal-50 dark:bg-teal-800 rounded-tr-full" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={shouldAnimate ? "hidden" : "show"}
            animate="show"
            variants={shouldAnimate ? container : undefined}
            className="text-center lg:text-left"
          >
            <motion.h1 
              variants={shouldAnimate ? item : undefined}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white leading-tight"
            >
              <span className="text-teal-600 dark:text-teal-400">Trusted Verification.</span>{' '}
              <span className="block sm:inline">Actionable Insights.</span>{' '}
              <span className="text-teal-600 dark:text-teal-400">African Expertise.</span>
            </motion.h1>
            
            <motion.p 
              variants={shouldAnimate ? item : undefined}
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              The.RAM.PLC delivers premier global consultancy services in verification, data analytics, and risk assessment.
            </motion.p>
            
            <motion.div 
              variants={shouldAnimate ? item : undefined}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Link href="/account-creation" className="w-full sm:w-auto">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white text-lg py-6 px-8 shadow-lg hover:shadow-xl transition-all"
                >
                  Apply for GCC
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <div className="w-full sm:w-auto">
                <PartnerCTA 
                  variant="secondary" 
                  className="w-full sm:w-auto text-lg py-6 px-8 shadow-lg hover:shadow-xl transition-all" 
                  showIcon={true}
                />
              </div>
            </motion.div>
            
            <motion.div 
              variants={shouldAnimate ? item : undefined}
              className="mt-8 md:mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <div className="flex -space-x-3 sm:-space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold"
                    aria-hidden="true"
                  >
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Trusted by leading organizations worldwide
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={shouldAnimate ? "hidden" : "show"}
            animate="show"
            variants={shouldAnimate ? image : undefined}
            className="relative mt-12 lg:mt-0"
          >
            <div className="relative aspect-video lg:aspect-[4/5] xl:aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/hero-image-the.ram.plc.jpg"
                alt="Professional Business Consultancy"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            
            {/* Floating stats */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-md">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: '10K+', label: 'Verifications' },
                    { value: '98%', label: 'Success Rate' },
                    { value: '24/7', label: 'Support' }
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xl font-bold text-teal-600 dark:text-teal-400">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
