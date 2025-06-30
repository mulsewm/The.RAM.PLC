"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import axios from "axios"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/ui/file-upload"
import { cn } from "@/lib/utils"
import { CheckCircle, ChevronRight, Loader2 } from "lucide-react"

// Form schemas for each step
const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(6, "Please enter a valid phone number"),
})

const professionalInfoSchema = z.object({
  profession: z.string().min(1, "Please select your profession"),
  specialization: z.string().optional(),
  yearsOfExperience: z.string().min(1, "Please select your experience level"),
  licensingStatus: z.string().min(1, "Please select your licensing status"),
})

const locationInfoSchema = z.object({
  currentLocation: z.string().min(1, "Please enter your current location"),
  preferredLocation: z.string().min(1, "Please select your preferred location"),
  visaType: z.string().min(1, "Please select visa type"),
  processingUrgency: z.string().min(1, "Please select processing urgency"),
})

const documentUploadSchema = z.object({
  passport: z.any(),
  license: z.any(),
  degree: z.any(),
  experience: z.any(),
  medicalReport: z.any(),
  photo: z.any(),
})

// Combined schema for the entire form
const formSchema = z.object({
  ...personalInfoSchema.shape,
  ...professionalInfoSchema.shape,
  ...locationInfoSchema.shape,
  ...documentUploadSchema.shape,
})

type FormValues = z.infer<typeof formSchema>

const professionOptions = [
  { value: "doctor", label: "Doctor" },
  { value: "nurse", label: "Nurse" },
  { value: "technician", label: "Medical Technician" },
  { value: "specialist", label: "Medical Specialist" },
]

