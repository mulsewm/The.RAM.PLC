import React, { useState, useRef } from "react"
import { Upload, X, File, FileText, Image, Film, Music, Archive, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface FileUploadProps {
  onFileSelect: (file: File, description: string) => void
  isUploading?: boolean
  allowedFileTypes?: string[]
  maxFileSizeMB?: number
  descriptionRequired?: boolean
  buttonText?: string
}

export function FileUpload({
  onFileSelect,
  isUploading = false,
  allowedFileTypes,
  maxFileSizeMB = 10,
  descriptionRequired = false,
  buttonText = "Upload File"
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <Image className="h-6 w-6 text-blue-500" />
    if (fileType.startsWith("video/")) return <Film className="h-6 w-6 text-purple-500" />
    if (fileType.startsWith("audio/")) return <Music className="h-6 w-6 text-pink-500" />
    if (fileType.includes("pdf")) return <FileText className="h-6 w-6 text-red-500" />
    if (fileType.includes("zip") || fileType.includes("rar") || fileType.includes("tar")) 
      return <Archive className="h-6 w-6 text-yellow-500" />
    if (fileType.includes("html") || fileType.includes("css") || fileType.includes("javascript"))
      return <Code className="h-6 w-6 text-green-500" />
    return <File className="h-6 w-6 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    validateAndSetFile(file)
  }

  const validateAndSetFile = (file: File) => {
    setError(null)
    
    // Check file type if restrictions are provided
    if (allowedFileTypes && allowedFileTypes.length > 0) {
      const fileTypeMatches = allowedFileTypes.some(type => {
        if (type.includes("*")) {
          // Handle wildcard types like "image/*"
          const category = type.split("/")[0]
          return file.type.startsWith(`${category}/`)
        }
        return file.type === type
      })
      
      if (!fileTypeMatches) {
        setError(`File type not allowed. Accepted types: ${allowedFileTypes.join(", ")}`)
        return
      }
    }
    
    // Check file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      setError(`File size exceeds the maximum limit of ${maxFileSizeMB}MB`)
      return
    }
    
    setSelectedFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    
    validateAndSetFile(file)
  }

  const clearFile = () => {
    setSelectedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = () => {
    if (!selectedFile) return
    if (descriptionRequired && !description.trim()) {
      setError("Please provide a description for this file")
      return
    }
    
    onFileSelect(selectedFile, description)
  }

  return (
    <div className="space-y-4">
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isDragging 
              ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20" 
              : "border-gray-300 dark:border-gray-700"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400 dark:text-gray-600 mb-2" />
            <p className="text-sm font-medium">
              Drag and drop a file here, or{" "}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-medium"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {allowedFileTypes 
                ? `Accepted file types: ${allowedFileTypes.join(", ")}`
                : "All file types accepted"} 
              (Max size: {maxFileSizeMB}MB)
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={allowedFileTypes?.join(",")}
          />
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {getFileIcon(selectedFile.type)}
              <div>
                <p className="font-medium truncate max-w-[200px] sm:max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFile}
              className="text-gray-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="text-sm text-red-500 dark:text-red-400">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="file-description">
          Description {descriptionRequired && <span className="text-red-500">*</span>}
        </Label>
        <Textarea
          id="file-description"
          placeholder="Enter a description for this file"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={!selectedFile}
        />
      </div>
      
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedFile || isUploading || (descriptionRequired && !description.trim())}
          className="bg-teal-600 hover:bg-teal-700"
        >
          {isUploading ? (
            "Uploading..."
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {buttonText}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
