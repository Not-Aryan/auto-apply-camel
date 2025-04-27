import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Upload, File, X, CheckCircle2, AlertCircle } from 'lucide-react'

type ResumeUploadProps = {
  onNext: (resumeUrl: string) => void
  initialData?: { resumeUrl: string }
  handleBack: () => void
  currentStep: number
}

export function ResumeUpload({ onNext, initialData, handleBack, currentStep }: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    try {
      setIsUploading(true)
      setUploadError(null)
      setUploadSuccess(false)
      setFileName(file.name)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      const data = await response.json()
      setUploadSuccess(true)
      setTimeout(() => {
        onNext(data.url)
      }, 1000) // Show success state briefly before proceeding
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError(`Failed to upload resume: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setFileName(null)
    } finally {
      setIsUploading(false)
    }
  }, [onNext])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    multiple: false,
    disabled: isUploading
  })

  return (
    <Card className="w-full max-w-2xl mx-auto bg-background">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-medium">Upload Your Resume</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          {...getRootProps()} 
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200 ease-in-out
            ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-500" />
            </div>
            
            {!fileName && (
              <>
                <div className="text-lg font-medium text-gray-700">
                  {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
                </div>
                <div className="text-sm text-gray-500">
                  or click to browse files
                </div>
                <div className="text-xs text-gray-400">
                  Supported formats: PDF, DOC, DOCX
                </div>
              </>
            )}

            {fileName && !uploadError && (
              <div className="flex items-center justify-center space-x-2 text-sm">
                <File className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700">{fileName}</span>
                {!uploadSuccess && !isUploading && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setFileName(null)
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            )}

            {isUploading && (
              <div className="text-sm text-blue-500">
                Uploading...
              </div>
            )}

            {uploadError && (
              <div className="flex items-center justify-center space-x-2 text-sm text-red-500">
                <AlertCircle className="w-4 h-4" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="flex items-center justify-center space-x-2 text-sm text-green-500">
                <CheckCircle2 className="w-4 h-4" />
                <span>Upload successful!</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Your resume helps us tailor job recommendations and automate applications for you.
        </div>
      </CardContent>
      
      <div className="flex justify-start gap-4 p-6 pt-0">
        {currentStep > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="w-1/2"
          >
            Back
          </Button>
        )}
      </div>
    </Card>
  )
}
