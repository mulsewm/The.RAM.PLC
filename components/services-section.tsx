"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  FileCheck, UserCheck, ShoppingBag, BarChart4, ShieldAlert, Globe, 
  Briefcase, Monitor, CreditCard, Layout, ShoppingCart, Brain
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<number | null>(null)

  const services = [
    {
      icon: <FileCheck className="h-10 w-10 text-teal-600" />,
      title: "Primary Source Verification (PSV)",
      description: "We verify credentials directly from the issuing source, ensuring authenticity and compliance with regulatory requirements.",
      detailedDescription: "Our PSV services adhere to global standards, providing a thorough validation process for educational, employment, and professional credentials. This ensures integrity and compliance with industry regulations, giving you confidence in your hiring decisions.",
      keyPoints: [
        "Direct verification from issuing institutions",
        "Compliance with international standards",
        "Comprehensive credential validation",
        "Secure and confidential process"
      ]
    },
    {
      icon: <UserCheck className="h-10 w-10 text-teal-600" />,
      title: "Background Screening",
      description: "Comprehensive background checks to help you make informed hiring decisions and mitigate employment risks.",
      detailedDescription: "Our background screening services cover criminal history, employment verification, education confirmation, and more. We leverage a global network and cutting-edge technology to deliver accurate, timely, and cost-effective results.",
      keyPoints: [
        "Identity Verification",
        "Employment History Verification",
        "Education Verification",
        "Criminal Background Check",
        "Credit History Check",
        "Reference Checks",
        "Professional License Verification"
      ]
    },
    {
      icon: <Globe className="h-10 w-10 text-teal-600" />,
      title: "Immigration Compliance",
      description: "Expert assistance navigating complex immigration laws, including visa processing, audits, and documentation support.",
      detailedDescription: "We work with legal experts and authorities to ensure seamless and compliant immigration processes for your organization. Our services include visa processing, compliance audits, and comprehensive documentation support.",
      keyPoints: [
        "Visa application assistance",
        "Compliance audits",
        "Documentation verification",
        "Legal expert collaboration",
        "Regulatory updates"
      ]
    },
    {
      icon: <Briefcase className="h-10 w-10 text-teal-600" />,
      title: "Media Consultancy",
      description: "Strategic media services including public relations, crisis management, and social media strategy development.",
      detailedDescription: "Our media consultancy services help craft and execute robust media strategies, including public relations, crisis management, and social media presence, ensuring your brand's voice is heard effectively in the marketplace.",
      keyPoints: [
        "Public relations management",
        "Crisis communication planning",
        "Social media strategy",
        "Brand voice development",
        "Media training"
      ]
    },
    {
      icon: <BarChart4 className="h-10 w-10 text-teal-600" />,
      title: "Data Analytics",
      description: "Transform raw data into actionable insights to drive strategic decision-making and business growth.",
      detailedDescription: "Using cutting-edge tools and methodologies, we analyze trends, identify patterns, and provide deeper understanding for data-driven decisions. Our services include financial analysis, customer behavior insights, and operational efficiency assessments.",
      keyPoints: [
        "Financial data analysis",
        "Customer behavior insights",
        "Market trend analysis",
        "Performance metrics",
        "Competitive intelligence"
      ]
    },
    {
      icon: <Brain className="h-10 w-10 text-teal-600" />,
      title: "Data Science",
      description: "Advanced algorithms and machine learning to uncover meaningful patterns and predict future trends.",
      detailedDescription: "Our data science services go beyond analysis, employing advanced algorithms and machine learning to identify meaningful patterns and predict future trends. We help optimize operations, enhance customer experiences, and drive product innovation.",
      keyPoints: [
        "Predictive analytics",
        "Machine learning models",
        "Time series forecasting",
        "Classification and regression analysis",
        "Data visualization",
        "Model deployment and monitoring"
      ]
    },
    {
      icon: <Monitor className="h-10 w-10 text-teal-600" />,
      title: "Marketing Services",
      description: "Comprehensive marketing solutions to build and promote your brand effectively in the digital age.",
      detailedDescription: "Our marketing services take a comprehensive approach to building and promoting your brand through digital marketing, SEO, content creation, and campaign management to increase visibility, drive engagement, and boost your bottom line.",
      keyPoints: [
        "Digital marketing strategy",
        "SEO optimization",
        "Content creation",
        "Campaign management",
        "Performance analytics",
        "Brand development"
      ]
    },
    {
      icon: <CreditCard className="h-10 w-10 text-teal-600" />,
      title: "Payment Processing",
      description: "Secure and efficient payment processing solutions for digital applications and platforms.",
      detailedDescription: "We provide secure and efficient payment processing for digital platforms through various methods including credit cards. Our solutions are designed with security and convenience as top priorities.",
      keyPoints: [
        "Secure transaction processing",
        "Multiple payment methods",
        "Fraud prevention",
        "Compliance with financial regulations",
        "Seamless integration"
      ]
    },
    {
      icon: <Layout className="h-10 w-10 text-teal-600" />,
      title: "Web Development",
      description: "Specialized web and app design services for digital health and other sectors requiring compliance.",
      detailedDescription: "We offer specialized services for compliant and user-friendly online presence in digital health and other regulated industries, creating intuitive, responsive, and secure websites and applications.",
      keyPoints: [
        "Responsive website design",
        "Web application development",
        "Regulatory compliance",
        "User experience optimization",
        "Security implementation",
        "Ongoing maintenance"
      ]
    },
    {
      icon: <ShoppingCart className="h-10 w-10 text-teal-600" />,
      title: "General Merchant",
      description: "Comprehensive trading and merchant solutions across various sectors and markets.",
      detailedDescription: "We offer a wide range of trading and merchant solutions across various sectors, including sourcing, procurement, distribution, and logistics, working with a network of trusted suppliers and buyers.",
      keyPoints: [
        "Inventory management",
        "Supplier relationship management",
        "Distribution logistics",
        "Market analysis",
        "Procurement optimization",
        "Regulatory compliance"
      ]
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-teal-600" />,
      title: "Mystery Shopping",
      description: "Evaluate customer experience and service quality through anonymous assessments to identify areas for improvement.",
      detailedDescription: "Our mystery shopping services provide unbiased evaluations of your customer experience and service quality. Through anonymous assessments, we identify strengths and areas for improvement to help you enhance customer satisfaction and loyalty.",
      keyPoints: [
        "Anonymous service evaluation",
        "Detailed reporting",
        "Competitive benchmarking",
        "Staff performance assessment",
        "Improvement recommendations"
      ]
    },
    {
      icon: <ShieldAlert className="h-10 w-10 text-teal-600" />,
      title: "Risk Assessment",
      description: "Identify, analyze, and mitigate potential risks to protect your business and ensure operational continuity.",
      detailedDescription: "Our risk assessment services help identify, analyze, and mitigate potential threats to your business. We develop comprehensive strategies to protect your assets, ensure operational continuity, and maintain compliance with regulatory requirements.",
      keyPoints: [
        "Threat identification",
        "Vulnerability assessment",
        "Risk mitigation planning",
        "Compliance monitoring",
        "Business continuity planning",
        "Security protocol development"
      ]
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const openServiceDetails = (index: number) => {
    setSelectedService(index)
  }

  const closeServiceDetails = () => {
    setSelectedService(null)
  }

  return (
    <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
          >
            Our <span className="text-teal-600 dark:text-teal-400">Services</span>
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
            We offer a comprehensive range of consultancy services designed to help businesses navigate the complexities
            of today's market and achieve sustainable growth across Africa.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <div className="mb-4">{service.icon}</div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-700 dark:text-gray-300 text-base mb-4">
                    {service.description}
                  </CardDescription>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-teal-600 border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20"
                    onClick={() => openServiceDetails(index)}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {selectedService !== null && (
          <Dialog open={selectedService !== null} onOpenChange={closeServiceDetails}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-teal-600">{services[selectedService].icon}</span>
                  {services[selectedService].title}
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-base text-gray-700 dark:text-gray-300">
                <p className="mb-4">{services[selectedService].detailedDescription}</p>
                
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Key Components:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6">
                  {services[selectedService].keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="mr-2 mt-1 text-teal-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      {point}
                    </li>
                  ))}
                </ul>
              </DialogDescription>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  )
}
