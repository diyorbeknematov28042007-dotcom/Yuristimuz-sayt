// ════════════════════════════════════════════════
// E'LON O'CHIRISH API
// /src/app/api/ads/delete/route.ts
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Tizimga kiring' }, { status: 401 })
    }

    const body = await req.json()
    const adId = body.adId || body.ad_id

    if (!adId) {
      return NextResponse.json({ error: 'adId kerak' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // delete_my_ad faqat egasiga ishlaydi
    const { error } = await supabase.rpc('delete_my_ad', {
      p_user_id: user.id,
      p_ad_id: adId,
    })

    if (error) {
      // not_owner xato — boshqa birovning e'lonini o'chirishga urinish
      if (error.message?.includes('not_owner')) {
        return NextResponse.json(
          { error: 'Bu e\'lonni o\'chirishga ruxsatingiz yo\'q' },
          { status: 403 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Delete ad xato:', err)
    return NextResponse.json({ error: err.message || 'Server xatosi' }, { status: 500 })
  }
}
