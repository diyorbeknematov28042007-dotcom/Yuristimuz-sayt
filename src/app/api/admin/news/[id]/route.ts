// ════════════════════════════════════════════════
// ADMIN YANGILIK — tahrirlash + o'chirish
// /src/app/api/admin/news/[id]/route.ts
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

// Tahrirlash
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })

  try {
    const { title, excerpt, content, category, cover_color, is_published } = await req.json()
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Sarlavha va matn majburiy' }, { status: 400 })
    }
    const { data, error } = await sb().rpc('admin_update_news', {
      p_news_id: params.id,
      p_title: title.trim(),
      p_excerpt: (excerpt || '').trim(),
      p_content: content.trim(),
      p_category: category || 'Umumiy',
      p_cover_color: cover_color || '#4338ca',
      p_is_published: is_published !== false,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// O'chirish
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getAdminFromCookie()
  if (!admin) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })

  const { data, error } = await sb().rpc('admin_delete_news', { p_news_id: params.id })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
