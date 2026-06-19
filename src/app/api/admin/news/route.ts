// ════════════════════════════════════════════════
// ADMIN YANGILIKLAR API — ro'yxat + yaratish
// /src/app/api/admin/news/route.ts
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromCookie } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Barcha yangiliklar (admin)
export async function GET() {
  const admin = await getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })

  const { data, error } = await sb().rpc('admin_get_all_news')
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ news: data || [] })
}

// Yangi yangilik yaratish
export async function POST(req: NextRequest) {
  const admin = await getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })

  try {
    const { title, excerpt, content, category, cover_color } = await req.json()
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Sarlavha va matn majburiy' }, { status: 400 })
    }
    const { data, error } = await sb().rpc('admin_create_news', {
      p_title: title.trim(),
      p_excerpt: (excerpt || '').trim(),
      p_content: content.trim(),
      p_category: category || 'Umumiy',
      p_cover_color: cover_color || '#4338ca',
      p_admin_username: admin.username,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ success: true, ...data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
