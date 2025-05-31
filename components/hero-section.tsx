"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-16 bg-gradient-to-br from-gray-50 to-teal-50 dark:from-gray-900 dark:to-gray-800"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-teal-100 dark:bg-teal-900 rounded-l-full transform translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-3/4 h-1/3 bg-teal-50 dark:bg-teal-800 rounded-tr-full"></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              <span className="text-teal-600 dark:text-teal-400">Trusted Verification.</span> Actionable Insights. <span className="text-teal-600 dark:text-teal-400">African Expertise.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              The.RAM.PLC delivers premier consultancy services in verification, analytics, and risk assessment, empowering African businesses to make confident decisions in today's complex market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all">
                Discover Our Solutions
              </Button>
              <Button variant="outline" className="text-lg px-8 py-6 border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all">
                Connect With Us <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center lg:justify-start">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold">
                    {i}
                  </div>
                ))}
              </div>
              <p className="ml-4 text-sm text-gray-600 dark:text-gray-400">Trusted by leading organizations across Africa</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://blog.in.springverify.com/wp-content/uploads/2024/11/image-21.png"
                alt="Professional Business Consultancy"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
