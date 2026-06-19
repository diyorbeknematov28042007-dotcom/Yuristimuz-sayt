// ════════════════════════════════════════════════
// SURVEY API — holat olish, saqlash, skip
// /src/app/api/user/survey/route.ts
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Survey holati — modal chiqishi kerakmi?
export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ should_show: false }, { status: 401 })

  const { data, error } = await sb().rpc('get_survey_status', { p_user_id: user.id })
  if (error) return NextResponse.json({ should_show: false }, { status: 400 })
  return NextResponse.json(data || { should_show: false })
}

// Survey saqlash yoki skip
export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Avtorizatsiya kerak' }, { status: 401 })

  try {
    const body = await req.json()

    // Skip
    if (body.action === 'skip') {
      const { data } = await sb().rpc('skip_survey', { p_user_id: user.id })
      return NextResponse.json(data || { success: true })
    }

    // Saqlash
    const { data, error } = await sb().rpc('save_survey', {
      p_user_id: user.id,
      p_motivation: body.motivation || null,
      p_profession: body.profession || null,
      p_referral: body.referral || null,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
