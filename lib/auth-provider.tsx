"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// Define the User type
interface User {
  id: string
  name: string
  email: string
  role: string
  active: boolean
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider props
interface AuthProviderProps {
  children: ReactNode
}

// Create the AuthProvider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Check if user is authenticated
  const checkAuth = async (): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await axios.get("/api/auth/me")
      setUser(response.data.user)
      setIsAuthenticated(true)
      return true
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await axios.post("/api/auth/login", { email, password })
      setUser(response.data.user)
      setIsAuthenticated(true)
      toast.success("Logged in successfully")
      return true
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Login failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      await axios.post("/api/auth/logout")
      setUser(null)
      setIsAuthenticated(false)
      router.push("/login")
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error("Logout failed")
    } finally {
      setIsLoading(false)
    }
  }

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Create the context value
  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Create a hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
