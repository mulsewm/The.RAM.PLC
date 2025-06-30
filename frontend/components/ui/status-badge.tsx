import React from "react"
import { AlertCircle, Clock, CheckCircle, XCircle, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: "New" | "Under Review" | "Approved" | "Rejected" | "Onboarding"
  size?: "sm" | "md" | "lg"
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
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
    const iconSize = size === "sm" ? "h-3 w-3 mr-1" : size === "lg" ? "h-4 w-4 mr-1.5" : "h-3.5 w-3.5 mr-1"
    
    switch (status) {
      case "New":
        return <AlertCircle className={iconSize} />
      case "Under Review":
        return <Clock className={iconSize} />
      case "Approved":
        return <CheckCircle className={iconSize} />
      case "Rejected":
        return <XCircle className={iconSize} />
      case "Onboarding":
        return <FileText className={iconSize} />
      default:
        return null
    }
  }

  const sizeClasses = {
    sm: "text-xs py-0.5 px-1.5",
    md: "text-sm py-0.5 px-2",
    lg: "text-base py-1 px-2.5"
  }

  return (
    <Badge 
      variant="outline" 
      className={`flex items-center ${getStatusColor(status)} ${sizeClasses[size]}`}
    >
      {getStatusIcon(status)}
      {status}
    </Badge>
  )
}
