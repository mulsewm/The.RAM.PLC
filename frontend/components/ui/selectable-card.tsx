import * as React from "react"
import { cn } from "@/lib/utils"

interface SelectableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  selected?: boolean
  onSelect: (value: string) => void
  children: React.ReactNode
}

export function SelectableCard({
  className,
  value,
  selected = false,
  onSelect,
  children,
  ...props
}: SelectableCardProps) {
  return (
    <div
      className={cn(
        "cursor-pointer rounded-md border-2 border-gray-200 bg-white p-4 transition-colors hover:border-primary hover:bg-primary/5",
        selected && "border-primary bg-primary/5 ring-2 ring-primary/20",
        className
      )}
      onClick={() => onSelect(value)}
      {...props}
    >
      {children}
    </div>
  )
}
