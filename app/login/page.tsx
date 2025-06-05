"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { Loader2, LogIn } from "lucide-react"
import axios from "axios"
import Image from "next/image"
// ThemeProvider is now in layout

// Form schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Handle form submission
  const onSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true)
      const response = await axios.post("/api/auth/login", values)
      
      toast.success("Logged in successfully")
      router.push("/admin")
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="w-full max-w-md px-4">
          <div className="mb-8 flex flex-col items-center justify-center">
            <div className="mb-4">
             
            </div>
            <Image 
                src="/the.RAM.plc_logo.jpeg" 
                alt="The RAM PLC Logo" 
                width={120} 
                height={40} 
                className="h-auto w-auto"
              />
            <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
          </div>
          
          <Card className="border-border bg-card shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="your.email@example.com" {...field} />
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} The RAM PLC. All rights reserved.</p>
          </div>
        </div>
      </div>
  )
}
