"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Globe, FileCheck, Clock, Building, Timer, Zap } from "lucide-react"
import { useInView } from "react-intersection-observer"

interface MetricProps {
  value: number
  suffix?: string
  label: string
  description: string
  icon: React.ReactNode
  delay: number
}

const Metric = ({ value, suffix = "", label, description, icon, delay }: MetricProps) => {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  })
  
  useEffect(() => {
    if (inView) {
      const duration = 2000 // ms
      const frameDuration = 1000 / 60 // 60fps
      const totalFrames = Math.round(duration / frameDuration)
      let frame = 0
      
      const counter = setInterval(() => {
        frame++
        const progress = frame / totalFrames
        const currentCount = Math.floor(value * progress)
        
        setCount(currentCount)
        
        if (frame === totalFrames) {
          clearInterval(counter)
          setCount(value)
        }
      }, frameDuration)
      
      return () => clearInterval(counter)
    }
  }, [inView, value])
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeIn}
      transition={{ duration: 0.6, delay }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-100 dark:border-gray-700 transform transition-transform duration-300 hover:scale-105"
    >
      <div className="flex items-center justify-center mb-4">
        <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-full">
          {icon}
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center">
          <span>{count.toLocaleString()}</span>
          <span className="text-teal-600 dark:text-teal-400">{suffix}</span>
        </h3>
        <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">{label}</h4>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{description}</p>
      </div>
    </motion.div>
  )
}

export default function NumbersSection() {
  const metrics = [
    {
      value: 6,
      suffix: "+",
      label: "Years of Excellence",
      description: "Delivering trusted verification services with proven expertise since 2019",
      icon: <Clock className="h-8 w-8 text-teal-600 dark:text-teal-400" />,
      delay: 0.1
    },
    {
      value: 3,
      label: "Continents Covered",
      description: "Global presence across Africa, Eastern Europe, and beyond",
      icon: <Globe className="h-8 w-8 text-teal-600 dark:text-teal-400" />,
      delay: 0.2
    },
    {
      value: 3,
      suffix: " Days",
      label: "Turnaround Time",
      description: "Fast and efficient delivery within 3 working days",
      icon: <Zap className="h-8 w-8 text-teal-600 dark:text-teal-400" />,
      delay: 0.25
    },
    {
      value: 30000,
      suffix: "+",
      label: "Documents Verified",
      description: "Ensuring authenticity through rigorous verification processes",
      icon: <FileCheck className="h-8 w-8 text-teal-600 dark:text-teal-400" />,
      delay: 0.3
    },
    {
      value: 300,
      suffix: "+",
      label: "Trusted Authorities",
      description: "Partnerships with authoritative institutions across multiple regions",
      icon: <Building className="h-8 w-8 text-teal-600 dark:text-teal-400" />,
      delay: 0.4
    }
  ]
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeIn}
            className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
          >
            Our Global <span className="text-teal-600 dark:text-teal-400">Impact</span>
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            variants={fadeIn}
            className="w-24 h-1 bg-teal-600 mx-auto mb-6"
          ></motion.div>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            variants={fadeIn}
            className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Trusted verification services delivering actionable insights across continents, backed by years of expertise and thousands of successful verifications.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {metrics.map((metric, index) => (
            <Metric
              key={index}
              value={metric.value}
              suffix={metric.suffix}
              label={metric.label}
              description={metric.description}
              icon={metric.icon}
              delay={metric.delay}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
