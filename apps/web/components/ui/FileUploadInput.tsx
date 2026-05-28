'use client'

import React, { useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faXmark } from '@fortawesome/free-solid-svg-icons'
import { validateUploadedFile } from '@/lib/documents'

interface FileUploadInputProps {
  onFile: (file: File | null) => void
  accept?: string
  maxSizeMB?: number
  disabled?: boolean
}

export function FileUploadInput({
  onFile,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 10,
  disabled = false,
}: FileUploadInputProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (selectedFile: File) => {
    // Validate file
    const validation = validateUploadedFile(selectedFile)

    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      setFile(null)
      onFile(null)
      return
    }

    setError(null)
    setFile(selectedFile)
    onFile(selectedFile)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    if (!disabled && e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleClear = () => {
    setFile(null)
    setError(null)
    onFile(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleClick = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  return (
    <div className="space-y-3">
      {/* Drag-drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`
          relative rounded-lg border-2 border-dashed transition-all cursor-pointer
          ${disabled ? 'bg-ink-100 cursor-not-allowed' : 'hover:border-trades-400'}
          ${
            isDragActive
              ? 'border-trades-500 bg-trades-50'
              : 'border-ink-300 bg-white'
          }
          ${error ? 'border-red-400 bg-red-50' : ''}
          p-8
        `}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleChange}
          accept={accept}
          disabled={disabled}
          className="hidden"
          aria-label="Upload file"
        />

        <div className="flex flex-col items-center gap-2">
          <FontAwesomeIcon icon={faUpload} className="h-8 w-8 text-trades-500" />
          <div className="text-center">
            <p className="font-medium text-ink-900">
              {file ? 'File selected' : 'Drag and drop your file here'}
            </p>
            <p className="text-sm text-ink-600">
              {file ? 'Click to change' : `or click to browse (max ${maxSizeMB}MB)`}
            </p>
          </div>
        </div>
      </div>

      {/* File info or error */}
      {file && !error && (
        <div className="rounded-lg border border-trades-200 bg-trades-50 p-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-trades-900">{file.name}</p>
            <p className="text-xs text-trades-700">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={handleClear}
            className="text-trades-600 hover:text-trades-700 p-1"
            aria-label="Remove file"
          >
            <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-3 flex items-start gap-2">
          <div className="text-red-700 text-sm pt-0.5">⚠️</div>
          <div>
            <p className="text-sm text-red-900 font-medium">Upload error</p>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
