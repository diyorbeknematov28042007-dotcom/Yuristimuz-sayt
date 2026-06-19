// ════════════════════════════════════════════════
// OMMAVIY YANGILIKLAR API (login shart emas)
// /src/app/api/news/route.ts
// ════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data, error } = await supabase.rpc('get_published_news', { p_limit: 50 })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ news: data || [] })
}
