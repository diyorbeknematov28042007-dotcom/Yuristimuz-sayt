// ════════════════════════════════════════════════
// PROFIL KO'RINISHI (visibility) API
// /src/app/api/user/visibility/route.ts
// Yurist har bir maydonni public/private qilishi uchun
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// ── GET: o'z visibility sozlamalarini olish ──
export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Tizimga kiring' }, { status: 401 })
  if (user.role !== 'lawyer') return NextResponse.json({ visibility: null })

  const { data, error } = await sb().rpc('get_my_visibility', { p_user_id: user.id })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ visibility: data })
}

// ── POST: visibility ni yangilash ──
export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Tizimga kiring' }, { status: 401 })
  if (user.role !== 'lawyer') return NextResponse.json({ error: 'Faqat yuristlar uchun' }, { status: 403 })

  try {
    const body = await req.json()
    const { visibility } = body
    if (!visibility || typeof visibility !== 'object') {
      return NextResponse.json({ error: 'Noto\'g\'ri ma\'lumot' }, { status: 400 })
    }

    const { data, error } = await sb().rpc('update_my_visibility', {
      p_user_id: user.id,
      p_visibility: visibility,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
