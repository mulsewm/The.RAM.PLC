"use client"

import { useState, Fragment } from "react"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ChevronRight, Loader2 } from "lucide-react"
import dynamic from 'next/dynamic'

// Dynamically import components with no SSR
const ProgressStepper = dynamic<{ steps: Array<{ id: number; name: string; fields?: string[] }>; currentStep: number }>(
  () => import('../../components/account-creation/ProgressStepper').then(mod => mod.default),
  { ssr: false, loading: () => <div>Loading...</div> }
)

const PersonalInfoStep = dynamic(
  () => import('../../components/account-creation/steps/PersonalInfoStep').then(mod => mod.default),
  { ssr: false, loading: () => <div>Loading...</div> }
)

const ProfessionalStep = dynamic(
  () => import('../../components/account-creation/steps/ProfessionalStep').then(mod => mod.default),
  { ssr: false, loading: () => <div>Loading...</div> }
)

const PreferencesStep = dynamic(
  () => import('../../components/account-creation/steps/PreferencesStep').then(mod => mod.default),
  { ssr: false, loading: () => <div>Loading...</div> }
)

const DocumentUploadStep = dynamic(
  () => import('../../components/account-creation/steps/DocumentUploadStep').then(mod => mod.default),
  { ssr: false, loading: () => <div>Loading...</div> }
)

// Form schemas
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

export default function AccountCreationPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      profession: "",
      yearsOfExperience: "",
      licensingStatus: "",
      preferredLocation: "",
      visaType: "",
      processingUrgency: "",
    },
  })

  // Define steps with proper type and field names that match the form schema
  const steps: Array<{ id: number; name: string; fields: Array<keyof z.infer<typeof formSchema>> }> = [
    { 
      id: 1, 
      name: 'Personal Info', 
      fields: ['firstName', 'lastName', 'email', 'phone'] 
    },
    { 
      id: 2, 
      name: 'Professional', 
      fields: ['profession', 'specialization', 'yearsOfExperience', 'licensingStatus'] 
    },
    { 
      id: 3, 
      name: 'Preferences', 
      fields: ['currentLocation', 'preferredLocation', 'visaType', 'processingUrgency'] 
    },
    { 
      id: 4, 
      name: 'Documents', 
      fields: ['passport', 'license', 'degree', 'experience', 'medicalReport', 'photo'] 
    },
  ]

  const nextStep = async () => {
    const currentStepFields = steps[step - 1].fields
    const isValid = await methods.trigger(currentStepFields)
    
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, steps.length))
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    try {
      // Here you would typically send the data to your API
      console.log("Form submitted:", data)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show success message
      toast.success("Account created successfully!")
      
      // Redirect to dashboard or login page
      router.push("/dashboard")
    } catch (error) {
      console.error("Submission error:", error)
      toast.error("Failed to create account. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-14 sm:px-6 lg:px-14 py-14">
          <h1 className="text-2xl font-bold text-gray-900">Healthcare Professional Registration</h1>
          <p className="mt-1 text-sm text-gray-500">
            Complete your profile to start your journey to working in the GCC region
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-14 sm:px-6 lg:px-14 py-8">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
              <div className="md:grid md:grid-cols-12">
                {/* Progress Stepper */}
                <div className="md:col-span-3 bg-gray-50 p-6 border-r border-gray-200">
                  <ProgressStepper steps={steps} currentStep={step} />
                </div>

                {/* Form Content */}
                <div className="md:col-span-9 p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {step === 1 && <PersonalInfoStep />}
                      {step === 2 && <ProfessionalStep />}
                      {step === 3 && <PreferencesStep />}
                      {step === 4 && <DocumentUploadStep />}
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-10 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={step === 1}
                    >
                      Previous
                    </Button>

                    {step < steps.length ? (
                      <Button 
                        type="button"
                        onClick={nextStep}
                      >
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Application"
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}
