"use client"

import { motion } from "framer-motion"
import { TeamMemberCard } from "@/components/team-member-card"
import { Users } from "lucide-react"

export default function OurTeamPage() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const teamMembers = [
    {
      name: "Mulsew M. Tesfaye",
      title: "CTO & Founder",
      imageUrl: "https://media.licdn.com/dms/image/v2/D4D03AQG2E6qImFfcbA/profile-displayphoto-shrink_400_400/B4DZSZP5kzHkAg-/0/1737737871344?e=1758153600&v=beta&t=TwdkPbrXqBRZupiRj_NfOQyERAU5feDxg1ipM3BmvsM",
      bio: "Mulsew is the visionary behind The.RAM.PLC, with over 15 years of experience in data analytics and risk assessment.",
      linkedinUrl: "#",
      twitterUrl: "#",
    },
    {
      name: "Abebe Tegegn",
      title: "Chief Operations Officer",
      imageUrl: "https://media.licdn.com/dms/image/v2/C4D03AQHPrGc14NuUYA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1631862219087?e=1758153600&v=beta&t=-J3qzRXEyUM4pvUREta1PO9Kl301QoAKAgyyiSNTkUw",
      bio: "Abebe oversees all operational aspects, ensuring seamless service delivery and client satisfaction.",
      linkedinUrl: "#",
      twitterUrl: "#",
    },
    {
      name: "Alex Johnson",
      title: "Lead Data Scientist",
      imageUrl: "/placeholder-user.jpg",
      bio: "Alex specializes in complex data modeling and predictive analytics, driving insightful solutions for our clients.",
      linkedinUrl: "#",
      twitterUrl: "#",
    },
    {
      name: "Sarah Brown",
      title: "Head of Client Relations",
      imageUrl: "/placeholder-user.jpg",
      bio: "Sarah is dedicated to building strong client relationships and understanding their unique needs.",
      linkedinUrl: "#",
      twitterUrl: "#",
    },
    {
      name: "Michael Lee",
      title: "Verification Specialist",
      imageUrl: "/placeholder-user.jpg",
      bio: "Michael is an expert in Primary Source Verification, ensuring accuracy and integrity in all reports.",
      linkedinUrl: "#",
      twitterUrl: "#",
    },
    {
      name: "Emily Chen",
      title: "Mystery Shopping Coordinator",
      imageUrl: "/placeholder-user.jpg",
      bio: "Emily designs and executes mystery shopping programs that provide invaluable insights into service quality.",
      linkedinUrl: "#",
      twitterUrl: "#",
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
          Our <span className="text-teal-600 dark:text-teal-400">Team</span>
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
          Meet the dedicated professionals who drive our mission forward with expertise, passion, and a commitment to excellence.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              variants={fadeIn}
            >
              <TeamMemberCard
                name={member.name}
                title={member.title}
                imageUrl={member.imageUrl}
                bio={member.bio}
                linkedinUrl={member.linkedinUrl}
                twitterUrl={member.twitterUrl}
              />
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
            <Users className="h-6 w-6 text-teal-600 mr-2" /> Join Our Team
          </h3>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            We are always looking for talented and passionate individuals to join our growing team. If you are committed to integrity and excellence, we encourage you to explore career opportunities with us.
          </p>
          {/* Add a link to careers page if exists */}
        </motion.div>
      </div>
    </section>
  )
} 