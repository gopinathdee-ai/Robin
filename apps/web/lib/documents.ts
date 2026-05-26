const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export interface FileValidation {
  valid: boolean
  error?: string
}

export function validateUploadedFile(file: File): FileValidation {
  // Check file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not supported. Please upload a PDF or image (JPEG/PNG).',
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit. Please choose a smaller file.',
    }
  }

  // Check file size is not 0
  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty. Please choose a file with content.',
    }
  }

  return { valid: true }
}

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  RED_SEAL: 'Red Seal Certificate',
  SAFETY_WHMIS: 'Safety Ticket - WHMIS',
  SAFETY_FALL_PROTECTION: 'Safety Ticket - Fall Protection',
  SAFETY_FIRST_AID: 'Safety Ticket - First Aid/CPR',
  OTHER: 'Other Trade Credential',
}

export const DOCUMENT_TYPES = Object.entries(DOCUMENT_TYPE_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
)
