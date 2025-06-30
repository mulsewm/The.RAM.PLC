"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Upload, X } from "lucide-react"

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onChange: (files: FileList | null) => void
  value?: FileList | null
  accept?: string
  maxSize?: number
  helperText?: string
  className?: string
}

export function FileUpload({
  onChange,
  value,
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB default
  helperText,
  className,
  ...props
}: FileUploadProps) {
  const [file, setFile] = React.useState<File | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length) {
        const selectedFile = acceptedFiles[0]
        if (selectedFile.size > maxSize) {
          setError(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
          return
        }
        setFile(selectedFile)
        // Create a new FileList-like object
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(selectedFile)
        onChange(dataTransfer.files)
        setError(null)
      }
    },
    [maxSize, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    maxSize,
    multiple: false,
  })

  const removeFile = () => {
    setFile(null)
    onChange(null)
    setError(null)
  }

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 transition-colors",
          isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300",
          error && "border-red-500",
          className
        )}
      >
        <input {...getInputProps()} {...props} />
        {file ? (
          <div className="flex items-center justify-between">
            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
            <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              {isDragActive ? "Drop the file here" : "Drag & drop or click to upload"}
            </p>
            {helperText && <p className="text-xs text-gray-400 mt-1">{helperText}</p>}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
