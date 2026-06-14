import { NextResponse, type NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-please-change-in-production'
)
const COOKIE_NAME = 'yuristim_session'

const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'default-admin-secret-please-change'
)
const ADMIN_COOKIE_NAME = 'admin_token'

// ─────────────────────────────────────────
// Oddiy foydalanuvchi token tekshiruvi
// ─────────────────────────────────────────
async function verifyUserToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

// ─────────────────────────────────────────
// Admin token tekshiruvi
// ─────────────────────────────────────────
async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET)
    return payload.role === 'admin'
  } catch {
    return false
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // ═══════════════════════════════════════
  // ADMIN ROUTES
  // ═══════════════════════════════════════
  if (path.startsWith('/admin')) {
    const adminToken = request.cookies.get(ADMIN_COOKIE_NAME)?.value
    const isAdmin = adminToken ? await verifyAdminToken(adminToken) : false

    // /admin/login - login bo'lmasa kirish mumkin
    if (path === '/admin/login') {
      if (isAdmin) {
        // Allaqachon admin — admin panelga
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.next()
    }

    // Boshqa /admin/* sahifalari — login bo'lmasa /admin/login ga
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return NextResponse.next()
  }

  // ═══════════════════════════════════════
  // ODDIY FOYDALANUVCHI ROUTES
  // ═══════════════════════════════════════
  const token = request.cookies.get(COOKIE_NAME)?.value
  const isValid = token ? await verifyUserToken(token) : false

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
  matcher: ['/dashboard/:path*', '/auth/:path*', '/admin/:path*'],
}
