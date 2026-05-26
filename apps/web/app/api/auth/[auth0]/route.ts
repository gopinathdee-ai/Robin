import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Auth0 route handler - placeholder for dev mode
  // In production, this would be handled by Auth0 middleware
  return NextResponse.json({ error: 'Auth not configured' }, { status: 501 })
}
