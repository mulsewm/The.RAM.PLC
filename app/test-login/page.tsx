"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import axios from "axios"

export default function TestLoginPage() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("test123")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    try {
      setIsLoading(true)
      console.log("Attempting login with:", { email, password })
      
      const response = await axios.post("/api/auth/login", { 
        email, 
        password 
      })
      
      console.log("Login response:", response.data)
      toast.success("Logged in successfully")
      router.push("/admin")
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error(error.response?.data?.error || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Test Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label>Email</label>
            <Input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Email"
            />
          </div>
          <div className="space-y-2">
            <label>Password</label>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password"
            />
          </div>
          <Button 
            className="w-full" 
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          
          <div className="text-sm text-center mt-4">
            <p>Pre-filled with test user credentials</p>
            <p className="text-muted-foreground">Email: test@example.com</p>
            <p className="text-muted-foreground">Password: test123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
