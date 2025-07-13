"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

interface PricingCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  title: string
  description: string
  price: number
  priceUnit: string
  features: string[]
  buttonText: string
  isFeatured?: boolean
}

const PricingCard = React.forwardRef<
  React.ElementRef<typeof Card>,
  PricingCardProps
>(({ className, title, description, price, priceUnit, features, buttonText, isFeatured = false, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950",
      isFeatured && "border-primary-500 ring-2 ring-primary-500", // Highlight featured card
      className
    )}
    {...props}
  >
    <CardHeader className="p-0">
      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">{title}</CardTitle>
      <CardDescription className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {description}
      </CardDescription>
      <div className="mt-4 flex items-baseline">
        <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">${price}</span>
        <span className="ml-1 text-base font-semibold text-gray-600 dark:text-gray-400">USD</span>
        <span className="ml-1 text-base text-gray-500 dark:text-gray-400">{priceUnit}</span>
      </div>
    </CardHeader>
    <CardContent className="mt-6 flex-grow p-0">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Start selling with:</h3>
      <ul role="list" className="mt-4 space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-center">
            <Check className="h-4 w-4 text-primary-500" />
            <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter className="mt-8 p-0">
      <Button className="w-full" variant={isFeatured ? "default" : "outline"}>
        {buttonText}
      </Button>
    </CardFooter>
  </Card>
))
PricingCard.displayName = "PricingCard"

export { PricingCard } 