const experienceOptions = [
  { value: "0-2", label: "0-2 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "6-10", label: "6-10 years" },
  { value: "10+", label: "10+ years" },
]

const locationOptions = [
  { value: "dubai", label: "Dubai, UAE" },
  { value: "abudhabi", label: "Abu Dhabi, UAE" },
  { value: "riyadh", label: "Riyadh, Saudi Arabia" },
  { value: "doha", label: "Doha, Qatar" },
  { value: "muscat", label: "Muscat, Oman" },
  { value: "any", label: "Open to any GCC location" },
]

const visaOptions = [
  { value: "employment", label: "Employment Visa" },
  { value: "psv", label: "Private Sector Visa (PSV)" },
  { value: "family", label: "Family Sponsorship Visa" },
  { value: "visit", label: "Visit Visa Conversion" },
]

const urgencyOptions = [
  { value: "standard", label: "Standard (30-45 days)" },
  { value: "urgent", label: "Urgent (15-30 days)" },
  { value: "emergency", label: "Emergency (7-15 days)" },
]

export function RegistrationForm() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      profession: "",
      specialization: "",
      yearsOfExperience: "",
      licensingStatus: "",
      currentLocation: "",
      preferredLocation: "",
      visaType: "",
      processingUrgency: "",
    },
    mode: "onChange",
  })

  const { watch, trigger } = form

  // Auto-advance when fields are valid
  const watchFields = watch()

  const steps = [
    {
      title: "Personal Information",
      fields: ["firstName", "lastName", "email", "phone"],
      schema: personalInfoSchema,
    },
    {
      title: "Professional Information",
      fields: ["profession", "specialization", "yearsOfExperience", "licensingStatus"],
      schema: professionalInfoSchema,
    },
    {
      title: "Location & Visa",
      fields: ["currentLocation", "preferredLocation", "visaType", "processingUrgency"],
      schema: locationInfoSchema,
    },
    {
      title: "Document Upload",
      fields: ["passport", "license", "degree", "experience", "medicalReport", "photo"],
      schema: documentUploadSchema,
    },
  ]

  const currentStep = steps[step]

  // Check if current step is valid and move to next
  const checkStepValidity = async () => {
    const stepFields = currentStep.fields
    const isValid = await trigger(stepFields as any)
    
    if (isValid && step < steps.length - 1) {
      setStep(step + 1)
    }
  }

  // Watch for changes and validate
  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change") {
        checkStepValidity()
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, step])

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof FileList) {
          formData.append(key, value[0])
        } else {
          formData.append(key, value)
        }
      })

      await axios.post("/api/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      setIsSubmitted(true)
    } catch (error) {
      console.error("Application error:", error)
      form.setError("root", {
        type: "manual",
        message: "There was an error submitting your application. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="h-20 w-20 mx-auto mb-8 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Application Successful!</h2>
            <p className="text-gray-600 mb-8">
              Thank you for applying with THE RAM PLC. Our team will review your application and contact you within 24-48 hours.
            </p>
            <Button onClick={() => router.push("/dashboard")} className="bg-primary hover:bg-primary/90">
              Go to Dashboard
            </Button>
          </motion.div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex justify-between items-center mb-8">
                {steps.map((s, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center",
                      i !== steps.length - 1 && "flex-1"
                    )}
                  >
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center border-2",
                        step === i
                          ? "border-primary bg-primary text-white"
                          : step > i
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 text-gray-500"
                      )}
                    >
                      {step > i ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <span>{i + 1}</span>
                      )}
                    </div>
                    {i !== steps.length - 1 && (
                      <div
                        className={cn(
                          "flex-1 h-0.5 mx-4",
                          step > i ? "bg-primary" : "bg-gray-300"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>

              <motion.div
                key={step}
                custom={step}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
              >
                {step === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {step === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="profession"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profession</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your profession" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {professionOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="specialization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specialization</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Cardiology, ICU Nursing" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="yearsOfExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {experienceOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="licensingStatus"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Licensing Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select licensing status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="licensed">Licensed</SelectItem>
                              <SelectItem value="inProgress">In Progress</SelectItem>
                              <SelectItem value="notStarted">Not Started</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="currentLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Location</FormLabel>
                          <FormControl>
                            <Input placeholder="City, Country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preferredLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Location</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select preferred location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {locationOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="visaType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visa Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select visa type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {visaOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="processingUrgency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Processing Urgency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select urgency level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {urgencyOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {step === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="passport"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passport Copy</FormLabel>
                          <FormControl>
                            <FileUpload
                              {...field}
                              accept="image/*,application/pdf"
                              maxSize={5 * 1024 * 1024} // 5MB
                              helperText="PDF, JPG, PNG (Max 5MB)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="license"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional License</FormLabel>
                          <FormControl>
                            <FileUpload
                              {...field}
                              accept="image/*,application/pdf"
                              maxSize={5 * 1024 * 1024}
                              helperText="PDF, JPG, PNG (Max 5MB)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="degree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree Certificate</FormLabel>
                          <FormControl>
                            <FileUpload
                              {...field}
                              accept="image/*,application/pdf"
                              maxSize={5 * 1024 * 1024}
                              helperText="PDF, JPG, PNG (Max 5MB)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Certificate</FormLabel>
                          <FormControl>
                            <FileUpload
                              {...field}
                              accept="image/*,application/pdf"
                              maxSize={5 * 1024 * 1024}
                              helperText="PDF, JPG, PNG (Max 5MB)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="medicalReport"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medical Test Reports</FormLabel>
                          <FormControl>
                            <FileUpload
                              {...field}
                              accept="image/*,application/pdf"
                              maxSize={5 * 1024 * 1024}
                              helperText="PDF, JPG, PNG (Max 5MB)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="photo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Passport-Sized Photo</FormLabel>
                          <FormControl>
                            <FileUpload
                              {...field}
                              accept="image/*"
                              maxSize={5 * 1024 * 1024}
                              helperText="JPG, PNG (Max 5MB)"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    disabled={step === 0}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    Back
                  </Button>
                  {step === steps.length - 1 ? (
                    <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => checkStepValidity()}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Next
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </form>
          </Form>
        )}
      </AnimatePresence>
    </div>
  )
} 