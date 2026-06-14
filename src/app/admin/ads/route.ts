// /src/app/api/admin/ads/reject/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromCookie } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const admin = await getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })

  try {
    const { adId, reason } = await req.json()
    if (!adId) return NextResponse.json({ error: 'adId kerak' }, { status: 400 })
    if (!reason || reason.trim().length < 10) {
      return NextResponse.json({ error: 'Sabab kamida 10 ta belgi' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { error } = await supabase.rpc('admin_reject_ad', {
      p_ad_id: adId,
      p_reason: reason.trim(),
      p_admin_username: admin.username,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
