import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import React from "react"

export interface Step {
  id: number
  name: string
  fields?: string[]
}

interface ProgressStepperProps {
  steps: Step[]
  currentStep: number
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress" className="sticky top-8">
      <ol className="space-y-6">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep

          return (
            <li key={step.name} className="relative">
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-4 left-4 -bottom-4 w-0.5",
                    isCompleted ? "bg-primary" : "bg-gray-200"
                  )}
                  aria-hidden="true"
                />
              )}

              <div className="relative flex items-start group">
                <span className="h-9 flex items-center">
                  <span
                    className={cn(
                      "relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors",
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                        ? "border-2 border-primary bg-background"
                        : "border-2 border-gray-300 bg-background"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <span
                        className={cn(
                          "h-2.5 w-2.5 rounded-full transition-colors",
                          isCurrent ? "bg-primary" : "bg-transparent"
                        )}
                      />
                    )}
                  </span>
                </span>
                <span className="ml-4 min-w-0 flex flex-col">
                  <span
                    className={cn(
                      "text-xs font-semibold tracking-wide uppercase transition-colors",
                      isCurrent ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    Step {step.id}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isCurrent ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.name}
                  </span>
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default ProgressStepper
