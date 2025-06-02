"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  FileCheck, UserCheck, ShoppingBag, BarChart4, ShieldAlert, Globe, 
  Briefcase, Monitor, CreditCard, Layout, ShoppingCart, Brain,
  TestTubes, Database, Workflow, AlertTriangle, BadgeCheck
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ServicesSection() {
  const [selectedService, setSelectedService] = useState<number | null>(null)

  const services = [
    {
      icon: <FileCheck className="h-10 w-10 text-teal-600" />,
      title: "Primary Source Verification (PSV)",
      description: "We verify credentials directly from the issuing source, ensuring authenticity and compliance with global regulatory requirements.",
      detailedDescription: "Primary Source Verification (PSV) is the process of confirming credentials directly with the original source that issued them. Our PSV services adhere to global standards, providing a thorough validation process for educational qualifications, employment history, professional licenses, and other credentials. This rigorous approach ensures integrity and compliance with industry regulations, giving you confidence in your hiring decisions and protecting your organization from fraud.",
      keyPoints: [
        "Direct verification from issuing institutions",
        "Compliance with international standards",
        "Comprehensive credential validation",
        "Educational qualification verification",
        "Employment history confirmation",
        "Professional license validation",
        "Secure and confidential process"
      ]
    },
    {
      icon: <UserCheck className="h-10 w-10 text-teal-600" />,
      title: "Background Screening",
      description: "Comprehensive background checks powered by AI and ML to help you make informed hiring decisions and mitigate employment risks.",
      detailedDescription: "Our background screening services cover criminal history, employment verification, education confirmation, and more. We leverage a global network and cutting-edge technology to deliver accurate, timely, and cost-effective results. the.RAM.plc uses AI and ML capabilities to automate the traditional background check process, which was manual and time-consuming. Our proprietary technology digitizes the process, making it faster, more accurate, and compliant.",
      sections: [
        {
          title: "Key Components of Background Screening",
          points: [
            "Identity Verification",
            "Employment History Verification",
            "Education Verification",
            "Criminal Background Check",
            "Credit History Check",
            "Reference Checks",
            "Drug Testing",
            "Social Media Screening",
            "Professional License Verification",
            "Driving Record Check"
          ]
        },
        {
          title: "Importance of Background Screening",
          points: [
            "Risk Mitigation",
            "Regulatory Compliance",
            "Protection of Company Reputation",
            "Improved Quality of Hires"
          ]
        },
        {
          title: "Tips for Effective Background Screening",
          points: [
            "Develop a Clear Policy",
            "Use Professional Screening Services",
            "Stay Updated with Laws",
            "Communicate with Applicants"
          ]
        },
        {
          title: "Specific Background Checks Offered",
          points: [
            "Company Check: Verifies company or educational institution existence",
            "Professional Reference Check: Automated voice command or personal reference",
            "Gap Check: Screening for employment, education, and address gaps",
            "Medical License Check: Verification of health professionals' registration",
            "Criminal Check: Search of court records (Supreme, High, District, tribunals)",
            "Criminal Check via Law Firm: Legal database checks by certified consultants",
            "Indian Database Check: Search through comprehensive Indian databases",
            "Global Database Check: Search through global databases",
            "Drug Tests (Panels 9, 10, 11): Detailed substances screening",
            "OFAC Check: Search the U.S. Treasury's Specially Designated Nationals list",
            "Int. Employment Check: Verification of past employment details",
            "FACIS: Adverse actions in the healthcare field",
            "US (National) Sex Offender Registry: Check for sexual offense records"
          ]
        }
      ],
      keyPoints: [
        "AI-powered verification processes",
        "Comprehensive screening solutions",
        "Global coverage and compliance",
        "Faster turnaround times",
        "Reduced manual errors",
        "Cost-effective solutions"
      ]
    },
    {
      icon: <Globe className="h-10 w-10 text-teal-600" />,
      title: "Immigration Compliance Services",
      description: "Expert assistance navigating complex immigration laws, including visa processing, audits, and documentation support.",
      detailedDescription: "We work with legal experts and authorities to ensure seamless and compliant immigration processes for your organization. Our comprehensive immigration compliance services include visa processing, compliance audits, and thorough documentation support to help you navigate the complexities of international workforce management.",
      keyPoints: [
        "Visa application assistance",
        "Compliance audits and documentation",
        "Work permit processing",
        "Immigration status verification",
        "Legal expert collaboration",
        "Regulatory updates and compliance",
        "Documentation verification and management"
      ]
    },
    {
      icon: <Briefcase className="h-10 w-10 text-teal-600" />,
      title: "Media Consultancy",
      description: "Strategic media services including public relations, crisis management, and social media strategy development.",
      detailedDescription: "Our media consultancy services help craft and execute robust media strategies, including public relations, crisis management, and social media presence. We ensure your brand's voice is heard effectively in the marketplace, building credibility and managing reputation through strategic communication approaches.",
      keyPoints: [
        "Public relations management",
        "Crisis communication planning",
        "Social media strategy development",
        "Brand voice development",
        "Media training and spokesperson preparation",
        "Content strategy and development",
        "Media monitoring and analysis"
      ]
    },
    {
      icon: <BarChart4 className="h-10 w-10 text-teal-600" />,
      title: "Data Analysis",
      description: "Transform raw data into actionable insights to drive strategic decision-making and business growth.",
      detailedDescription: "Using cutting-edge tools and methodologies, we analyze trends, identify patterns, and provide deeper understanding for data-driven decisions. Our data analysis services transform complex information into clear, actionable insights that drive strategic decision-making and business growth across all operational areas.",
      keyPoints: [
        "Financial data analysis",
        "Customer behavior insights",
        "Market trend analysis",
        "Performance metrics tracking",
        "Competitive intelligence gathering",
        "Operational efficiency assessment",
        "Data visualization and reporting"
      ]
    },
    {
      icon: <Brain className="h-10 w-10 text-teal-600" />,
      title: "Data Science",
      description: "Advanced algorithms and machine learning to uncover meaningful patterns and predict future trends.",
      detailedDescription: "Our data science services go beyond analysis, employing advanced algorithms and machine learning to identify meaningful patterns and predict future trends. We help optimize operations, enhance customer experiences, and drive product innovation through sophisticated predictive modeling and data-driven insights.",
      sections: [
        {
          title: "Data Science Services",
          points: [
            "Data Analysis and Visualization",
            "Data Cleaning and Preprocessing",
            "Predictive Analytics and Modeling",
            "Machine Learning Implementation",
            "Time Series Forecasting",
            "Classification and Regression Analysis"
          ]
        },
        {
          title: "Applications of Predictive Analytics",
          points: [
            "CRM and Customer Insights",
            "Finance and Risk Assessment",
            "Healthcare Analytics",
            "Retail and Inventory Management",
            "Manufacturing Optimization",
            "Human Resources and Talent Management",
            "Energy Consumption Forecasting"
          ]
        },
        {
          title: "Key Components of Predictive Analytics",
          points: [
            "Data Collection and Integration",
            "Preprocessing and Feature Engineering",
            "Model Selection and Training",
            "Model Evaluation and Validation",
            "Deployment and Implementation",
            "Monitoring and Reporting"
          ]
        }
      ],
      keyPoints: [
        "Predictive analytics implementation",
        "Machine learning model development",
        "Pattern recognition and trend analysis",
        "Data-driven decision support",
        "AI-powered business intelligence"
      ]
    },
    {
      icon: <Monitor className="h-10 w-10 text-teal-600" />,
      title: "Marketing Services",
      description: "Comprehensive marketing solutions to build and promote your brand effectively in the digital age.",
      detailedDescription: "Our marketing services take a comprehensive approach to building and promoting your brand through digital marketing, SEO, content creation, and campaign management. We help increase visibility, drive engagement, and boost your bottom line through data-driven marketing strategies tailored to your specific business goals and target audience.",
      sections: [
        {
          title: "Marketing Services Offered",
          points: [
            "Digital Marketing Strategy",
            "SEO and SEM Optimization",
            "Content Marketing and Creation",
            "Social Media Management",
            "Email Marketing Campaigns",
            "PPC and Display Advertising",
            "Marketing Analytics and Reporting"
          ]
        },
        {
          title: "Benefits of Our Marketing Approach",
          points: [
            "Increased Brand Awareness",
            "Customer Acquisition and Lead Generation",
            "Customer Retention and Loyalty",
            "Data-Driven Marketing Decisions",
            "Competitive Advantage in the Marketplace"
          ]
        }
      ],
      keyPoints: [
        "Integrated marketing strategies",
        "Brand development and positioning",
        "Digital marketing optimization",
        "Content strategy and creation",
        "Campaign performance analytics",
        "Conversion rate optimization"
      ]
    },
    {
      icon: <CreditCard className="h-10 w-10 text-teal-600" />,
      title: "Payment Processing for Digital Applications",
      description: "Secure and efficient payment processing solutions for digital applications and platforms.",
      detailedDescription: "We provide secure and efficient payment processing for digital platforms through various methods including credit cards, mobile payments, and digital wallets. Our solutions are designed with security, compliance, and user convenience as top priorities, ensuring smooth transactions for your digital applications.",
      keyPoints: [
        "Secure transaction processing",
        "Multiple payment method integration",
        "Fraud prevention and detection",
        "PCI DSS compliance",
        "Seamless checkout experiences",
        "Transaction analytics and reporting",
        "Global payment support"
      ]
    },
    {
      icon: <Layout className="h-10 w-10 text-teal-600" />,
      title: "Website and Web Apps Design for Digital Health",
      description: "Specialized web and app design services for digital health and other sectors requiring regulatory compliance.",
      detailedDescription: "We offer specialized services for compliant and user-friendly online presence in digital health and other regulated industries. Our team creates intuitive, responsive, and secure websites and applications that meet industry-specific regulations while delivering exceptional user experiences and supporting your business objectives.",
      keyPoints: [
        "Responsive website design",
        "Web application development",
        "Healthcare regulatory compliance (HIPAA, GDPR)",
        "User experience optimization",
        "Security implementation and testing",
        "Accessibility compliance",
        "Ongoing maintenance and support",
        "Integration with health systems"
      ]
    },
    {
      icon: <ShoppingCart className="h-10 w-10 text-teal-600" />,
      title: "General Merchant",
      description: "Comprehensive trading and merchant solutions across various sectors and markets.",
      detailedDescription: "We offer a wide range of trading and merchant solutions across various sectors, including sourcing, procurement, distribution, and logistics. Working with a network of trusted suppliers and buyers, we help optimize your supply chain and enhance your market presence through strategic merchant services.",
      sections: [
        {
          title: "Background Screening Considerations for General Merchants",
          points: [
            "Inventory Management Practices",
            "Supplier Relationship History",
            "Sales Performance Records",
            "Customer Service Standards",
            "Logistics Management Capabilities",
            "Pricing Strategy Consistency",
            "Financial Stability Assessment",
            "Regulatory Compliance History",
            "Security Measures Implementation",
            "Business History Verification"
          ]
        }
      ],
      keyPoints: [
        "Inventory management optimization",
        "Supplier relationship management",
        "Distribution logistics coordination",
        "Market analysis and positioning",
        "Procurement strategy development",
        "Regulatory compliance assurance"
      ]
    },
    {
      icon: <TestTubes className="h-10 w-10 text-teal-600" />,
      title: "Drug Testing Services",
      description: "Comprehensive drug testing solutions for pre-employment screening and workplace safety programs.",
      detailedDescription: "Our drug testing services provide accurate and reliable screening for a wide range of substances. We offer multiple testing panels (9, 10, and 11) with detailed substance screening to support your pre-employment verification processes and ongoing workplace safety programs.",
      keyPoints: [
        "Multiple panel options (9, 10, 11)",
        "Quick turnaround times",
        "Laboratory-certified results",
        "Chain of custody documentation",
        "Medical review officer services",
        "Compliance with industry regulations",
        "Confidential result management"
      ]
    },
    {
      icon: <Database className="h-10 w-10 text-teal-600" />,
      title: "Specialized Database Checks",
      description: "Comprehensive database searches including OFAC, FACIS, and sex offender registries for thorough screening.",
      detailedDescription: "We provide specialized database checks that search through both Indian and global databases to identify potential red flags. Our services include OFAC checks, FACIS searches for healthcare professionals, and US National Sex Offender Registry verification to ensure comprehensive screening of candidates.",
      keyPoints: [
        "OFAC sanctions list verification",
        "FACIS healthcare sanctions screening",
        "Sex offender registry checks",
        "Indian database comprehensive search",
        "Global watchlist screening",
        "Regulatory compliance assurance",
        "Detailed reporting and documentation"
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
            <DialogContent className="w-[95%] max-w-3xl overflow-y-auto overflow-x-hidden max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-teal-600">{services[selectedService].icon}</span>
                  {services[selectedService].title}
                </DialogTitle>
              </DialogHeader>
              <DialogDescription className="text-base text-gray-700 dark:text-gray-300">
                <p className="mb-4">{services[selectedService].detailedDescription}</p>
                
                {/* Render sections if they exist */}
                {services[selectedService].sections && services[selectedService].sections.map((section, sectionIdx) => (
                  <div key={sectionIdx} className="mb-6">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{section.title}</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                      {section.points.map((point, pointIdx) => (
                        <li key={pointIdx} className="flex items-start">
                          <div className="mr-2 mt-1 text-teal-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                
                {/* Always show key points */}
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Key Features:</h4>
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
