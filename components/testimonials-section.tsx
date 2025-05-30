"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "Theramplc's verification services have been instrumental in our hiring process. Their thorough approach has helped us avoid potential hiring risks and ensure we bring on board the right talent.",
      author: "Sarah Johnson",
      position: "HR Director, Global Bank Ltd",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      quote:
        "The mystery shopping program designed by Theramplc provided invaluable insights into our customer experience. We've implemented their recommendations and seen a significant improvement in customer satisfaction.",
      author: "Michael Abebe",
      position: "Operations Manager, Retail Chain",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      quote:
        "Their data analytics team transformed our raw data into actionable business intelligence. The insights gained have directly contributed to a 30% increase in our operational efficiency.",
      author: "Fatima Nkosi",
      position: "CEO, Tech Innovations",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      quote:
        "Theramplc's risk assessment services helped us identify vulnerabilities we weren't aware of. Their strategic recommendations have strengthened our business continuity planning.",
      author: "David Okafor",
      position: "Risk Manager, Insurance Corp",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (autoplay) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
      }, 5000)
    }

    return () => clearInterval(interval)
  }, [autoplay, testimonials.length])

  const handlePrev = () => {
    setAutoplay(false)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const handleNext = () => {
    setAutoplay(false)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
          >
            Client <span className="text-teal-600 dark:text-teal-400">Testimonials</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-24 h-1 bg-teal-600 mx-auto mb-6"
          ></motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Hear what our clients have to say about their experience working with Theramplc.
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 md:p-12"
          >
            <Quote className="h-12 w-12 text-teal-600/30 mb-6" />
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 italic">
              "{testimonials[currentIndex].quote}"
            </p>
            <div className="flex items-center">
              <div className="mr-4">
                <img
                  src={testimonials[currentIndex].image || "/placeholder.svg"}
                  alt={testimonials[currentIndex].author}
                  className="h-16 w-16 rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{testimonials[currentIndex].author}</h4>
                <p className="text-gray-600 dark:text-gray-400">{testimonials[currentIndex].position}</p>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center mt-8 gap-4">
            <Button variant="outline" size="icon" onClick={handlePrev} aria-label="Previous testimonial">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setAutoplay(false)
                    setCurrentIndex(index)
                  }}
                  className={`h-2.5 rounded-full transition-all ${
                    index === currentIndex ? "w-8 bg-teal-600" : "w-2.5 bg-gray-300 dark:bg-gray-600"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={handleNext} aria-label="Next testimonial">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
