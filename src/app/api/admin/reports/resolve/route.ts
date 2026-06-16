// ════════════════════════════════════════════════
// ADMIN — Shikoyatga qaror API
// /src/app/api/admin/reports/resolve/route.ts
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromCookie } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

const VALID_ACTIONS = ['no_action', 'object_hidden', 'object_deleted', 'user_warned', 'user_blocked', 'user_blocked_permanent']

export async function POST(req: NextRequest) {
  const admin = await getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })

  try {
    const { reportId, action, note, blockDays } = await req.json()

    if (!reportId) return NextResponse.json({ error: 'reportId kerak' }, { status: 400 })
    if (!action || !VALID_ACTIONS.includes(action)) {
      return NextResponse.json({ error: 'Noto\'g\'ri harakat' }, { status: 400 })
    }
    if (action !== 'no_action' && (!note || note.trim().length < 5)) {
      return NextResponse.json({ error: 'Izoh kamida 5 ta belgi' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase.rpc('admin_resolve_report', {
      p_report_id: reportId,
      p_action: action,
      p_note: note || null,
      p_admin_username: admin.username,
      p_block_days: blockDays || null,
    })

    if (error) {
      console.error('Resolve report xato:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, ...data })
  } catch (err: any) {
    console.error('Resolve report xato:', err)
    return NextResponse.json({ error: err.message || 'Server xatosi' }, { status: 500 })
  }
}
