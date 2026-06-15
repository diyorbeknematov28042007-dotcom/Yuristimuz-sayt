// ════════════════════════════════════════════════
// ETIKA TASDIQLASH API - TUZATILGAN
// /src/app/api/ads/accept-terms/route.ts
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    // Cookie'dan user olish
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Tizimga kiring' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.rpc('accept_ad_terms', {
      p_user_id: user.id,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, accepted: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server xatosi' }, { status: 500 })
  }
}

// Status tekshirish uchun GET
export async function GET(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ accepted: false, error: 'Tizimga kiring' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data } = await supabase.rpc('check_ad_terms_accepted', {
      p_user_id: user.id,
    })

    return NextResponse.json({ accepted: !!data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
