// ════════════════════════════════════════════════
// ADMIN LOGIN API
// /src/app/api/admin/login/route.ts
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminPassword, createAdminToken, setAdminCookie } from '@/lib/admin-auth'

// Brute force himoya — IP bo'yicha
// In-memory store (production'da Redis ishlatilishi kerak)
const attempts = new Map<string, { count: number; lockedUntil: number }>()
const MAX_ATTEMPTS = 5
const LOCK_DURATION_MS = 15 * 60 * 1000 // 15 daqiqa

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

function isLocked(ip: string): { locked: boolean; remainingMin?: number } {
  const record = attempts.get(ip)
  if (!record) return { locked: false }
  
  if (record.lockedUntil > Date.now()) {
    const remainingMin = Math.ceil((record.lockedUntil - Date.now()) / 60000)
    return { locked: true, remainingMin }
  }
  
  // Lock muddati o'tgan, tozala
  if (record.lockedUntil > 0) {
    attempts.delete(ip)
  }
  return { locked: false }
}

function recordFailedAttempt(ip: string) {
  const record = attempts.get(ip) || { count: 0, lockedUntil: 0 }
  record.count++
  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCK_DURATION_MS
  }
  attempts.set(ip, record)
}

function resetAttempts(ip: string) {
  attempts.delete(ip)
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    
    // Rate limit tekshiruv
    const lockStatus = isLocked(ip)
    if (lockStatus.locked) {
      return NextResponse.json(
        { 
          error: `Juda ko'p urinish. ${lockStatus.remainingMin} daqiqadan keyin urinib ko'ring.`,
          locked: true,
          remainingMin: lockStatus.remainingMin
        },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Login va parol kiriting' },
        { status: 400 }
      )
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Noto\'g\'ri ma\'lumot formati' },
        { status: 400 }
      )
    }

    // Parolni tekshirish
    const isValid = await verifyAdminPassword(username, password)

    if (!isValid) {
      recordFailedAttempt(ip)
      const record = attempts.get(ip)
      const remainingAttempts = MAX_ATTEMPTS - (record?.count || 0)
      
      return NextResponse.json(
        { 
          error: 'Login yoki parol noto\'g\'ri',
          remainingAttempts: remainingAttempts > 0 ? remainingAttempts : 0
        },
        { status: 401 }
      )
    }

    // Muvaffaqiyatli login — urinishlarni tozalash
    resetAttempts(ip)

    // JWT yaratish va cookie qo'yish
    const token = await createAdminToken(username)
    setAdminCookie(token)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Admin login xato:', err)
    return NextResponse.json(
      { error: 'Server xatosi: ' + (err.message || 'noma\'lum') },
      { status: 500 }
    )
  }
}
