"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Handshake } from "lucide-react"
import { PartnerForm } from "./partner-form"

interface PartnerCTAProps {
  variant?: "primary" | "secondary" | "outline" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  showIcon?: boolean
}

export function PartnerCTA({
  variant = "primary",
  size = "default",
  className = "",
  showIcon = true,
}: PartnerCTAProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Map variant prop to button variant
  const buttonVariantMap: Record<string, "default" | "secondary" | "outline" | "link" | "destructive" | "ghost"> = {
    primary: "default",
    secondary: "secondary",
    outline: "outline",
    link: "link",
  }

  // Custom class based on variant
  const getCustomClass = () => {
    switch (variant) {
      case "primary":
        return "bg-teal-600 hover:bg-teal-700 text-white"
      case "secondary":
        return "bg-white text-teal-600 hover:bg-gray-100 border border-teal-600"
      case "outline":
        return "border-teal-600 text-teal-600 hover:bg-teal-50"
      case "link":
        return "text-teal-600 hover:text-teal-700 hover:underline"
      default:
        return ""
    }
  }

  return (
    <>
      <Button
        variant={variant === "primary" ? "default" : buttonVariantMap[variant]}
        size={size}
        className={`${getCustomClass()} ${className}`}
        onClick={() => setIsOpen(true)}
      >
        {showIcon && <Handshake className="mr-2 h-4 w-4" />}
        Become a Partner
      </Button>
      <PartnerForm open={isOpen} onOpenChange={setIsOpen} />
    </>
  )
}
