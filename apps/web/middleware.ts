import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip middleware for auth routes
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Rate limiting will be implemented later using a production-grade service
  // (Edge Runtime doesn't support ioredis; use Upstash, Vercel KV, or similar for production)
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
