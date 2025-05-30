"use client"

import { motion } from "framer-motion"
import { Award, Globe, Users, Lightbulb, Shield, Clock } from "lucide-react"

export default function WhyChooseUsSection() {
  const reasons = [
    {
      icon: <Award className="h-8 w-8 text-teal-600" />,
      title: "Proven Track Record",
      description: "Over a decade of successful consultancy services across Africa.",
    },
    {
      icon: <Globe className="h-8 w-8 text-teal-600" />,
      title: "Pan-African Presence",
      description: "Strong network and understanding of local markets across the continent.",
    },
    {
      icon: <Users className="h-8 w-8 text-teal-600" />,
      title: "Expert Team",
      description: "Highly qualified professionals with industry-specific expertise.",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-teal-600" />,
      title: "Innovative Solutions",
      description: "Cutting-edge methodologies and technologies for optimal results.",
    },
    {
      icon: <Shield className="h-8 w-8 text-teal-600" />,
      title: "Ethical Conduct",
      description: "Unwavering commitment to integrity and professional ethics.",
    },
    {
      icon: <Clock className="h-8 w-8 text-teal-600" />,
      title: "Timely Delivery",
      description: "Efficient processes ensuring prompt delivery of services.",
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
    <section id="why-us" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
          >
            Why Choose <span className="text-teal-600 dark:text-teal-400">Theramplc</span>
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
            We stand out from the competition through our commitment to excellence, innovation, and client satisfaction.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
        >
          {reasons.map((reason, index) => (
            <motion.div key={index} variants={itemVariants} className="flex">
              <div className="mr-4 mt-1">{reason.icon}</div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{reason.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{reason.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-teal-50 dark:bg-teal-900/30 p-8 rounded-lg">
            <p className="text-xl font-medium text-gray-900 dark:text-white">
              "Our mission is to empower your business with the insights and tools needed for sustainable growth and
              success."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
