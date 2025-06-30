"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { 
  Plus, 
  Save, 
  Trash2, 
  Edit, 
  RefreshCw,
  Check,
  X
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "sonner"
import { SettingForm } from "@/components/setting-form"

// Define types
interface Setting {
  id: string
  key: string
  value: string
  description: string
  category: string
  createdAt: string
  updatedAt: string
}

interface SettingsGroup {
  [category: string]: Setting[]
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsGroup>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null)
  const [activeTab, setActiveTab] = useState<string>("all")

  // Fetch settings
  const fetchSettings = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await axios.get("/api/settings")
      setSettings(response.data.settings)
      
      // Set the first category as active tab if it exists and "all" isn't selected
      if (activeTab === "all" && Object.keys(response.data.settings).length > 0) {
        setActiveTab(Object.keys(response.data.settings)[0])
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch settings")
      toast.error("Failed to fetch settings")
    } finally {
      setIsLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchSettings()
  }, [])

  // Handle setting creation
  const handleSettingCreated = () => {
    setIsCreateDialogOpen(false)
    fetchSettings() // Refresh the list
    toast.success("Setting created successfully")
  }

  // Handle setting update
  const handleSettingUpdated = () => {
    setIsEditDialogOpen(false)
    setSelectedSetting(null)
    fetchSettings() // Refresh the list
    toast.success("Setting updated successfully")
  }

  // Handle setting deletion
  const handleDeleteSetting = async () => {
    if (!selectedSetting) return

    try {
      await axios.delete(`/api/settings/${selectedSetting.key}`)
      setIsDeleteDialogOpen(false)
      setSelectedSetting(null)
      fetchSettings() // Refresh the list
      toast.success("Setting deleted successfully")
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to delete setting")
    }
  }

  // Display loading state
  if (isLoading && Object.keys(settings).length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    )
  }
  
  // Display error state
  if (error && Object.keys(settings).length === 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  // Get all categories
  const categories = Object.keys(settings)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Setting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Setting</DialogTitle>
              <DialogDescription>
                Add a new system setting. Settings are used to configure system behavior.
              </DialogDescription>
            </DialogHeader>
            <SettingForm 
              onSuccess={handleSettingCreated} 
              onCancel={() => setIsCreateDialogOpen(false)} 
              categories={categories}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>
            Manage system-wide settings and configurations.
          </CardDescription>
          <div className="flex justify-end">
            <Button variant="outline" onClick={fetchSettings} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(settings).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No settings found. Add your first setting to get started.</p>
            </div>
          ) : (
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Categories</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all">
                <Accordion type="multiple" className="w-full">
                  {categories.map((category) => (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger className="text-lg font-medium">
                        {category} ({settings[category].length})
                      </AccordionTrigger>
                      <AccordionContent>
                        <SettingsTable 
                          settings={settings[category]} 
                          onEdit={(setting) => {
                            setSelectedSetting(setting)
                            setIsEditDialogOpen(true)
                          }}
                          onDelete={(setting) => {
                            setSelectedSetting(setting)
                            setIsDeleteDialogOpen(true)
                          }}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              {categories.map((category) => (
                <TabsContent key={category} value={category}>
                  <SettingsTable 
                    settings={settings[category]} 
                    onEdit={(setting) => {
                      setSelectedSetting(setting)
                      setIsEditDialogOpen(true)
                    }}
                    onDelete={(setting) => {
                      setSelectedSetting(setting)
                      setIsDeleteDialogOpen(true)
                    }}
                  />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Edit Setting Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Setting</DialogTitle>
            <DialogDescription>
              Update setting details and value.
            </DialogDescription>
          </DialogHeader>
          {selectedSetting && (
            <SettingForm 
              setting={selectedSetting} 
              onSuccess={handleSettingUpdated} 
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedSetting(null)
              }} 
              categories={categories}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Setting Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Setting</DialogTitle>
            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete the setting <strong>{selectedSetting?.key}</strong>?
            <p className="text-sm text-gray-500 mt-2">
              This may affect system functionality if the setting is used by active components.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSetting}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Settings Table Component
interface SettingsTableProps {
  settings: Setting[]
  onEdit: (setting: Setting) => void
  onDelete: (setting: Setting) => void
}

function SettingsTable({ settings, onEdit, onDelete }: SettingsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Key</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settings.map((setting) => (
            <TableRow key={setting.id}>
              <TableCell className="font-medium">{setting.key}</TableCell>
              <TableCell className="max-w-[200px] truncate">{setting.value}</TableCell>
              <TableCell className="max-w-[300px] truncate">{setting.description}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(setting)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(setting)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
