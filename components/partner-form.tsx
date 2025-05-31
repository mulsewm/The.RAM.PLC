"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Shield, HelpCircle, CheckCircle } from "lucide-react"

// Form schema with validation
const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  phone: z.string().min(6, {
    message: "Please enter a valid phone number.",
  }),
  country: z.string({
    required_error: "Please select a country/region.",
  }),
  expertise: z.array(z.string()).min(1, {
    message: "Please select at least one area of expertise.",
  }),
  businessType: z.string({
    required_error: "Please select a business type.",
  }),
  message: z.string().optional(),
  termsAgreed: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and privacy policy.",
  }),
})

type FormValues = z.infer<typeof formSchema>

// List of countries for dropdown
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
]

// Areas of expertise options
const expertiseAreas = [
  { id: "psv", label: "Primary Source Verification" },
  { id: "background", label: "Background Screening" },
  { id: "mystery", label: "Mystery Shopping" },
  { id: "analytics", label: "Data Analytics" },
  { id: "risk", label: "Risk Assessment" },
  { id: "other", label: "Other" }
]

// Business type options
const businessTypes = [
  { id: "healthcare", label: "Healthcare" },
  { id: "education", label: "Education" },
  { id: "corporate", label: "Corporate" },
  { id: "government", label: "Government" },
  { id: "other", label: "Other" }
]

export function PartnerForm({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      phone: "",
      expertise: [],
      message: "",
      termsAgreed: false,
    },
  })

  // Handle form submission
  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    
    // Simulate API call with timeout
    try {
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log("Form submitted:", data)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Error submitting form:", error)
      form.setError("root", { 
        type: "manual",
        message: "There was an error submitting your request. Please try again."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form state when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Wait for close animation before resetting
      setTimeout(() => {
        setIsSubmitted(false)
        form.reset()
      }, 300)
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center py-8"
            >
              <div className="h-16 w-16 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-10 w-10 text-teal-600" />
              </div>
              <DialogTitle className="text-2xl font-bold mb-4">Partnership Request Submitted!</DialogTitle>
              <DialogDescription className="mb-6 text-lg">
                Thank you for your interest in partnering with Theramplc. Our team will review your application and contact you within 2 business days.
              </DialogDescription>
              <p className="text-sm text-gray-500 mb-6">
                A confirmation email has been sent to your provided email address with additional information about our partnership program.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <HelpCircle className="h-4 w-4" />
                <p>Questions? Contact our partnership team at <a href="mailto:partners@theramplc.com" className="text-teal-600 hover:underline">partners@theramplc.com</a></p>
              </div>
              <Button 
                onClick={() => handleOpenChange(false)} 
                className="mt-8 bg-teal-600 hover:bg-teal-700"
              >
                Close
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">Join Our Global Verification Network</DialogTitle>
                <DialogDescription className="text-center mt-2">
                  Partner with Theramplc to expand your reach across Africa and beyond. Collaborate on verification services, data analytics, and consulting solutions while accessing our established client network.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 mb-8 p-4 bg-teal-50 rounded-lg border border-teal-100">
                <h4 className="font-medium text-teal-800 mb-2">Why Partner With Us</h4>
                <ul className="space-y-1 text-sm text-teal-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Access to established clients across Africa and the Middle East</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Collaborative revenue opportunities in verification services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Technical support and training for all partnership initiatives</span>
                  </li>
                </ul>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
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
                            <Input type="email" placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company/Organization</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Company Ltd." {...field} />
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

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country/Region</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[200px]">
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
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
                    name="expertise"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel>Areas of Expertise</FormLabel>
                          <FormDescription>
                            Select all that apply to your organization
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {expertiseAreas.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="expertise"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {item.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Business Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {businessTypes.map((type) => (
                                <FormItem key={type.id} className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value={type.id} />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {type.label}
                                  </FormLabel>
                                </FormItem>
                              ))}
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message/Comments (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us more about your organization and partnership interests..."
                            className="resize-none min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-start space-x-2 pt-2">
                    <Shield className="h-5 w-5 text-teal-600 mt-0.5" />
                    <p className="text-sm text-gray-500">
                      Your information is secure and will only be used to process your partnership request.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="termsAgreed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal">
                            I agree to Theramplc's{" "}
                            <a href="#" className="text-teal-600 hover:underline">
                              Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-teal-600 hover:underline">
                              Privacy Policy
                            </a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <div className="w-full flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                      <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-teal-600 hover:bg-teal-700 mb-2 sm:mb-0"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Partnership Request"}
                      </Button>
                    </div>
                  </DialogFooter>
                  
                  {form.formState.errors.root && (
                    <p className="text-sm font-medium text-red-500 text-center">
                      {form.formState.errors.root.message}
                    </p>
                  )}
                  
                  <div className="text-center text-sm text-gray-500 pt-2">
                    <p className="flex items-center justify-center gap-1">
                      <HelpCircle className="h-4 w-4" />
                      Questions about partnering? Contact our team at{" "}
                      <a href="mailto:partners@theramplc.com" className="text-teal-600 hover:underline">
                        partners@theramplc.com
                      </a>
                    </p>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
