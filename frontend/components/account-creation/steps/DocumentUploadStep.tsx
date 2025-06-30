import { useFormContext } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FileUpload } from "@/components/ui/file-upload"
import { File, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const DocumentUploadStep = () => {
  const { control, watch, setValue } = useFormContext()
  
  // Watch all file fields to show previews
  const files = {
    passport: watch("passport"),
    license: watch("license"),
    degree: watch("degree"),
    experience: watch("experience"),
    medicalReport: watch("medicalReport"),
    photo: watch("photo"),
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Document Upload</h2>
        <p className="mt-1 text-sm text-gray-500">Upload the required documents for your application</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={control}
            name="passport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passport Copy</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {field.value ? (
                      <div className="flex items-center justify-between rounded-md border p-3">
                        <div className="flex items-center space-x-2">
                          <File className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium">{field.value.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => field.onChange(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <FileUpload
                        onFileSelect={(file) => field.onChange(file)}
                        isUploading={false}
                        allowedFileTypes={['application/pdf', 'image/jpeg', 'image/png']}
                        maxFileSizeMB={5}
                        descriptionRequired={false}
                        buttonText="Upload"
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
                <p className="mt-1 text-xs text-gray-500">Upload a clear copy of your passport (PDF, JPG, PNG)</p>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="license"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional License</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {field.value ? (
                      <div className="flex items-center justify-between rounded-md border p-3">
                        <div className="flex items-center space-x-2">
                          <File className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium">{field.value.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => field.onChange(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <FileUpload
                        onFileSelect={(file) => field.onChange(file)}
                        isUploading={false}
                        allowedFileTypes={['application/pdf', 'image/jpeg', 'image/png']}
                        maxFileSizeMB={5}
                        descriptionRequired={false}
                        buttonText="Upload"
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
                <p className="mt-1 text-xs text-gray-500">Upload your professional license (PDF, JPG, PNG)</p>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="degree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Degree Certificate</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {field.value ? (
                      <div className="flex items-center justify-between rounded-md border p-3">
                        <div className="flex items-center space-x-2">
                          <File className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium">{field.value.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => field.onChange(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <FileUpload
                        onFileSelect={(file) => field.onChange(file)}
                        isUploading={false}
                        allowedFileTypes={['application/pdf', 'image/jpeg', 'image/png']}
                        maxFileSizeMB={5}
                        descriptionRequired={false}
                        buttonText="Upload"
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
                <p className="mt-1 text-xs text-gray-500">Upload your degree certificate (PDF, JPG, PNG)</p>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Certificate</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {field.value ? (
                      <div className="flex items-center justify-between rounded-md border p-3">
                        <div className="flex items-center space-x-2">
                          <File className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium">{field.value.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => field.onChange(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <FileUpload
                        onFileSelect={(file) => field.onChange(file)}
                        isUploading={false}
                        allowedFileTypes={['application/pdf', 'image/jpeg', 'image/png']}
                        maxFileSizeMB={5}
                        descriptionRequired={false}
                        buttonText="Upload"
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
                <p className="mt-1 text-xs text-gray-500">Upload your experience certificate (PDF, JPG, PNG)</p>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="medicalReport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medical Report</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {field.value ? (
                      <div className="flex items-center justify-between rounded-md border p-3">
                        <div className="flex items-center space-x-2">
                          <File className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium">{field.value.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => field.onChange(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <FileUpload
                        onFileSelect={(file) => field.onChange(file)}
                        isUploading={false}
                        allowedFileTypes={['application/pdf', 'image/jpeg', 'image/png']}
                        maxFileSizeMB={5}
                        descriptionRequired={false}
                        buttonText="Upload"
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
                <p className="mt-1 text-xs text-gray-500">Upload your medical report (PDF, JPG, PNG)</p>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="photo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Passport Photo</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {field.value ? (
                      <div className="flex items-center justify-between rounded-md border p-3">
                        <div className="flex items-center space-x-2">
                          <File className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium">{field.value.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => field.onChange(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <FileUpload
                        onFileSelect={(file) => field.onChange(file)}
                        isUploading={false}
                        allowedFileTypes={['image/jpeg', 'image/png']}
                        maxFileSizeMB={2}
                        descriptionRequired={false}
                        buttonText="Upload"
                      />
                    )}
                  </div>
                </FormControl>
                <FormMessage />
                <p className="mt-1 text-xs text-gray-500">Upload a passport-sized photo (JPG, PNG, max 2MB)</p>
              </FormItem>
            )}
          />
        </div>

        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Document Requirements</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>All documents must be clear and legible</li>
                  <li>Accepted formats: PDF, JPG, PNG</li>
                  <li>Maximum file size: 5MB (2MB for photos)</li>
                  <li>Ensure all text is visible in the scanned copies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentUploadStep
