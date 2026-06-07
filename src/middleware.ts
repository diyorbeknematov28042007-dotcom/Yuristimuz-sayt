import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-please-change-in-production'
)
const COOKIE_NAME = 'yuristim_session'

async function verifyToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  const isValid = token ? await verifyToken(token) : false
  const path = request.nextUrl.pathname

  // /dashboard ga kirish — login bo'lmasa /auth/login ga
  if (path.startsWith('/dashboard') && !isValid) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // /auth/login yoki /auth/signup ga — login bo'lsa /dashboard ga
  if (isValid && (path === '/auth/login' || path === '/auth/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
}
