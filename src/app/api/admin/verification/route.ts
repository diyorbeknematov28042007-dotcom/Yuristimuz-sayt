// ════════════════════════════════════════════════
// ADMIN VERIFIKATSIYA API
// /src/app/api/admin/verification/route.ts
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromCookie } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

function sbAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

const BUCKET = 'diplomas'

// ── GET: hujjatlarni ko'rish (signed URL bilan) ──
export async function GET(req: NextRequest) {
  const admin = await getAdminFromCookie()
  if (!admin) return NextResponse.json({ documents: [] }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || null

  const sb = sbAdmin()
  const { data, error } = await sb.rpc('admin_get_verification_documents', { p_status: status })
  if (error) return NextResponse.json({ documents: [], error: error.message }, { status: 400 })

  // Signed URL (admin uchun, 1 soat)
  const docs = await Promise.all(
    (data || []).map(async (doc: any) => {
      let signedUrl = null
      if (doc.image_url) {
        const { data: signed } = await sb.storage.from(BUCKET).createSignedUrl(doc.image_url, 3600)
        signedUrl = signed?.signedUrl || null
      }
      return { ...doc, signed_image_url: signedUrl }
    })
  )

  return NextResponse.json({ documents: docs })
}

// ── POST: tasdiqlash yoki rad etish ──
export async function POST(req: NextRequest) {
  const admin = await getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Admin avtorizatsiyasi kerak' }, { status: 401 })

  try {
    const body = await req.json()
    const { doc_id, action, reason } = body
    const sb = sbAdmin()

    if (action === 'approve') {
      const { data, error } = await sb.rpc('admin_approve_verification', {
        p_doc_id: doc_id,
        p_admin_username: admin.username,
      })
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json(data)
    }

    if (action === 'reject') {
      if (!reason?.trim()) return NextResponse.json({ error: 'Rad etish sababini kiriting' }, { status: 400 })
      const { data, error } = await sb.rpc('admin_reject_verification', {
        p_doc_id: doc_id,
        p_admin_username: admin.username,
        p_reason: reason.trim(),
      })
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'Noto\'g\'ri amal' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
