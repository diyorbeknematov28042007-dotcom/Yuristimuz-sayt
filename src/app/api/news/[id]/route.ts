// ════════════════════════════════════════════════
// OMMAVIY: BITTA YANGILIK DETALI
// /src/app/api/news/[id]/route.ts
// ════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data, error } = await supabase.rpc('get_news_detail', { p_news_id: params.id })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  if (!data) return NextResponse.json({ error: 'Yangilik topilmadi' }, { status: 404 })
  return NextResponse.json({ news: data })
}
