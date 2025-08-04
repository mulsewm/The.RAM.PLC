import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"

interface Country {
  cca2: string;
  name: {
    common: string;
  };
}

const PreferencesStep = () => {
  const { control, setValue } = useFormContext()
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=cca2,name')
        if (!response.ok) {
          throw new Error('Failed to fetch countries')
        }
        const data = await response.json()
        // Sort countries alphabetically by name
        const sortedCountries = data.sort((a: Country, b: Country) => 
          a.name.common.localeCompare(b.name.common)
        )
        setCountries(sortedCountries)
      } catch (err) {
        console.error('Error fetching countries:', err)
        setError('Failed to load countries. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCountries()
  }, [])

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
                {isLoading ? (
                  <Input placeholder="Loading countries..." disabled />
                ) : error ? (
                  <div className="text-red-500 text-sm">{error}</div>
                ) : (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                      setValue('currentLocation', value, { shouldValidate: true })
                    }}
                    value={field.value || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {countries.map((country) => (
                        <SelectItem key={country.cca2} value={country.name.common}>
                          {country.name.common}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
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
