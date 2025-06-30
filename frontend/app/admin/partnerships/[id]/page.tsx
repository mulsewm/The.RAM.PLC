"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Tags,
  FileText,
  Upload,
  Paperclip,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "Onboarding":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "New":
        return <AlertCircle className="h-3.5 w-3.5 mr-1" />
      case "Under Review":
        return <Clock className="h-3.5 w-3.5 mr-1" />
      case "Approved":
        return <CheckCircle className="h-3.5 w-3.5 mr-1" />
      case "Rejected":
        return <XCircle className="h-3.5 w-3.5 mr-1" />
      case "Onboarding":
        return <FileText className="h-3.5 w-3.5 mr-1" />
      default:
        return null
    }
  }

  return (
    <Badge variant="outline" className={`flex items-center ${getStatusColor(status)}`}>
      {getStatusIcon(status)}
      {status}
    </Badge>
  )
}

interface PageProps {
  params: {
    id: string
  }
}

export default function PartnershipDetail({ params }: PageProps) {
  const router = useRouter()
  const [application, setApplication] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newNote, setNewNote] = useState("")
  const [isSubmittingNote, setIsSubmittingNote] = useState(false)
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileDescription, setFileDescription] = useState("")
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  
  // Mock application data
  const mockApplication = {
    id: params?.id || "1", // Use optional chaining to avoid the error
    fullName: "John Smith",
    email: "john@example.com",
    company: "Acme Inc",
    phone: "+1234567890",
    country: "Kenya",
    expertise: ["Primary Source Verification", "Background Screening"],
    businessType: "Corporate",
    message: "We are interested in partnering with the.RAM.plc to expand our verification services across East Africa. Our company has been in operation for 5 years and we have a strong presence in Kenya and Uganda.",
    status: "New",
    createdAt: "2025-05-30T09:30:00Z",
    updatedAt: "2025-05-30T09:30:00Z",
    statusHistory: [
      {
        id: "status-1",
        status: "New",
        changedBy: "system",
        changedAt: "2025-05-30T09:30:00Z",
        notes: "Application submitted"
      }
    ],
    notes: [
      {
        id: "note-1",
        content: "Initial review: Company looks promising, they have a good track record in East Africa.",
        createdBy: "Jane Doe",
        createdAt: "2025-05-31T10:15:00Z"
      },
      {
        id: "note-2",
        content: "Scheduled a call with the applicant for June 5th to discuss partnership opportunities.",
        createdBy: "Jane Doe",
        createdAt: "2025-06-01T14:30:00Z"
      }
    ],
    attachments: [
      {
        id: "attachment-1",
        fileName: "company_profile.pdf",
        fileType: "application/pdf",
        fileSize: 2457600,
        description: "Company profile document",
        uploadedBy: "Jane Doe",
        uploadedAt: "2025-05-31T11:20:00Z",
        filePath: "/uploads/app-1/company_profile.pdf"
      }
    ]
  }
  
  useEffect(() => {
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      setApplication(mockApplication)
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Handle status change
  const handleStatusChange = async (newStatus: string) => {
    if (!application || application.status === newStatus) return
    
    setIsChangingStatus(true)
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update application status
      const statusHistoryEntry = {
        id: `status-${Date.now()}`,
        previousStatus: application.status,
        status: newStatus,
        changedBy: "Jane Doe",
        changedAt: new Date().toISOString(),
        notes: `Status changed from ${application.status} to ${newStatus}`
      }
      
      setApplication({
        ...application,
        status: newStatus,
        updatedAt: new Date().toISOString(),
        statusHistory: [...application.statusHistory, statusHistoryEntry]
      })
    } catch (error) {
      console.error("Error changing status:", error)
    } finally {
      setIsChangingStatus(false)
    }
  }
  
  // Handle note submission
  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newNote.trim() || !application) return
    
    setIsSubmittingNote(true)
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Add new note
      const note = {
        id: `note-${Date.now()}`,
        content: newNote,
        createdBy: "Jane Doe",
        createdAt: new Date().toISOString()
      }
      
      setApplication({
        ...application,
        updatedAt: new Date().toISOString(),
        notes: [...application.notes, note]
      })
      
      setNewNote("")
    } catch (error) {
      console.error("Error submitting note:", error)
    } finally {
      setIsSubmittingNote(false)
    }
  }
  
  // Handle file upload
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile || !application) return
    
    setIsUploadingFile(true)
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Add new attachment
      const attachment = {
        id: `attachment-${Date.now()}`,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        description: fileDescription,
        uploadedBy: "Jane Doe",
        uploadedAt: new Date().toISOString(),
        filePath: `/uploads/${application.id}/${selectedFile.name}`
      }
      
      setApplication({
        ...application,
        updatedAt: new Date().toISOString(),
        attachments: [...application.attachments, attachment]
      })
      
      setSelectedFile(null)
      setFileDescription("")
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setIsUploadingFile(false)
    }
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="h-8 w-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-4" />
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
            <div className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          </div>
          <div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          </div>
        </div>
      </div>
    )
  }
  
  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-2">Application Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          The partnership application you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/admin/partnerships">
          <Button>Back to Applications</Button>
        </Link>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => router.push("/admin/partnerships")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Applications
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <StatusBadge status={application.status} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-1"
                disabled={isChangingStatus}
              >
                {isChangingStatus ? "Updating..." : "Change Status"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleStatusChange("New")}
                disabled={application.status === "New"}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                New
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("Under Review")}
                disabled={application.status === "Under Review"}
              >
                <Clock className="h-4 w-4 mr-2" />
                Under Review
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("Approved")}
                disabled={application.status === "Approved"}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("Rejected")}
                disabled={application.status === "Rejected"}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejected
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange("Onboarding")}
                disabled={application.status === "Onboarding"}
              >
                <FileText className="h-4 w-4 mr-2" />
                Onboarding
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{application.fullName}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {application.company} • Application ID: {application.id}
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-2 md:mt-0">
          <Calendar className="h-4 w-4" />
          Submitted on {formatDate(application.createdAt)}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                  <p>{application.fullName}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Company/Organization</p>
                  <p>{application.company}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                  <p className="flex items-center gap-1">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a href={`mailto:${application.email}`} className="text-teal-600 hover:underline">
                      {application.email}
                    </a>
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</p>
                  <p className="flex items-center gap-1">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a href={`tel:${application.phone}`} className="text-teal-600 hover:underline">
                      {application.phone}
                    </a>
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Country/Region</p>
                  <p className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    {application.country}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Business Type</p>
                  <p className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4 text-gray-500" />
                    {application.businessType}
                  </p>
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Areas of Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {application.expertise.map((area: string) => (
                      <Badge key={area} variant="secondary" className="flex items-center gap-1">
                        <Tags className="h-3 w-3" />
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {application.message && (
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Message/Comments</p>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <p className="whitespace-pre-wrap">{application.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="notes">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="notes">
                Notes ({application.notes.length})
              </TabsTrigger>
              <TabsTrigger value="attachments">
                Attachments ({application.attachments.length})
              </TabsTrigger>
              <TabsTrigger value="history">
                History ({application.statusHistory.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="notes" className="space-y-4 mt-4">
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleNoteSubmit} className="space-y-4">
                    <Textarea
                      placeholder="Add a note about this application..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={!newNote.trim() || isSubmittingNote}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        {isSubmittingNote ? "Adding Note..." : "Add Note"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              {application.notes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No notes yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {application.notes.slice().reverse().map((note: any) => (
                    <Card key={note.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-teal-100 text-teal-800">
                                {note.createdBy.split(" ").map((n: string) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{note.createdBy}</p>
                              <p className="text-sm text-gray-500">{formatDate(note.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                        <p className="whitespace-pre-wrap">{note.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="attachments" className="space-y-4 mt-4">
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleFileUpload} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium mb-1 block">File</label>
                        <Input
                          type="file"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setSelectedFile(e.target.files[0])
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Description (Optional)</label>
                        <Input
                          placeholder="Enter file description"
                          value={fileDescription}
                          onChange={(e) => setFileDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={!selectedFile || isUploadingFile}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        {isUploadingFile ? (
                          "Uploading..."
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload File
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              
              {application.attachments.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">No attachments yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {application.attachments.slice().reverse().map((attachment: any) => (
                    <Card key={attachment.id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              <Paperclip className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium">{attachment.fileName}</p>
                              <p className="text-sm text-gray-500">
                                {formatFileSize(attachment.fileSize)} • Uploaded by {attachment.uploadedBy} on {formatDate(attachment.uploadedAt)}
                              </p>
                              {attachment.description && (
                                <p className="text-sm mt-1">{attachment.description}</p>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {application.statusHistory.slice().reverse().map((history: any, index: number) => (
                      <div key={history.id} className="relative">
                        {index !== application.statusHistory.length - 1 && (
                          <div className="absolute top-7 bottom-0 left-[19px] w-[2px] bg-gray-200 dark:bg-gray-700" />
                        )}
                        <div className="flex gap-4">
                          <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center z-10">
                            {history.status === "New" ? (
                              <AlertCircle className="h-5 w-5 text-blue-500" />
                            ) : history.status === "Under Review" ? (
                              <Clock className="h-5 w-5 text-yellow-500" />
                            ) : history.status === "Approved" ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : history.status === "Rejected" ? (
                              <XCircle className="h-5 w-5 text-red-500" />
                            ) : (
                              <FileText className="h-5 w-5 text-purple-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {history.previousStatus ? (
                                <>Status changed from <span className="font-bold">{history.previousStatus}</span> to <span className="font-bold">{history.status}</span></>
                              ) : (
                                <>Status set to <span className="font-bold">{history.status}</span></>
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              By {history.changedBy} on {formatDate(history.changedAt)}
                            </p>
                            {history.notes && (
                              <p className="text-sm mt-1">{history.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" variant="outline">
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Call Applicant
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <p className="text-sm">Application Submitted</p>
                  <p className="text-xs text-gray-500 ml-auto">{formatDate(application.createdAt)}</p>
                </div>
                
                {application.status !== "New" && (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <p className="text-sm">Under Review</p>
                    <p className="text-xs text-gray-500 ml-auto">
                      {formatDate(application.statusHistory.find((h: any) => h.status === "Under Review")?.changedAt || "")}
                    </p>
                  </div>
                )}
                
                {(application.status === "Approved" || application.status === "Rejected") && (
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${application.status === "Approved" ? "bg-green-500" : "bg-red-500"}`} />
                    <p className="text-sm">{application.status}</p>
                    <p className="text-xs text-gray-500 ml-auto">
                      {formatDate(application.statusHistory.find((h: any) => h.status === application.status)?.changedAt || "")}
                    </p>
                  </div>
                )}
                
                {application.status === "Onboarding" && (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <p className="text-sm">Onboarding</p>
                    <p className="text-xs text-gray-500 ml-auto">
                      {formatDate(application.statusHistory.find((h: any) => h.status === "Onboarding")?.changedAt || "")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
