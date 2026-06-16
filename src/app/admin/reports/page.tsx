// ════════════════════════════════════════════════
// ADMIN — Shikoyatlar ro'yxati
// /src/app/admin/reports/page.tsx
// ════════════════════════════════════════════════

import { getAdminFromCookie } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import ReportsList from './ReportsList'

async function getInitialData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [counts, list] = await Promise.all([
    supabase.rpc('admin_get_report_counts'),
    supabase.rpc('admin_get_reports', { p_filter: 'pending', p_target_type: null, p_limit: 50 })
  ])
  return {
    counts: counts.data || { all: 0, pending: 0, reviewing: 0, resolved: 0, rejected: 0 },
    reports: list.data || []
  }
}

export default async function AdminReportsPage() {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  const { counts, reports } = await getInitialData()
  return <ReportsList initialCounts={counts} initialReports={reports} />
}
