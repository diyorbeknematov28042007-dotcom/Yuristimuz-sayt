// ════════════════════════════════════════════════
// ETIKA TASDIQLASH API
// /src/app/api/ads/accept-terms/route.ts
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json()
    
    if (!userId) {
      return NextResponse.json({ error: 'userId kerak' }, { status: 400 })
    }
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { data, error } = await supabase.rpc('accept_ad_terms', {
      p_user_id: userId
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
    const userId = req.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json({ error: 'userId kerak' }, { status: 400 })
    }
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { data } = await supabase.rpc('check_ad_terms_accepted', {
      p_user_id: userId
    })
    
    return NextResponse.json({ accepted: !!data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
