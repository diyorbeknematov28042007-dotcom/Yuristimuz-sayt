// ════════════════════════════════════════════════
// VERIFIKATSIYA RASM YUKLASH API (maxfiy bucket)
// /src/app/api/user/verification/upload/route.ts
// Client siqilgan rasmni yuboradi, server maxfiy bucket'ga saqlaydi
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

function sbAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)
}

const BUCKET = 'diplomas'

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Avtorizatsiya kerak' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const docType = formData.get('doc_type') as string

    if (!file) return NextResponse.json({ error: 'Fayl topilmadi' }, { status: 400 })

    // Hajm cheklovi (5MB — siqilgandan keyin)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Fayl hajmi 5MB dan oshmasligi kerak' }, { status: 400 })
    }

    // Fayl yo'li: userId/docType_timestamp.ext
    const ext = file.type === 'application/pdf' ? 'pdf' : 'jpg'
    const path = `${user.id}/${docType}_${Date.now()}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())
    const sb = sbAdmin()
    const { error } = await sb.storage.from(BUCKET).upload(path, buffer, {
      contentType: file.type,
      upsert: true,
    })

    if (error) return NextResponse.json({ error: 'Yuklashda xatolik: ' + error.message }, { status: 400 })

    // Faqat yo'lni qaytaramiz (URL emas — maxfiy)
    return NextResponse.json({ success: true, path })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
