import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-please-change-in-production'
)
const COOKIE_NAME = 'yuristim_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 kun

export interface SessionUser {
  id: string
  username: string
  full_name: string
  role: 'client' | 'lawyer' | 'admin'
  avatar_url?: string | null
}

export async function createSession(user: SessionUser): Promise<string> {
  const token = await new SignJWT({
    sub: user.id,
    username: user.username,
    full_name: user.full_name,
    role: user.role,
    avatar_url: user.avatar_url || null,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET)
  return token
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
      id: payload.sub as string,
      username: payload.username as string,
      full_name: payload.full_name as string,
      role: payload.role as 'client' | 'lawyer' | 'admin',
      avatar_url: (payload.avatar_url as string) || null,
    }
  } catch {
    return null
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  })
}

export async function clearSessionCookie() {
  const cookieStore = cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return await verifySession(token)
}

export const SESSION_COOKIE = COOKIE_NAME
