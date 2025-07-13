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

const PricingStep = dynamic(
  () => import('../../components/account-creation/steps/PricingStep').then(mod => mod.default),
  { ssr: false, loading: () => <div>Loading...</div> }
);

// Form schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  phone: z.string().min(6, "Please enter a valid phone number").optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required").optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"], { message: "Gender is required" }).optional(),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "OTHER"], { message: "Marital status is required" }).optional(),
  currentLocation: z.string().min(1, "Please enter your current location").optional(),
  // Merged from contactInfoSchema
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  postalCode: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
});

// contactInfoSchema is merged into personalInfoSchema, so it's removed as a separate schema

const professionalInfoSchema = z.object({
  profession: z.string().optional(),
  specialization: z.string().optional(),
  yearsOfExperience: z.string().optional(),
  jobTitle: z.string().optional(),
  currentEmployer: z.string().optional(),
  hasProfessionalLicense: z.boolean().optional(),
  licenseType: z.string().optional(),
  licenseNumber: z.string().optional(),
  issuingOrganization: z.string().optional(),
  licenseExpiryDate: z.string().optional(),
  licensingStatus: z.string().optional(),
  // Merged from educationInfoSchema
  educationLevel: z.string().optional(),
  institution: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  graduationYear: z.string().optional().transform(Number), 
  educationStatus: z.string().optional(),
  educationCountry: z.string().optional(),
  educationCity: z.string().optional(),
});

// educationInfoSchema is merged into professionalInfoSchema, so it's removed as a separate schema

const workPreferencesSchema = z.object({
  preferredLocations: z.array(z.string()).optional(),
  willingToRelocate: z.boolean().optional(),
  preferredJobTypes: z.array(z.string()).optional(),
  expectedSalary: z.string().optional().transform(Number),
  noticePeriodValue: z.string().optional().transform(Number),
  noticePeriodUnit: z.enum(["days", "weeks", "months"]).optional(),
  // Merged from visaInfoSchema
  visaType: z.preprocess((val) => String(val).toUpperCase(), z.enum(["EMPLOYMENT", "PSV", "FAMILY", "VISIT"]).optional()),
  processingUrgency: z.preprocess((val) => String(val).toUpperCase(), z.enum(["STANDARD", "URGENT", "EMERGENCY"]).optional()),
});

// visaInfoSchema is merged into workPreferencesSchema, so it's removed as a separate schema

const referencesSchema = z.object({
  references: z.array(z.object({
    name: z.string().optional(),
    position: z.string().optional(),
    company: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  })).optional(),
});

const declarationSchema = z.object({
  confirmAccuracy: z.boolean().optional(),
  termsAccepted: z.boolean().optional(),
  backgroundCheckConsent: z.boolean().optional(),
});

const documentUploadSchema = z.object({
  passport: z.instanceof(File).optional().or(z.null()), 
  license: z.instanceof(File).optional().or(z.null()),
  degree: z.instanceof(File).optional().or(z.null()),
  experience: z.instanceof(File).optional().or(z.null()),
  medicalReport: z.instanceof(File).optional().or(z.null()),
  photo: z.instanceof(File).optional().or(z.null()),
  policeClearance: z.instanceof(File).optional().or(z.null()), 
  resume: z.instanceof(File).optional().or(z.null()), 
  // Merged from referencesSchema and declarationSchema
  ...referencesSchema.shape,
  ...declarationSchema.shape,
});

// Combined schema for the entire form
const formSchema = z.object({
  ...personalInfoSchema.shape,
  ...professionalInfoSchema.shape,
  ...workPreferencesSchema.shape,
  ...documentUploadSchema.shape,
});

type FormValues = z.infer<typeof formSchema>

