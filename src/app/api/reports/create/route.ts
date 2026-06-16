// ════════════════════════════════════════════════
// SHIKOYAT YARATISH API
// /src/app/api/reports/create/route.ts
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth'

const VALID_TYPES = ['ad', 'review', 'user', 'message']
const VALID_REASONS = ['spam', 'fraud', 'harassment', 'misinformation', 'private_info', 'copyright', 'inappropriate', 'other']

export async function POST(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Shikoyat qilish uchun tizimga kiring' }, { status: 401 })
    }

    const body = await req.json()
    const { targetType, targetId, reason, details } = body

    // Validatsiya
    if (!targetType || !VALID_TYPES.includes(targetType)) {
      return NextResponse.json({ error: 'Noto\'g\'ri obyekt turi' }, { status: 400 })
    }
    if (!targetId) {
      return NextResponse.json({ error: 'Obyekt ID kerak' }, { status: 400 })
    }
    if (!reason || !VALID_REASONS.includes(reason)) {
      return NextResponse.json({ error: 'Sabab tanlang' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.rpc('create_report', {
      p_reporter_id: user.id,
      p_target_type: targetType,
      p_target_id: targetId,
      p_reason: reason,
      p_details: details || null,
    })

    if (error) {
      // Maxsus xatolarni o'zbekcha qaytarish
      const msg = error.message || ''
      if (msg.includes('allaqachon')) {
        return NextResponse.json({ error: 'Siz bu obyektga allaqachon shikoyat qilgansiz' }, { status: 409 })
      }
      if (msg.includes('Ozingizga') || msg.includes('Oz elon')) {
        return NextResponse.json({ error: 'O\'zingizning kontentingizga shikoyat qila olmaysiz' }, { status: 403 })
      }
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    return NextResponse.json({ success: true, ...data })
  } catch (err: any) {
    console.error('Report create xato:', err)
    return NextResponse.json({ error: err.message || 'Server xatosi' }, { status: 500 })
  }
}
