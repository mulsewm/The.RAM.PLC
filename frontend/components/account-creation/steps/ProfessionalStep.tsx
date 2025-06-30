import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SelectableCard } from "@/components/ui/selectable-card"

const ProfessionalStep = () => {
  const { control, watch } = useFormContext()
  const profession = watch("profession")

  const experienceOptions = [
    { value: "0-2", label: "0-2 years" },
    { value: "3-5", label: "3-5 years" },
    { value: "6-10", label: "6-10 years" },
    { value: "10+", label: "10+ years" },
  ]

  const professionOptions = [
    { value: "doctor", label: "Doctor" },
    { value: "nurse", label: "Nurse" },
    { value: "technician", label: "Medical Technician" },
    { value: "specialist", label: "Medical Specialist" },
  ]

  const licenseOptions = [
    { value: "licensed", label: "Fully Licensed" },
    { value: "eligibility", label: "Eligible for License" },
    { value: "in-progress", label: "In Process" },
    { value: "not-started", label: "Not Started" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Professional Background</h2>
        <p className="mt-1 text-sm text-gray-500">Tell us about your professional experience</p>
      </div>

      <div className="space-y-6">
        <FormField
          control={control}
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
          control={control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialization (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder={profession === "doctor" ? "e.g., Cardiology, Neurology" : "e.g., ICU, Pediatrics"} 
                  {...field} 
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormField
            control={control}
            name="yearsOfExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {experienceOptions.map((option) => (
                    <SelectableCard
                      key={option.value}
                      value={option.value}
                      selected={field.value === option.value}
                      onSelect={field.onChange}
                      className="text-center py-3"
                    >
                      {option.label}
                    </SelectableCard>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="licensingStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Licensing Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your licensing status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {licenseOptions.map((option) => (
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
  )
}

export default ProfessionalStep
