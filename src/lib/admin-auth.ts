// ════════════════════════════════════════════════
// ADMIN AUTHENTICATION HELPERS
// /src/lib/admin-auth.ts
// ════════════════════════════════════════════════

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const ADMIN_COOKIE_NAME = 'admin_token'
const ADMIN_SESSION_DURATION = 2 * 60 * 60 // 2 soat (xavfsizlik uchun qisqa)

interface AdminPayload {
  username: string
  role: 'admin'
  loginAt: number
  [key: string]: any  // jose JWTPayload talab qiladi
}

// ─────────────────────────────────────────
// JWT secret'ni olish
// ─────────────────────────────────────────
function getAdminSecret(): Uint8Array {
  const secret = process.env.ADMIN_JWT_SECRET
  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET environment variable o\'rnatilmagan')
  }
  return new TextEncoder().encode(secret)
}

// ─────────────────────────────────────────
// Parolni tekshirish (bcrypt)
// ─────────────────────────────────────────
export async function verifyAdminPassword(
  username: string,
  password: string
): Promise<boolean> {
  const adminUsername = process.env.ADMIN_USERNAME
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

  if (!adminUsername || !adminPasswordHash) {
    console.error('Admin credentials env\'da yo\'q')
    return false
  }

  // Username constant-time comparison (timing attack himoyasi)
  if (username !== adminUsername) {
    // Bcrypt'ni baribir chaqirib timing'ni tekislash
    await bcrypt.compare('dummy', '$2a$10$dummyhashtopreventimingattack..........')
    return false
  }

  // Bcrypt compare
  try {
    return await bcrypt.compare(password, adminPasswordHash)
  } catch (err) {
    console.error('Bcrypt compare xato:', err)
    return false
  }
}

// ─────────────────────────────────────────
// Admin JWT yaratish
// ─────────────────────────────────────────
export async function createAdminToken(username: string): Promise<string> {
  const secret = getAdminSecret()
  const payload: AdminPayload = {
    username,
    role: 'admin',
    loginAt: Date.now(),
  }

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_DURATION}s`)
    .sign(secret)
}

// ─────────────────────────────────────────
// Admin JWT tekshirish
// ─────────────────────────────────────────
export async function verifyAdminToken(token: string): Promise<AdminPayload | null> {
  try {
    const secret = getAdminSecret()
    const { payload } = await jwtVerify(token, secret)
    
    // Type check
    if (
      typeof payload.username !== 'string' ||
      payload.role !== 'admin' ||
      typeof payload.loginAt !== 'number'
    ) {
      return null
    }

    return payload as unknown as AdminPayload
  } catch (err) {
    return null
  }
}

// ─────────────────────────────────────────
// Cookie operations
// ─────────────────────────────────────────
export function setAdminCookie(token: string) {
  cookies().set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: ADMIN_SESSION_DURATION,
    path: '/',
  })
}

export function clearAdminCookie() {
  cookies().delete(ADMIN_COOKIE_NAME)
}

export async function getAdminFromCookie(): Promise<AdminPayload | null> {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value
  if (!token) return null
  return await verifyAdminToken(token)
}

// ─────────────────────────────────────────
// Middleware uchun (cookie token'ni request'dan olish)
// ─────────────────────────────────────────
export async function verifyAdminRequest(token: string | undefined): Promise<AdminPayload | null> {
  if (!token) return null
  return await verifyAdminToken(token)
}

export { ADMIN_COOKIE_NAME }
