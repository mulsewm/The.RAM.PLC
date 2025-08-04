"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

// Define the form schema
const settingFormSchema = z.object({
  key: z.string().min(2, "Key must be at least 2 characters"),
  value: z.string().min(1, "Value is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
})

// Define the form props
interface SettingFormProps {
  setting?: {
    id: string
    key: string
    value: string
    description: string
    category: string
  }
  onSuccess: () => void
  onCancel: () => void
  categories: string[]
}

export function SettingForm({ setting, onSuccess, onCancel, categories }: SettingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const isEditing = !!setting

  // Initialize the form
  const form = useForm<z.infer<typeof settingFormSchema>>({
    resolver: zodResolver(settingFormSchema),
    defaultValues: {
      key: setting?.key || "",
      value: setting?.value || "",
      description: setting?.description || "",
      category: setting?.category || (categories.length > 0 ? categories[0] : ""),
    },
  })

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof settingFormSchema>) => {
    setIsSubmitting(true)
    try {
      // If using a new category, update the category value
      if (showNewCategoryInput && newCategory) {
        values.category = newCategory
      }

      if (isEditing) {
        // Update existing setting
        await axios.put(`/api/settings/${setting.key}`, values)
      } else {
        // Create new setting
        await axios.post("/api/settings", values)
      }
      
      onSuccess()
    } catch (error: any) {
      console.error("Error submitting form:", error)
      toast.error(error.response?.data?.error || "Failed to save setting")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., email.sender_name" 
                  {...field} 
                  disabled={isEditing} // Can't change key when editing
                />
              </FormControl>
              <FormDescription>
                A unique identifier for this setting. Use dot notation for namespacing.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Setting value" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What this setting is used for" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Explain what this setting controls and how it affects the system.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {showNewCategoryInput ? (
          <div className="space-y-2">
            <FormLabel>New Category</FormLabel>
            <div className="flex gap-2">
              <Input
                placeholder="Enter new category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setShowNewCategoryInput(false)
                  setNewCategory("")
                }}
              >
                Cancel
              </Button>
            </div>
            <FormDescription>
              Create a new category for organizing settings.
            </FormDescription>
          </div>
        ) : (
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <div className="flex gap-2">
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowNewCategoryInput(true)}
                  >
                    New
                  </Button>
                </div>
                <FormDescription>
                  Group related settings together by category.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update Setting" : "Create Setting"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
