"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from "react"
import axios from "axios"

// Define types for our partnership data
export type PartnershipStatus = "New" | "Under Review" | "Approved" | "Rejected" | "Onboarding"

export interface PartnershipApplication {
  id: string
  fullName: string
  email: string
  company: string
  phone: string
  country: string
  expertise: string[]
  businessType: string
  message?: string
  status: PartnershipStatus
  createdAt: string
  updatedAt: string
  statusHistory: StatusHistoryEntry[]
  notes: Note[]
  attachments: Attachment[]
}

export interface StatusHistoryEntry {
  id: string
  previousStatus?: PartnershipStatus
  status: PartnershipStatus
  notes?: string
  changedBy: string
  changedAt: string
}

export interface Note {
  id: string
  content: string
  createdBy: string
  createdAt: string
}

export interface Attachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  description?: string
  uploadedBy: string
  uploadedAt: string
  filePath: string
}

// Define context types
interface PartnershipContextType {
  applications: PartnershipApplication[]
  isLoading: boolean
  error: string | null
  fetchApplications: () => Promise<void>
  getApplicationById: (id: string) => Promise<PartnershipApplication | null>
  updateApplicationStatus: (id: string, status: PartnershipStatus, notes?: string) => Promise<boolean>
  addNote: (id: string, content: string) => Promise<boolean>
  uploadAttachment: (id: string, file: File, description?: string) => Promise<boolean>
  stats: {
    totalApplications: number
    newApplications: number
    approvedApplications: number
    rejectedApplications: number
    averageReviewTime: string
  }
}

// Create context
const PartnershipContext = createContext<PartnershipContextType | undefined>(undefined)

