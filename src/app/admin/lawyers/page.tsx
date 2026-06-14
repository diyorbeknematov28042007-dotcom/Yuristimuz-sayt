// ════════════════════════════════════════════════
// ADMIN — Yuristlar ro'yxati (Server Component)
// /src/app/admin/lawyers/page.tsx
// ════════════════════════════════════════════════

import { getAdminFromCookie } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import LawyersList from './LawyersList'

async function getInitialData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [countsRes, listRes] = await Promise.all([
    supabase.rpc('admin_get_lawyer_counts'),
    supabase.rpc('admin_get_lawyers', { p_filter: 'all', p_search: null, p_limit: 100 })
  ])

  return {
    counts: countsRes.data || { all: 0, verified: 0, pending: 0, rejected: 0, incomplete: 0 },
    lawyers: listRes.data || []
  }
}

export default async function AdminLawyersPage() {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  const { counts, lawyers } = await getInitialData()

  return <LawyersList initialCounts={counts} initialLawyers={lawyers} />
}
