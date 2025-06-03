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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

// Define the form schema
const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  role: z.enum(["USER", "REVIEWER", "ADMIN", "SUPER_ADMIN"]),
  active: z.boolean().default(true),
})

// Define the form props
interface UserFormProps {
  user?: {
    id: string
    name: string
    email: string
    role: string
    active: boolean
  }
  onSuccess: () => void
  onCancel: () => void
}

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!user

  // Initialize the form
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      role: (user?.role as any) || "USER",
      active: user?.active ?? true,
    },
  })

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
    setIsSubmitting(true)
    try {
      // Remove empty password field when editing
      if (isEditing && !values.password) {
        delete values.password
      }

      if (isEditing) {
        // Update existing user
        await axios.put(`/api/users/${user.id}`, values)
      } else {
        // Create new user
        await axios.post("/api/users", values)
      }
      
      onSuccess()
    } catch (error: any) {
      console.error("Error submitting form:", error)
      toast.error(error.response?.data?.error || "Failed to save user")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isEditing ? "New Password (leave blank to keep current)" : "Password"}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={isEditing ? "Leave blank to keep current password" : "Minimum 8 characters"} 
                  type="password" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                {isEditing 
                  ? "Leave blank to keep the current password" 
                  : "Must be at least 8 characters"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="REVIEWER">Reviewer</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This determines what permissions the user will have
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditing && (
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Active</FormLabel>
                  <FormDescription>
                    Inactive users cannot log in to the system
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit"  disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update User" : "Create User"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
