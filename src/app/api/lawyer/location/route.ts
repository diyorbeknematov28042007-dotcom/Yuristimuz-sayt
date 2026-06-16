// ════════════════════════════════════════════════
// Yurist joylashuvi API
// /src/app/api/lawyer/location/route.ts
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth'

// POST — joylashuvni saqlash
export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Tizimga kiring' }, { status: 401 })
  if (user.role !== 'lawyer') {
    return NextResponse.json({ error: 'Faqat yuristlar joylashuv qo\'sha oladi' }, { status: 403 })
  }

  try {
    const { latitude, longitude, officeAddress } = await req.json()

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json({ error: 'Koordinata noto\'g\'ri' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.rpc('update_my_location', {
      p_user_id: user.id,
      p_latitude: latitude,
      p_longitude: longitude,
      p_office_address: officeAddress || null,
    })

    if (error) {
      const msg = error.message?.includes('tashqarida')
        ? 'Koordinata O\'zbekiston hududidan tashqarida'
        : error.message
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server xatosi' }, { status: 500 })
  }
}

// DELETE — joylashuvni o'chirish
export async function DELETE() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Tizimga kiring' }, { status: 401 })

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { error } = await supabase.rpc('remove_my_location', { p_user_id: user.id })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server xatosi' }, { status: 500 })
  }
}
