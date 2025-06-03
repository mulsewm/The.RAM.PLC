"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Briefcase, 
  UserCheck, 
  UserX, 
  Clock, 
  ArrowRight,
  Users,
  FileText
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { usePartnership } from "@/lib/partnership-provider"

export default function AdminDashboard() {
  const { 
    applications, 
    isLoading, 
    error, 
    stats
  } = usePartnership()
  
  // Display loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    )
  }
  
  // Display error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Link href="/admin/partnerships">
          <Button className="bg-teal-600 hover:bg-teal-700 text-white">
            View All Applications
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalApplications || 0}</div>
            <p className="text-xs text-muted-foreground">
              Partnership applications received
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.newApplications || 0}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting initial review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.approvedApplications || 0}</div>
            <p className="text-xs text-muted-foreground">
              Applications approved
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Review Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.averageReviewTime || '0 days'}</div>
            <p className="text-xs text-muted-foreground">
              From submission to decision
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Latest partnership applications received
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications && applications.length > 0 ? (
                <>
                  {applications.slice(0, 3).map((app) => {
                    // Calculate time ago
                    const createdDate = new Date(app.createdAt);
                    const now = new Date();
                    const diffInDays = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
                    let timeAgo = "";
                    
                    if (diffInDays === 0) {
                      const diffInHours = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60));
                      if (diffInHours === 0) {
                        const diffInMinutes = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60));
                        timeAgo = `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
                      } else {
                        timeAgo = `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
                      }
                    } else {
                      timeAgo = `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
                    }
                    
                    return (
                      <div key={app.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                          </div>
                          <div>
                            <div className="font-medium">{app.fullName}</div>
                            <div className="text-sm text-gray-500">{app.company}</div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{timeAgo}</div>
                      </div>
                    );
                  })}
                  
                  <Link href="/admin/partnerships" className="flex items-center text-teal-600 hover:text-teal-700 text-sm font-medium">
                    View all applications
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No applications found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>
              Distribution of applications by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applications && applications.length > 0 ? (
              <div className="space-y-4">
                {/* New Applications */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">New</div>
                    <div className="text-sm text-gray-500">
                      {stats?.newApplications || 0} 
                      ({applications.length > 0 ? Math.round((stats?.newApplications || 0) / applications.length * 100) : 0}%)
                    </div>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${applications.length > 0 ? (stats?.newApplications || 0) / applications.length * 100 : 0}%` }} 
                    />
                  </div>
                </div>
                
                {/* Under Review Applications */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Under Review</div>
                    <div className="text-sm text-gray-500">
                      {applications.filter(app => app.status === "Under Review").length} 
                      ({applications.length > 0 ? Math.round(applications.filter(app => app.status === "Under Review").length / applications.length * 100) : 0}%)
                    </div>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 rounded-full" 
                      style={{ width: `${applications.length > 0 ? applications.filter(app => app.status === "Under Review").length / applications.length * 100 : 0}%` }} 
                    />
                  </div>
                </div>
                
                {/* Approved Applications */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Approved</div>
                    <div className="text-sm text-gray-500">
                      {stats?.approvedApplications || 0} 
                      ({applications.length > 0 ? Math.round((stats?.approvedApplications || 0) / applications.length * 100) : 0}%)
                    </div>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full" 
                      style={{ width: `${applications.length > 0 ? (stats?.approvedApplications || 0) / applications.length * 100 : 0}%` }} 
                    />
                  </div>
                </div>
                
                {/* Rejected Applications */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Rejected</div>
                    <div className="text-sm text-gray-500">
                      {stats?.rejectedApplications || 0} 
                      ({applications.length > 0 ? Math.round((stats?.rejectedApplications || 0) / applications.length * 100) : 0}%)
                    </div>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full" 
                      style={{ width: `${applications.length > 0 ? (stats?.rejectedApplications || 0) / applications.length * 100 : 0}%` }} 
                    />
                  </div>
                </div>
                
                {/* Onboarding Applications */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Onboarding</div>
                    <div className="text-sm text-gray-500">0 (0%)</div>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No applications found
              </div>
            )}
          
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
