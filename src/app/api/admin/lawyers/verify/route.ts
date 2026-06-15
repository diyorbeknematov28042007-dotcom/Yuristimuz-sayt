// ════════════════════════════════════════════════
// ADMIN — Yuristni tasdiqlash API
// /src/app/api/admin/lawyers/verify/route.ts
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromCookie } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  // Admin auth tekshirish
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })
  }

  try {
    const { lawyerId } = await req.json()
    
    if (!lawyerId || typeof lawyerId !== 'string') {
      return NextResponse.json({ error: 'lawyerId majburiy' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.rpc('admin_verify_lawyer', {
      p_lawyer_id: lawyerId,
      p_admin_username: admin.username,
    })

    if (error) {
      console.error('Verify lawyer xato:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    console.error('Verify lawyer xato:', err)
    return NextResponse.json({ error: err.message || 'Server xatosi' }, { status: 500 })
  }
}