export default function AccountCreationPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: undefined, 
      gender: undefined, 
      maritalStatus: undefined, 
      currentLocation: undefined, 
      // Merged from contactInfoSchema
      country: "",
      city: "",
      address: "",
      postalCode: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      profession: "",
      specialization: "",
      yearsOfExperience: "",
      jobTitle: "",
      currentEmployer: "",
      hasProfessionalLicense: undefined, 
      licenseType: "",
      licenseNumber: "",
      issuingOrganization: "",
      licenseExpiryDate: "",
      licensingStatus: "",
      // Merged from educationInfoSchema
      educationLevel: undefined, 
      institution: "",
      fieldOfStudy: "",
      graduationYear: undefined, 
      educationStatus: undefined, 
      educationCountry: "",
      educationCity: "",
      preferredLocations: [],
      willingToRelocate: undefined, 
      preferredJobTypes: [],
      expectedSalary: undefined, 
      noticePeriodValue: undefined, 
      noticePeriodUnit: undefined, 
      // Merged from visaInfoSchema
      visaType: undefined, 
      processingUrgency: undefined, 
      // Merged from referencesSchema
      references: [],
      // Merged from declarationSchema
      confirmAccuracy: undefined, 
      termsAccepted: undefined, 
      backgroundCheckConsent: undefined, 
      passport: null,
      license: null,
      degree: null,
      experience: null,
      medicalReport: null,
      photo: null,
      policeClearance: null,
      resume: null,
    },
  })

  // Define steps with proper type and field names that match the form schema
  const steps: Array<{ id: number; name: string; fields: Array<keyof FormValues> }> = [
    { 
      id: 1, 
      name: 'Personal Info', 
      fields: [
        'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender', 'maritalStatus', 'currentLocation',
        'country', 'city', 'address', 'postalCode', 'emergencyContactName', 'emergencyContactPhone'
      ] 
    },
    { 
      id: 2, 
      name: 'Professional', 
      fields: [
        'profession', 'specialization', 'yearsOfExperience', 'jobTitle', 'currentEmployer', 
        'hasProfessionalLicense', 'licenseType', 'licenseNumber', 'issuingOrganization', 'licenseExpiryDate', 'licensingStatus',
        'educationLevel', 'institution', 'fieldOfStudy', 'graduationYear', 'educationStatus', 'educationCountry', 'educationCity'
      ] 
    },
    { 
      id: 3, 
      name: 'Preferences', 
      fields: [
        'preferredLocations', 'willingToRelocate', 'preferredJobTypes', 'expectedSalary', 'noticePeriodValue', 'noticePeriodUnit',
        'visaType', 'processingUrgency'
      ] 
    },
    { 
      id: 4, 
      name: 'Documents & Declaration', 
      fields: [
        'passport', 'license', 'degree', 'experience', 'medicalReport', 'photo', 'policeClearance', 'resume',
        'references', 'confirmAccuracy', 'termsAccepted', 'backgroundCheckConsent'
      ] 
    },
  ]

  const currentStep = steps[step - 1]

  const nextStep = async () => {
    const currentStepFields = currentStep.fields

    console.log("Attempting to trigger validation for fields:", currentStepFields);
    const isValid = await methods.trigger(currentStepFields)
    
    if (isValid) {
      if (step === steps.length) { // If it's the last step (Step 4 now)
        await onSubmit(methods.getValues()); // Trigger the form submission directly
      } else {
        console.log("Validation successful. Moving to next step.");
        setStep((prev) => Math.min(prev + 1, steps.length));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      console.log("Validation failed. Errors:", methods.formState.errors);
      toast.error("Please fill out all required fields for this step.");
    }
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    // No need to re-validate all steps here, as nextStep will ensure current step is valid

    try {
      const formData = new FormData();

      // 1. Explicitly handle file fields by their known names
      const fileFields = [
        'passport', 'license', 'degree', 'experience', 'medicalReport', 'photo', 'policeClearance', 'resume'
      ] as const;

      fileFields.forEach(fieldName => {
        const fileValue: unknown = data[fieldName]; // Cast to unknown first
        // Ensure fileValue is an object and not null before instanceof check
        if (typeof fileValue === 'object' && fileValue !== null) {
          if (fileValue instanceof File) {
            formData.append(fieldName, fileValue);
          }
        }
      });

      // 2. Handle all other non-file fields
      Object.entries(data).forEach(([key, value]) => {
        // Skip file fields already handled above
        if (fileFields.includes(key as typeof fileFields[number])) {
          return;
        }

        if (value !== undefined && value !== null) {
          if (typeof value === 'boolean') {
            formData.append(key, value.toString());
          } else if (typeof value === 'number') {
            formData.append(key, value.toString());
          } else if (Array.isArray(value)) {
            // Arrays of strings or simple types
            formData.append(key, JSON.stringify(value));
          } else if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else if (['visaType', 'processingUrgency', 'gender', 'maritalStatus', 'noticePeriodUnit'].includes(key)) {
            // Ensure enum values are uppercase if backend expects it
            formData.append(key, String(value).toUpperCase());
          } else {
            formData.append(key, value as string);
          }
        }
      });

      const response = await fetch("http://localhost:5002/api/registrations", {
        method: "POST",
        body: formData,
      });

      if (response.status === 413) {
        throw new Error("Upload failed: The total file size exceeds the server limit (1MB). Please upload smaller files or fewer documents.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map((err: any) => `\n- ${err.path.join('.')}: ${err.message}`).join('');
          toast.error(`Validation Failed:${errorMessages}`);
        } else {
          throw new Error(errorData.message || "Failed to submit registration");
        }
      }

      toast.success("Registration completed! You will now be redirected to choose your plan.");
      router.push('/pricing');
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
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

      {/* Reduced default horizontal padding for small screens */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-14 py-8">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
              <div className="md:grid md:grid-cols-12">
                {/* Progress Stepper – hidden on small screens */}
                <div className="hidden md:block md:col-span-3 bg-gray-50 p-6 border-r border-gray-200">
                  <ProgressStepper steps={steps} currentStep={step} />
                </div>

                {/* Form Content */}
                <div className="md:col-span-9 p-8">
                  {/* Mobile progress indicator */}
                  <div className="md:hidden mb-6">
                    <p className="text-sm font-medium text-gray-600 mb-2">Step {step} of {steps.length}</p>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${(step / steps.length) * 100}%` }}
                      />
                    </div>
                  </div>
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
                      {step === 5 && <PricingStep />}
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-10 flex justify-between">
                    <Button
                      type="button"
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
