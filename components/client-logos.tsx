"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface ClientLogosProps {
  className?: string
}

export default function ClientLogos({ className }: ClientLogosProps) {
  // Sample client logos - replace these with actual client logos
  const clients = [
    {
      name: "Client 1",
      logo: "/logos/dubai-health-authority-logo-vector.png", 
      alt: "Client 1 logo"
    },
    {
      name: "Client 2",
      logo: "/logos/DataFlowGroup.png",
      alt: "Client 2 logo"
    },
    {
      name: "Client 3",
      logo: "/logos/UAE Minister Of health and prevention.png",
      alt: "Client 3 logo"
    },
    {
      name: "Client 4",
      logo: "/logos/nhra-logo-orginal-250.png",
      alt: "Client 4 logo"
    },
    {
      name: "Client 5",
      logo: "/logos/state-of-qatar-ministry-of-public-health-logo-vector-xs.png",
      alt: "Client 5 logo"
    },
    {
      name: "Client 6",
      logo: "/logos/UAE Minister Of health and prevention.png",
      alt: "Client 6 logo"
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <section className={`py-16 bg-white dark:bg-gray-900 ${className}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Trusted by <span className="text-teal-600 dark:text-teal-400">Leading Organizations</span>
          </h2>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-24 h-1 bg-teal-600 mx-auto mb-6"
          ></motion.div>
          <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            We're proud to partner with these organizations to deliver exceptional services and solutions.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center"
        >
          {clients.map((client, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="w-full flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
            >
              <div className="relative h-16 w-full">
                <Image
                  src={client.logo}
                  alt={client.alt}
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
