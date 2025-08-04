"use client"

import { motion } from "framer-motion"
import { CheckCircle, Shield } from "lucide-react"

export default function OurValuesPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const coreValues = [
    {
      title: "Integrity",
      description: "We uphold the highest ethical standards in all our operations, ensuring transparency, honesty, and accountability in every interaction."
    },
    {
      title: "Excellence",
      description: "We are committed to delivering exceptional quality in all our services, continuously striving to exceed client expectations."
    },
    {
      title: "Innovation",
      description: "We embrace creative thinking and cutting-edge technologies to develop forward-thinking solutions for complex challenges."
    },
    {
      title: "Collaboration",
      description: "We believe in the power of partnership, working closely with clients and stakeholders to achieve shared goals."
    },
    {
      title: "Client-Centricity",
      description: "We prioritize our clients' needs, offering tailored solutions and exceptional service to foster long-term partnerships."
    },
    {
      title: "Accountability",
      description: "We take full responsibility for our actions and outcomes, ensuring reliability and trustworthiness in every commitment."
    },
  ]

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-6xl text-center">
        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          variants={fadeIn}
          className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
        >
          Our Core <span className="text-teal-600 dark:text-teal-400">Values</span>
        </motion.h1>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          variants={fadeIn}
          className="w-24 h-1 bg-teal-600 mx-auto mb-12"
        ></motion.div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          variants={fadeIn}
          className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
        >
          These principles guide every decision and action we take, ensuring we deliver value with integrity and excellence.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {coreValues.map((value, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              variants={fadeIn}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 text-left">
                <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-3">
                  <Shield className="h-6 w-6 text-teal-600 mr-2 flex-shrink-0" />
                  {value.title}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 text-base">{value.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          variants={fadeIn}
          className="mt-20 bg-gradient-to-r from-teal-50 to-gray-50 dark:from-teal-900/20 dark:to-gray-800/50 p-8 rounded-xl shadow-lg text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-teal-600 mr-2" /> Our Commitment to Ethics
          </h3>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Our unwavering commitment to ethical practices ensures the highest standards of integrity and trustworthiness in all our engagements.
          </p>
        </motion.div>
      </div>
    </section>
  )
} 