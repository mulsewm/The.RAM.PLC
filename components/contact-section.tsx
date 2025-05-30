"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Linkedin,
  Twitter,
  Facebook,
  MessageCircle,
} from "lucide-react"

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    serviceInterest: "" as string
  })

  const [formStatus, setFormStatus] = useState<{
    status: "idle" | "loading" | "success" | "error"
    message: string
  }>({
    status: "idle",
    message: "",
  })

  const [formErrors, setFormErrors] = useState<{
    [key: string]: string
  }>({})

  const serviceOptions = [
    { value: "", label: "Select a service" },
    { value: "psv", label: "Primary Source Verification" },
    { value: "background", label: "Background Screening" },
    { value: "mystery", label: "Mystery Shopping" },
    { value: "analytics", label: "Data Analytics" },
    { value: "risk", label: "Risk Assessment" },
    { value: "data-science", label: "Data Science" },
    { value: "marketing", label: "Marketing Services" },
    { value: "other", label: "Other Services" },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const errors: { [key: string]: string } = {}
    
    if (!formState.name.trim()) errors.name = "Name is required"
    if (!formState.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^\S+@\S+\.\S+$/.test(formState.email)) {
      errors.email = "Please enter a valid email address"
    }
    if (!formState.subject.trim()) errors.subject = "Subject is required"
    if (!formState.message.trim()) errors.message = "Message is required"
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setFormStatus({ status: "loading", message: "" })

    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setFormStatus({
        status: "success",
        message: "Your message has been sent successfully! We'll get back to you soon.",
      })
      // Reset form
      setFormState({ 
        name: "", 
        email: "", 
        phone: "", 
        company: "", 
        subject: "", 
        message: "",
        serviceInterest: ""
      })
    } catch (error) {
      setFormStatus({
        status: "error",
        message: "There was an error sending your message. Please try again.",
      })
    }
  }

  const contactInfo = [
    {
      icon: <MapPin className="h-5 w-5 text-teal-600" />,
      title: "Address",
      details: "Bole Road, Addis Ababa, Ethiopia",
    },
    {
      icon: <Phone className="h-5 w-5 text-teal-600" />,
      title: "Phone",
      details: "+251 93 700 3478",
    },
    {
      icon: <Mail className="h-5 w-5 text-teal-600" />,
      title: "Email",
      details: "info@theramplc.com",
    },
    {
      icon: <Clock className="h-5 w-5 text-teal-600" />,
      title: "Working Hours",
      details: "Monday - Friday: 9AM - 5PM",
    },
  ]

  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/international-license-opportunity-ilo/about/",
      icon: <Linkedin className="h-5 w-5" />,
    },
    {
      name: "Telegram",
      url: "https://t.me/+Aq_kzbRBSJgyOTVk",
      icon: <MessageCircle className="h-5 w-5" />,
    },
    {
      name: "Twitter",
      url: "#",
      icon: <Twitter className="h-5 w-5" />,
    },
    {
      name: "Facebook",
      url: "#",
      icon: <Facebook className="h-5 w-5" />,
    },
  ]

  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
          >
            Contact <span className="text-teal-600 dark:text-teal-400">Us</span>
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
            Have questions or ready to start a project? Get in touch with our team.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Get in Touch</h3>

            <div className="space-y-6 mb-8">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 mt-1">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{item.title}</h4>
                    <p className="text-gray-700 dark:text-gray-300">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-teal-600 hover:bg-teal-700 flex items-center justify-center text-white transition-colors"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Send Us a Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className={formErrors.name ? "border-red-500 focus:ring-red-500" : ""}
                    placeholder="John Doe"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    className={formErrors.email ? "border-red-500 focus:ring-red-500" : ""}
                    placeholder="john@example.com"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    placeholder="+251 9XX XXX XXX"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company/Organization
                  </label>
                  <Input
                    id="company"
                    name="company"
                    value={formState.company}
                    onChange={handleChange}
                    placeholder="Your company name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="serviceInterest" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Service of Interest
                </label>
                <select
                  id="serviceInterest"
                  name="serviceInterest"
                  value={formState.serviceInterest}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
                >
                  {serviceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject *
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  className={formErrors.subject ? "border-red-500 focus:ring-red-500" : ""}
                  placeholder="How can we help you?"
                />
                {formErrors.subject && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.subject}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  className={formErrors.message ? "border-red-500 focus:ring-red-500" : ""}
                  placeholder="Your message here..."
                  rows={5}
                />
                {formErrors.message && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.message}</p>
                )}
              </div>
              
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Fields marked with * are required
              </div>

              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 text-lg font-medium shadow-md hover:shadow-lg transition-all"
                disabled={formStatus.status === "loading"}
              >
                {formStatus.status === "loading" ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </Button>

              {formStatus.status === "success" && (
                <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-md shadow-sm">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <p>{formStatus.message}</p>
                </div>
              )}

              {formStatus.status === "error" && (
                <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-md shadow-sm">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p>{formStatus.message}</p>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
