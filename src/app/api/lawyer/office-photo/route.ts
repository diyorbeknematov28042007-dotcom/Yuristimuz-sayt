// ════════════════════════════════════════════════
// Ofis rasmi yuklash API (max 3 rasm)
// /src/app/api/lawyer/office-photo/route.ts
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/auth'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

const BUCKET = 'avatars'  // public bucket (ofis rasmlari ham ommaviy ko'rinadi)

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Tizimga kiring' }, { status: 401 })
  if (user.role !== 'lawyer') return NextResponse.json({ error: 'Faqat yuristlar uchun' }, { status: 403 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) return NextResponse.json({ error: 'Fayl topilmadi' }, { status: 400 })

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Rasm hajmi 5MB dan oshmasligi kerak' }, { status: 400 })
    }

    const ext = 'jpg'
    const path = `offices/${user.id}/${Date.now()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error } = await sb().storage.from(BUCKET).upload(path, buffer, {
      contentType: file.type || 'image/jpeg',
      upsert: true,
    })
    if (error) return NextResponse.json({ error: 'Yuklashda xatolik: ' + error.message }, { status: 400 })

    const { data: { publicUrl } } = sb().storage.from(BUCKET).getPublicUrl(path)
    return NextResponse.json({ success: true, url: publicUrl })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
