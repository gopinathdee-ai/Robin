import { NextResponse } from 'next/server'
import { prisma } from '@trades/db'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const credential = await prisma.credential.findUnique({
      where: { id },
      include: { holder: true, trade: true, topic: true, issuer: true },
    })

    if (!credential) {
      return NextResponse.json({ error: 'Credential not found' }, { status: 404 })
    }

    if (!credential.isPublic) {
      return NextResponse.json({ error: 'This credential is not public' }, { status: 403 })
    }

    return NextResponse.json(credential)
  } catch (error) {
    console.error('[API Error] GET /api/credentials/:id', error)
    return NextResponse.json({ error: 'Failed to fetch credential' }, { status: 500 })
  }
}
