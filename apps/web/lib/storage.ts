import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase configuration incomplete. File operations may fail.')
}

// Client for public operations (uses anon key)
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client for signed URLs and admin operations (uses service role key)
const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null
const BUCKET_NAME = 'credentials'
const SIGNED_URL_EXPIRY = 24 * 60 * 60 // 24 hours in seconds

export async function uploadDocument(userId: string, file: File): Promise<{ path: string; url: string }> {
  try {
    // Generate unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const ext = file.name.split('.').pop()
    const filename = `${timestamp}-${random}.${ext}`
    const path = `${userId}/${filename}`

    // Upload to Supabase using service role key (server-side operation)
    if (!supabaseAdmin) {
      throw new Error('Service role key not configured for uploads')
    }

    const { data, error } = await supabaseAdmin.storage.from(BUCKET_NAME).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (error) {
      console.error('Supabase upload error:', error)
      throw new Error(`Failed to upload document: ${error.message}`)
    }

    // Generate public URL for public bucket
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${data.path}`

    return {
      path: data.path,
      url: publicUrl,
    }
  } catch (error) {
    console.error('Document upload failed:', error)
    throw error
  }
}

export async function deleteDocument(bucketPath: string): Promise<void> {
  try {
    if (!supabaseAdmin) {
      throw new Error('Service role key not configured for deletion')
    }

    const { error } = await supabaseAdmin.storage.from(BUCKET_NAME).remove([bucketPath])

    if (error) {
      console.error('Supabase delete error:', error)
      throw new Error(`Failed to delete document: ${error.message}`)
    }
  } catch (error) {
    console.error('Document deletion failed:', error)
    throw error
  }
}

export async function getSignedDownloadUrl(bucketPath: string): Promise<string> {
  try {
    if (!supabaseAdmin) {
      throw new Error('Service role key not configured for signed URLs')
    }

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .createSignedUrl(bucketPath, SIGNED_URL_EXPIRY)

    if (error) {
      console.error('Supabase signed URL error:', error)
      throw new Error(`Failed to generate signed URL: ${error.message}`)
    }

    if (!data?.signedUrl) {
      throw new Error('Failed to generate signed URL')
    }

    return data.signedUrl
  } catch (error) {
    console.error('Failed to get signed URL:', error)
    throw error
  }
}
