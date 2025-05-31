"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Globe, Users, Lightbulb, Shield, Target } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState("who-we-are")
  
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
  ]
  
  const coverage = [
    {
      region: "East Africa",
      countries: ["Ethiopia", "Kenya", "Tanzania", "Uganda", "Rwanda"]
    },
    {
      region: "West Africa",
      countries: ["Nigeria", "Ghana", "Senegal", "Côte d'Ivoire", "Benin"]
    },
    {
      region: "Central Africa",
      countries: ["Cameroon", "DR Congo", "Gabon", "Chad"]
    },
    {
      region: "Southern Africa",
      countries: ["South Africa", "Botswana", "Namibia", "Zimbabwe", "Zambia"]
    }
  ]

  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
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
            About <span className="text-teal-600 dark:text-teal-400">the.RAM.PLC</span>
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
            A premier consultancy firm based in Addis Ababa, Ethiopia, specializing in verification, analytics, and risk assessment services across the World.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            variants={fadeIn}
            className="relative"
          >
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="The.RAM.PLC Team"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-teal-600 text-white p-6 rounded-lg shadow-lg hidden md:block">
              <p className="text-2xl font-bold">5+ Years</p>
              <p>of Excellence</p>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            variants={fadeIn}
          >
            <Tabs defaultValue="who-we-are" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
                <TabsTrigger value="who-we-are" className="text-sm md:text-base">Who We Are</TabsTrigger>
                <TabsTrigger value="mission-vision" className="text-sm md:text-base">Mission & Vision</TabsTrigger>
                <TabsTrigger value="values" className="text-sm md:text-base">Our Values</TabsTrigger>
                <TabsTrigger value="coverage" className="text-sm md:text-base">Our Coverage</TabsTrigger>
              </TabsList>
              
              <TabsContent value="who-we-are" className="mt-4">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Who We Are</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    The.RAM.PLC is a leading consultancy firm specializing in Primary Source Verification (PSV), Background Screening, Mystery Shopping, Data Analytics, and Risk Assessment. Based in Addis Ababa, Ethiopia, we serve clients across Africa with integrity, innovation, and excellence as our founding principles.
                  </p>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Our Team</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Our team comprises seasoned professionals with extensive experience in verification services, data analytics, risk assessment, and mystery shopping. With deep regional expertise and a global outlook, we are committed to continuous learning and staying at the forefront of industry developments.
                  </p>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-6">Our Ethics</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    We adhere to the highest ethical standards in all our operations, ensuring confidentiality, security, and accuracy in every project we undertake. Our commitment to ethical business practices is unwavering, forming the foundation of our reputation and client trust.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="mission-vision" className="mt-4">
                <div className="space-y-4">
                  <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Target className="h-6 w-6 text-teal-600 mr-2" /> Our Mission
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mt-3">
                      Empowering businesses with accurate, timely, and actionable insights through high-quality and ethical services tailored to client needs. We are committed to helping organizations across Africa make informed decisions, mitigate risks, and achieve sustainable growth.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Lightbulb className="h-6 w-6 text-teal-600 mr-2" /> Our Vision
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mt-3">
                      To be Africa's leading consultancy in our specialized areas, recognized for our integrity, innovation, and excellence. We aim to expand our presence across the continent, contributing to economic development by providing solutions that drive business success and foster trust in African markets.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="values" className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Core Values</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {coreValues.map((value, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-3">
                        <CheckCircle className="h-5 w-5 text-teal-600 mr-2" />
                        {value.title}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">{value.description}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="coverage" className="mt-4">
                <div className="space-y-6">
                  <div className="flex items-center">
                    <Globe className="h-6 w-6 text-teal-600 mr-2" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Pan-African Coverage</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    From our headquarters in Addis Ababa, Ethiopia, we serve clients across the African continent, with established operations in the following regions:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {coverage.map((region, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{region.region}</h4>
                        <div className="flex flex-wrap gap-2">
                          {region.countries.map((country, idx) => (
                            <span key={idx} className="bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full text-sm">
                              {country}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          variants={fadeIn}
          className="bg-gradient-to-r from-teal-50 to-gray-50 dark:from-teal-900/20 dark:to-gray-800/50 p-8 rounded-xl shadow-sm text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
            <Users className="h-6 w-6 text-teal-600 mr-2" /> Why Partner With Us
          </h3>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            We combine deep regional expertise with global best practices to deliver customized solutions that address your specific needs. Our proven track record, commitment to excellence, and ethical conduct make us the partner of choice for organizations seeking reliable consultancy services in Africa.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
