import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@trades/db'
import { requireAuth } from '@/lib/auth'
import { validateUploadedFile } from '@/lib/documents'
import { uploadDocument, getSignedDownloadUrl } from '@/lib/storage'

export async function POST(req: NextRequest) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('documentType') as string

    // Validate required fields
    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 })
    }
    if (!documentType) {
      return NextResponse.json({ error: 'Document type is required' }, { status: 400 })
    }

    // Validate file
    const validation = validateUploadedFile(file)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    // Upload to Supabase Storage
    const { path: storagePath, url: fileUrl } = await uploadDocument(user.id, file)

    // Create database record with Supabase URL
    const document = await prisma.userDocument.create({
      data: {
        userId: user.id,
        documentType: documentType as any,
        fileName: file.name,
        fileUrl,
        fileSize: file.size,
        mimeType: file.type,
        status: 'PENDING',
        storagePath,
      },
    })

    return NextResponse.json(
      {
        id: document.id,
        documentType: document.documentType,
        fileName: document.fileName,
        status: document.status,
        fileSize: document.fileSize,
        createdAt: document.createdAt,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[API Error] POST /api/documents', error)
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const result = await requireAuth()
  if (result instanceof NextResponse) return result
  const user = result

  try {
    const status = req.nextUrl.searchParams.get('status')

    const where = {
      userId: user.id,
      ...(status ? { status: status as any } : {}),
    }

    const documents = await prisma.userDocument.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    // Generate fresh signed URLs for each document
    const items = await Promise.all(
      documents.map(async (doc) => {
        let signedUrl = doc.fileUrl
        try {
          if (doc.storagePath) {
            signedUrl = await getSignedDownloadUrl(doc.storagePath)
          }
        } catch (error) {
          console.error('Failed to generate signed URL for document:', doc.id, error)
          // Fall back to stored URL if signing fails
        }
        return {
          ...doc,
          fileUrl: signedUrl,
        }
      })
    )

    return NextResponse.json({ items })
  } catch (error) {
    console.error('[API Error] GET /api/documents', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}
