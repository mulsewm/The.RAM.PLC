import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PreferencesStep = () => {
  const { control } = useFormContext()

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
    { value: "express", label: "Express (15-20 days)" },
    { value: "urgent", label: "Urgent (7-10 days)" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Location & Preferences</h2>
        <p className="mt-1 text-sm text-gray-500">Tell us about your location and visa preferences</p>
      </div>

      <div className="space-y-6">
        <FormField
          control={control}
          name="currentLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Location</FormLabel>
              <FormControl>
                <Input 
                  placeholder="City, Country" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="preferredLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Work Location</FormLabel>
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={control}
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
            control={control}
            name="processingUrgency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Processing Urgency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency" />
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
      </div>
    </div>
  )
}

export default PreferencesStep
