"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  X,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import { usePartnership, PartnershipApplication } from "@/lib/partnership-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

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

export default function PartnershipApplications() {
  const router = useRouter()
  const { applications, isLoading, error } = usePartnership()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [countryFilter, setCountryFilter] = useState("")
  const [businessTypeFilter, setBusinessTypeFilter] = useState("")
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState("desc")
  const [filtersVisible, setFiltersVisible] = useState(false)
  
  // No need to call fetchApplications here as it's already called in the provider
  
  // Filter and sort applications
  const filteredApplications = applications
    .filter((app: PartnershipApplication) => {
      // Apply search filter
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = searchTerm === "" || 
        app.fullName.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower) ||
        app.company.toLowerCase().includes(searchLower)
      
      // Apply status filter
      const matchesStatus = statusFilter === "" || app.status === statusFilter
      
      // Apply country filter
      const matchesCountry = countryFilter === "" || app.country === countryFilter
      
      // Apply business type filter
      const matchesBusinessType = businessTypeFilter === "" || 
        app.businessType === businessTypeFilter
      
      return matchesSearch && matchesStatus && matchesCountry && matchesBusinessType
    })
    .sort((a: PartnershipApplication, b: PartnershipApplication) => {
      // Sort by field based on the selected field
      const fieldA = sortField === 'createdAt' ? new Date(a.createdAt).getTime() : 
                    sortField === 'updatedAt' ? new Date(a.updatedAt).getTime() : 
                    sortField === 'fullName' ? a.fullName.toLowerCase() :
                    sortField === 'company' ? a.company.toLowerCase() :
                    sortField === 'country' ? a.country.toLowerCase() :
                    sortField === 'status' ? a.status : '';
                    
      const fieldB = sortField === 'createdAt' ? new Date(b.createdAt).getTime() : 
                    sortField === 'updatedAt' ? new Date(b.updatedAt).getTime() : 
                    sortField === 'fullName' ? b.fullName.toLowerCase() :
                    sortField === 'company' ? b.company.toLowerCase() :
                    sortField === 'country' ? b.country.toLowerCase() :
                    sortField === 'status' ? b.status : '';
      
      if (fieldA < fieldB) {
        return sortDirection === "asc" ? -1 : 1
      }
      if (fieldA > fieldB) {
        return sortDirection === "asc" ? 1 : -1
      }
      return 0
    })
  
  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("")
    setCountryFilter("")
    setBusinessTypeFilter("")
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Partnership Applications</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and review partnership applications
          </p>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
              <Input
                placeholder="Search by name, email, or company..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setFiltersVisible(!filtersVisible)}
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                Filters
                {(statusFilter || countryFilter || businessTypeFilter) && (
                  <Badge className="ml-1 bg-teal-600">
                    {[statusFilter, countryFilter, businessTypeFilter].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
              
              {(statusFilter || countryFilter || businessTypeFilter) && (
                <Button
                  variant="ghost"
                  onClick={resetFilters}
                  className="flex items-center gap-1"
                >
                  <X size={16} />
                  Clear
                </Button>
              )}
            </div>
          </div>
          
          {filtersVisible && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Onboarding">Onboarding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Country</label>
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All countries</SelectItem>
                    {Array.from(new Set(applications.map((application: PartnershipApplication) => application.country))).sort().map(country => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Business Type</label>
                <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All business types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All business types</SelectItem>
                    {Array.from(new Set(applications.map((application: PartnershipApplication) => application.businessType))).map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
              ))}
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No applications found</p>
              {(searchTerm || statusFilter || countryFilter || businessTypeFilter) && (
                <Button
                  variant="link"
                  onClick={resetFilters}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => toggleSort("fullName")}
                    >
                      <div className="flex items-center">
                        Name
                        {sortField === "fullName" && (
                          sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Business Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => toggleSort("createdAt")}
                    >
                      <div className="flex items-center">
                        Date
                        {sortField === "createdAt" && (
                          sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app: PartnershipApplication) => (
                    <TableRow key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="font-medium">
                        <div>{app.fullName}</div>
                        <div className="text-sm text-gray-500">{app.email}</div>
                      </TableCell>
                      <TableCell>{app.company}</TableCell>
                      <TableCell>{app.country}</TableCell>
                      <TableCell>{app.businessType}</TableCell>
                      <TableCell>
                        <StatusBadge status={app.status} />
                      </TableCell>
                      <TableCell>{formatDate(app.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/admin/partnerships/${app.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
