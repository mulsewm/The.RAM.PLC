"use client"

import { motion } from "framer-motion"
import { CheckCircle, MapPin, Lightbulb, TrendingUp, Handshake } from "lucide-react"
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OurStoryPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Hero Section */}
      {/* <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center text-center overflow-hidden">
        <Image
          src="/images/our-story-hero.png" 
          alt="Our Story Hero"
          layout="fill"
          objectFit="cover"
          quality={90}
          className="absolute inset-0 z-0 opacity-60"
        />
        <div className="relative z-10 px-4">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white drop-shadow-lg"
          >
            Our <span className="text-teal-400">Journey</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-lg md:text-xl text-white max-w-2xl mx-auto drop-shadow-md"
          >
            From humble beginnings to a leading force in verifiable insights across Africa.
          </motion.p>
        </div>
      </section> */}

      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeIn}
            className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white text-center"
          >
            The Genesis of <span className="text-teal-600 dark:text-teal-400">The.RAM.PLC</span>
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            variants={fadeIn}
            className="w-24 h-1 bg-teal-600 mx-auto mb-12"
          ></motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            variants={fadeIn}
            className="space-y-8 text-lg leading-relaxed text-gray-700 dark:text-gray-300 text-justify"
          >
            <p>
              Founded in Addis Ababa, Ethiopia, <span className="font-semibold text-teal-600 dark:text-teal-400">the.RAM.PLC</span> was born out of a profound understanding of the critical need for reliable and verifiable data in the African business landscape. Our founders recognized that a lack of trusted information often hindered growth, fostered uncertainty, and limited the potential for secure partnerships and investments across the continent.
            </p>
            <p>
              The initial vision was clear: to create a robust platform that would empower businesses, organizations, and individuals with accurate, primary-sourced information. We started with a strong focus on Primary Source Verification (PSV) and Background Screening, building a meticulous process and a dedicated team committed to integrity and precision.
            </p>
            <p>
              Our early days were marked by a relentless pursuit of excellence and a deep commitment to our clients. We navigated diverse regulatory environments and cultural nuances, learning and adapting to provide solutions that were not only effective but also culturally sensitive and ethically sound. This foundational period solidified our reputation as a trusted partner.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeIn}
            className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white text-center"
          >
            Key <span className="text-teal-600 dark:text-teal-400">Milestones</span>
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            variants={fadeIn}
            className="w-24 h-1 bg-teal-600 mx-auto mb-12"
          ></motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-teal-300 dark:bg-teal-700 hidden md:block"></div>
            
            <div className="space-y-16">
              {/* Milestone 1 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                variants={fadeIn}
                className="flex flex-col md:flex-row items-center md:justify-between w-full left-direction"
              >
                <div className="md:w-5/12 text-center md:text-right p-4">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">2015 - Inception and Foundational Services</h3>
                  <p className="text-gray-700 dark:text-gray-300">Launched in Addis Ababa with initial focus on Primary Source Verification (PSV) and Background Screening, establishing our core methodologies and team.</p>
                </div>
                <div className="md:w-1/12 flex justify-center">
                  <div className="w-4 h-4 bg-teal-600 rounded-full shadow-lg"></div>
                </div>
                <div className="md:w-5/12"></div>
              </motion.div>

              {/* Milestone 2 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                variants={fadeIn}
                className="flex flex-col md:flex-row items-center md:justify-between w-full right-direction md:flex-row-reverse"
              >
                <div className="md:w-5/12 text-center md:text-left p-4">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">2018 - Expanding Service Portfolio</h3>
                  <p className="text-gray-700 dark:text-gray-300">Introduced Mystery Shopping and basic Data Analytics services, catering to a broader range of client needs and market demands.</p>
                </div>
                <div className="md:w-1/12 flex justify-center">
                  <div className="w-4 h-4 bg-teal-600 rounded-full shadow-lg"></div>
                </div>
                <div className="md:w-5/12"></div>
              </motion.div>

              {/* Milestone 3 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                variants={fadeIn}
                className="flex flex-col md:flex-row items-center md:justify-between w-full left-direction"
              >
                <div className="md:w-5/12 text-center md:text-right p-4">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">2020 - Technological Integration & Regional Growth</h3>
                  <p className="text-gray-700 dark:text-gray-300">Invested in advanced technology platforms for enhanced data processing and expanded our operations into key East African markets.</p>
                </div>
                <div className="md:w-1/12 flex justify-center">
                  <div className="w-4 h-4 bg-teal-600 rounded-full shadow-lg"></div>
                </div>
                <div className="md:w-5/12"></div>
              </motion.div>

              {/* Milestone 4 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                variants={fadeIn}
                className="flex flex-col md:flex-row items-center md:justify-between w-full right-direction md:flex-row-reverse"
              >
                <div className="md:w-5/12 text-center md:text-left p-4">
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">2022 - Launch of Risk Assessment & AI-Driven Solutions</h3>
                  <p className="text-gray-700 dark:text-gray-300">Launched comprehensive Risk Assessment services and began integrating AI and machine learning into our data analytics offerings.</p>
                </div>
                <div className="md:w-1/12 flex justify-center">
                  <div className="w-4 h-4 bg-teal-600 rounded-full shadow-lg"></div>
                </div>
                <div className="md:w-5/12"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision for the Future Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeIn}
            className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
          >
            Our <span className="text-teal-600 dark:text-teal-400">Vision for the Future</span>
          </motion.h2>
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
            className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Looking ahead, The.RAM.PLC is committed to continuing our trajectory of innovation and expansion. We aim to be the unequivocal leader in verifiable insights and strategic intelligence across the African continent and beyond. Our future involves deeper integration of AI, expansion into new markets, and the development of even more sophisticated solutions to meet the evolving needs of a dynamic global economy.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Card className="p-6 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-col items-center mb-4">
                <Lightbulb className="h-10 w-10 text-teal-600 mb-3" />
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Continuous Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">Pioneering new technologies and methodologies to deliver cutting-edge solutions.</p>
              </CardContent>
            </Card>
            <Card className="p-6 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-col items-center mb-4">
                <MapPin className="h-10 w-10 text-teal-600 mb-3" />
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Expanded Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">Broadening our geographical footprint to serve more clients across Africa and globally.</p>
              </CardContent>
            </Card>
            <Card className="p-6 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-col items-center mb-4">
                <Handshake className="h-10 w-10 text-teal-600 mb-3" />
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Empowering Partnerships</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300">Fostering stronger collaborations to create a more transparent and secure business ecosystem.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={fadeIn}
            className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
          >
            Our <span className="text-teal-600 dark:text-teal-400">Commitment</span>
          </motion.h2>
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
            className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
          >
            We are deeply committed to fostering a secure and prosperous business environment across Africa. Through our services, we aim to not only meet but consistently exceed international standards for accuracy, integrity, and ethical conduct. Our dedication extends to building lasting relationships with our clients, underpinned by trust and mutual respect.
          </motion.p>
        </div>
      </section>
    </div>
  );
} 