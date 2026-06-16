// ════════════════════════════════════════════════
// ADMIN — Statistika dashboard
// /src/app/admin/analytics/page.tsx
// ════════════════════════════════════════════════

import { getAdminFromCookie } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import AnalyticsDashboard from './AnalyticsDashboard'

async function getData(days: number) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [overview, timeseries, categories, distribution] = await Promise.all([
    supabase.rpc('admin_analytics_overview', { p_days: days }),
    supabase.rpc('admin_analytics_timeseries', { p_days: days }),
    supabase.rpc('admin_analytics_categories'),
    supabase.rpc('admin_analytics_distribution'),
  ])
  return {
    overview: overview.data || null,
    timeseries: timeseries.data || [],
    categories: categories.data || [],
    distribution: distribution.data || null,
  }
}

export default async function AdminAnalyticsPage() {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  const data = await getData(30)
  return <AnalyticsDashboard initialData={data} />
}
