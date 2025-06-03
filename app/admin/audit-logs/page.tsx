"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { format } from "date-fns"
import { 
  Search, 
  Filter, 
  RefreshCw, 
  FileText,
  Calendar,
  User,
  Tag,
  Activity
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { toast } from "sonner"

// Define types
interface AuditLog {
  id: string
  action: string
  entityType: string
  entityId: string
  details: string
  ipAddress: string
  userAgent: string
  createdAt: string
  performedBy: {
    id: string
    name: string
    email: string
  }
}

interface Pagination {
  total: number
  page: number
  limit: number
  pages: number
}

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    pages: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter states
  const [actionFilter, setActionFilter] = useState<string>("")
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>("")
  const [entityIdFilter, setEntityIdFilter] = useState<string>("")
  const [userIdFilter, setUserIdFilter] = useState<string>("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  // Fetch audit logs
  const fetchAuditLogs = async (page = 1) => {
    setIsLoading(true)
    setError(null)
    try {
      // Build query parameters
      const params = new URLSearchParams()
      params.append("page", page.toString())
      params.append("limit", pagination.limit.toString())
      if (actionFilter) params.append("action", actionFilter)
      if (entityTypeFilter) params.append("entityType", entityTypeFilter)
      if (entityIdFilter) params.append("entityId", entityIdFilter)
      if (userIdFilter) params.append("userId", userIdFilter)
      if (startDate) params.append("startDate", startDate.toISOString())
      if (endDate) params.append("endDate", endDate.toISOString())

      const response = await axios.get(`/api/audit-logs?${params.toString()}`)
      setAuditLogs(response.data.auditLogs)
      setPagination(response.data.pagination)
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch audit logs")
      toast.error("Failed to fetch audit logs")
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchAuditLogs()
  }, [])

  // Handle filter change
  const handleFilterChange = () => {
    fetchAuditLogs(1) // Reset to first page when filtering
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    fetchAuditLogs(newPage)
  }

  // Clear all filters
  const clearFilters = () => {
    setActionFilter("")
    setEntityTypeFilter("")
    setEntityIdFilter("")
    setUserIdFilter("")
    setStartDate(undefined)
    setEndDate(undefined)
    fetchAuditLogs(1)
  }

  // Format JSON details for display
  const formatDetails = (details: string) => {
    try {
      const parsed = JSON.parse(details)
      return Object.entries(parsed).map(([key, value]) => (
        <div key={key} className="text-sm">
          <span className="font-medium">{key}:</span> {String(value)}
        </div>
      ))
    } catch (e) {
      return details
    }
  }

  // Get badge color based on action type
  const getActionBadgeVariant = (action: string): "default" | "outline" | "destructive" | "secondary" => {
    if (action.includes("create")) return "default"
    if (action.includes("update")) return "secondary"
    if (action.includes("delete") || action.includes("deactivate")) return "destructive"
    if (action.includes("view") || action.includes("list")) return "outline"
    if (action.includes("login") || action.includes("logout")) return "secondary" // Changed from success to secondary
    return "outline"
  }

  // Display loading state
  if (isLoading && auditLogs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    )
  }
  
  // Display error state
  if (error && auditLogs.length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>System Activity</CardTitle>
          <CardDescription>
            Track and monitor all system activities and changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_actions">All Actions</SelectItem>
                    <SelectItem value="user.create">User Create</SelectItem>
                    <SelectItem value="user.update">User Update</SelectItem>
                    <SelectItem value="user.delete">User Delete</SelectItem>
                    <SelectItem value="user.password_reset">Password Reset</SelectItem>
                    <SelectItem value="settings.update">Settings Update</SelectItem>
                    <SelectItem value="settings.create">Settings Create</SelectItem>
                    <SelectItem value="settings.delete">Settings Delete</SelectItem>
                    <SelectItem value="auth.login">Login</SelectItem>
                    <SelectItem value="auth.logout">Logout</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all_entity_types">All Entity Types</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Settings">Settings</SelectItem>
                    <SelectItem value="PartnershipApplication">Partnership Application</SelectItem>
                    <SelectItem value="Auth">Authentication</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Entity ID"
                  value={entityIdFilter}
                  onChange={(e) => setEntityIdFilter(e.target.value)}
                  className="flex-1"
                />

                <Input
                  placeholder="User ID"
                  value={userIdFilter}
                  onChange={(e) => setUserIdFilter(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Calendar className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "End date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button variant="outline" onClick={() => fetchAuditLogs(pagination.page)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={handleFilterChange}>
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Audit logs table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                      No audit logs found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          <Activity className="h-3 w-3 mr-1" />
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{log.entityType}</span>
                          <span className="text-xs text-gray-500">{log.entityId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{log.performedBy.name}</span>
                          <span className="text-xs text-gray-500">{log.performedBy.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="text-sm">
                          {log.details ? formatDetails(log.details) : "No details"}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {log.ipAddress}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} logs
              </div>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const pageNumber = pagination.page <= 3
                    ? i + 1
                    : pagination.page + i - 2
                  
                  if (pageNumber <= pagination.pages) {
                    return (
                      <Button
                        key={pageNumber}
                        variant={pageNumber === pagination.page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </Button>
                    )
                  }
                  return null
                })}
                {pagination.pages > 5 && pagination.page < pagination.pages - 2 && (
                  <span className="flex items-center px-2">...</span>
                )}
                {pagination.pages > 5 && pagination.page < pagination.pages - 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.pages)}
                  >
                    {pagination.pages}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