// Provider component
export function PartnershipProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<PartnershipApplication[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalApplications: 0,
    newApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    averageReviewTime: "0 days"
  })

  // Mock data for development
  const mockApplications: PartnershipApplication[] = [
    {
      id: "1",
      fullName: "John Doe",
      email: "john@example.com",
      company: "Acme Inc",
      phone: "+1234567890",
      country: "United States",
      expertise: ["Software Development", "Cloud Infrastructure"],
      businessType: "Technology",
      message: "Looking forward to partnering with you!",
      status: "New",
      notes: [],
      attachments: [],
      statusHistory: [],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "2",
      fullName: "Jane Smith",
      email: "jane@example.com",
      company: "Tech Solutions",
      phone: "+1987654321",
      country: "Canada",
      expertise: ["Marketing", "Sales"],
      businessType: "Consulting",
      message: "Interested in distribution partnership",
      status: "Under Review",
      notes: [{id: "1", content: "Scheduled initial call", createdAt: new Date().toISOString(), createdBy: "admin"}],
      attachments: [],
      statusHistory: [],
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "3",
      fullName: "Robert Johnson",
      email: "robert@example.com",
      company: "Global Traders",
      phone: "+44123456789",
      country: "United Kingdom",
      expertise: ["Logistics", "Supply Chain"],
      businessType: "Distribution",
      message: "We have an established network in Europe",
      status: "Approved",
      notes: [],
      attachments: [],
      statusHistory: [],
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "4",
      fullName: "Maria Garcia",
      email: "maria@example.com",
      company: "Innovate Design",
      phone: "+34987654321",
      country: "Spain",
      expertise: ["Product Design", "UX/UI"],
      businessType: "Creative Agency",
      message: "Would like to discuss potential collaboration",
      status: "Rejected",
      notes: [{id: "2", content: "Not aligned with our current needs", createdAt: new Date().toISOString(), createdBy: "admin"}],
      attachments: [],
      statusHistory: [],
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
  ];

  // Fetch all applications
  const fetchApplications = async () => {
    // Set loading state but don't block multiple calls
    setIsLoading(true)
    setError(null)
    
    try {
      // Try to fetch from API first
      try {
        const response = await axios.get('/api/partnerships')
        const apps = response.data.applications
        
        // Only update state if data has changed and is not empty
        if (apps && apps.length > 0 && JSON.stringify(apps) !== JSON.stringify(applications)) {
          setApplications(apps)
          
          // Calculate stats
          const newApps = apps.filter((app: PartnershipApplication) => app.status === "New").length
          const approvedApps = apps.filter((app: PartnershipApplication) => app.status === "Approved").length
          const rejectedApps = apps.filter((app: PartnershipApplication) => app.status === "Rejected").length
          
          setStats({
            totalApplications: apps.length,
            newApplications: newApps,
            approvedApplications: approvedApps,
            rejectedApplications: rejectedApps,
            averageReviewTime: "2.5 days" // In a real app, this would be calculated
          })
        } else {
          // If API returned empty data, use mock data
          throw new Error("No data from API")
        }
      } catch (apiErr) {
        console.log("Using mock data instead of API", apiErr)
        // Use mock data if API fails
        setApplications(mockApplications)
        
        // Calculate stats from mock data
        const newApps = mockApplications.filter(app => app.status === "New").length
        const approvedApps = mockApplications.filter(app => app.status === "Approved").length
        const rejectedApps = mockApplications.filter(app => app.status === "Rejected").length
        
        setStats({
          totalApplications: mockApplications.length,
          newApplications: newApps,
          approvedApplications: approvedApps,
          rejectedApplications: rejectedApps,
          averageReviewTime: "2.5 days" // In a real app, this would be calculated
        })
      }
    } catch (err) {
      setError("Failed to fetch applications")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Get application by ID
  const getApplicationById = async (id: string): Promise<PartnershipApplication | null> => {
    try {
      const response = await axios.get(`/api/partnerships/${id}`)
      return response.data
    } catch (err) {
      setError("Failed to fetch application details")
      console.error(err)
      return null
    }
  }

  // Update application status
  const updateApplicationStatus = async (id: string, status: PartnershipStatus, notes?: string): Promise<boolean> => {
    try {
      await axios.put(`/api/partnerships/${id}/status`, {
        status,
        notes,
        userId: "current-user" // In a real app, this would be the authenticated user
      })
      
      // Update local state
      setApplications(prevApps => 
        prevApps.map(app => 
          app.id === id ? { ...app, status, updatedAt: new Date().toISOString() } : app
        )
      )
      
      return true
    } catch (err) {
      setError("Failed to update application status")
      console.error(err)
      return false
    }
  }

  // Add note to application
  const addNote = async (id: string, content: string): Promise<boolean> => {
    try {
      await axios.post(`/api/partnerships/${id}/notes`, {
        content,
        userId: "current-user" // In a real app, this would be the authenticated user
      })
      
      return true
    } catch (err) {
      setError("Failed to add note")
      console.error(err)
      return false
    }
  }

  // Upload attachment
  const uploadAttachment = async (id: string, file: File, description?: string): Promise<boolean> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      if (description) {
        formData.append('description', description)
      }
      
      formData.append('userId', 'current-user') // In a real app, this would be the authenticated user
      
      await axios.post(`/api/partnerships/${id}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return true
    } catch (err) {
      setError("Failed to upload attachment")
      console.error(err)
      return false
    }
  }

  // Track if we've already loaded data to prevent multiple fetches
  const dataLoaded = useRef(false)
  
  // Memoize fetchApplications to prevent it from changing on every render
  const memoizedFetchApplications = useCallback(async () => {
    await fetchApplications()
  }, [fetchApplications])
  
  // Load applications on initial mount only
  useEffect(() => {
    if (!dataLoaded.current) {
      memoizedFetchApplications()
      dataLoaded.current = true
    }
  }, [memoizedFetchApplications])

  const value = {
    applications,
    isLoading,
    error,
    fetchApplications,
    getApplicationById,
    updateApplicationStatus,
    addNote,
    uploadAttachment,
    stats
  }

  return (
    <PartnershipContext.Provider value={value}>
      {children}
    </PartnershipContext.Provider>
  )
}

// Custom hook to use the partnership context
export function usePartnership() {
  const context = useContext(PartnershipContext)
  
  if (context === undefined) {
    throw new Error("usePartnership must be used within a PartnershipProvider")
  }
  
  return context
}
