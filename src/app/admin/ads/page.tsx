// ════════════════════════════════════════════════
// ADMIN — E'LONLAR RO'YXATI
// /src/app/admin/ads/page.tsx
// ════════════════════════════════════════════════

import { getAdminFromCookie } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import AdsList from './AdsList'

async function getInitialData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [counts, list] = await Promise.all([
    supabase.rpc('admin_get_ad_counts'),
    supabase.rpc('admin_get_ads', { p_filter: 'pending', p_search: null, p_limit: 50 })
  ])

  return {
    counts: counts.data || { all: 0, pending: 0, approved: 0, rejected: 0, high_risk: 0 },
    ads: list.data || []
  }
}

export default async function AdminAdsPage() {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  const { counts, ads } = await getInitialData()

  return <AdsList initialCounts={counts} initialAds={ads} />
}
