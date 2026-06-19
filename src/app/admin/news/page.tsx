// ════════════════════════════════════════════════
// ADMIN — Yangiliklar boshqaruvi (server)
// /src/app/admin/news/page.tsx
// ════════════════════════════════════════════════

import { getAdminFromCookie } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import NewsManager from './NewsManager'

async function getInitialNews() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase.rpc('admin_get_all_news')
  return data || []
}

export default async function AdminNewsPage() {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  const initialNews = await getInitialNews()
  return <NewsManager initialNews={initialNews} />
}
