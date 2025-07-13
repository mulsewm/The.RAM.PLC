"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Linkedin, Twitter } from "lucide-react"

interface TeamMemberCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  name: string
  title: string
  imageUrl?: string
  bio?: string
  linkedinUrl?: string
  twitterUrl?: string
}

const TeamMemberCard = React.forwardRef<
  React.ElementRef<typeof Card>,
  TeamMemberCardProps
>(({ className, name, title, imageUrl, bio, linkedinUrl, twitterUrl, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn(
      "flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300",
      className
    )}
    {...props}
  >
    <Avatar className="h-24 w-24 mb-4 border-2 border-primary-500 shadow-md">
      <AvatarImage src={imageUrl || "/placeholder-user.jpg"} alt={name} />
      <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
    </Avatar>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{name}</h3>
    <p className="text-primary-600 dark:text-primary-400 text-sm font-medium mb-3">{title}</p>
    {bio && <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{bio}</p>}
    <div className="flex space-x-2 mt-auto">
      {linkedinUrl && (
        <Button variant="ghost" size="icon" asChild>
          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5 text-gray-600 dark:text-gray-400 hover:text-primary-500" />
          </a>
        </Button>
      )}
      {twitterUrl && (
        <Button variant="ghost" size="icon" asChild>
          <a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <Twitter className="h-5 w-5 text-gray-600 dark:text-gray-400 hover:text-primary-500" />
          </a>
        </Button>
      )}
    </div>
  </Card>
))

TeamMemberCard.displayName = "TeamMemberCard"

export { TeamMemberCard } 