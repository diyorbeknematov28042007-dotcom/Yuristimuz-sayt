// ════════════════════════════════════════════════
// VERIFIKATSIYA API — hujjat yuborish, ko'rish (signed URL)
// /src/app/api/user/verification/route.ts
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

// Service role bilan (maxfiy bucket'ga kirish uchun)
// Agar SERVICE_ROLE_KEY bo'lmasa, anon key bilan ishlaydi (fallback)
function sbAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

const BUCKET = 'diplomas'  // maxfiy bucket

// ── GET: o'z hujjatlarini olish (signed URL bilan) ──
export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ documents: [] }, { status: 401 })

  const sb = sbAdmin()
  const { data, error } = await sb.rpc('get_my_verification_documents', { p_user_id: user.id })
  if (error) return NextResponse.json({ documents: [], error: error.message }, { status: 400 })

  // Har bir hujjat uchun signed URL yaratamiz (60 daqiqa)
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

// ── POST: yangi hujjat yuborish ──
export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Avtorizatsiya kerak' }, { status: 401 })

  try {
    const body = await req.json()
    const { doc_type, doc_number, holder_name, image_path, issued_by } = body

    if (!doc_type || !doc_number || !holder_name || !image_path) {
      return NextResponse.json({ error: 'Barcha majburiy maydonlarni to\'ldiring' }, { status: 400 })
    }

    const sb = sbAdmin()
    const { data, error } = await sb.rpc('submit_verification_document', {
      p_user_id: user.id,
      p_doc_type: doc_type,
      p_doc_number: doc_number,
      p_holder_name: holder_name,
      p_image_url: image_path,  // maxfiy bucket yo'li
      p_issued_by: issued_by || null,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ── DELETE: rad etilgan hujjatni o'chirish ──
export async function DELETE(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Avtorizatsiya kerak' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const docId = searchParams.get('id')
    if (!docId) return NextResponse.json({ error: 'ID kerak' }, { status: 400 })

    const sb = sbAdmin()
    const { data, error } = await sb.rpc('delete_verification_document', {
      p_user_id: user.id,
      p_doc_id: docId,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
