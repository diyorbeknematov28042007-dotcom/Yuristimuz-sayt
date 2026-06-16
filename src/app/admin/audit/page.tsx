// ════════════════════════════════════════════════
// ADMIN — Audit log sahifasi
// /src/app/admin/audit/page.tsx
// ════════════════════════════════════════════════

import { getAdminFromCookie } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import AuditLog from './AuditLog'

async function getData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [counts, list] = await Promise.all([
    supabase.rpc('admin_get_audit_counts'),
    supabase.rpc('admin_get_audit_log', {
      p_action_filter: null, p_admin_filter: null, p_target_type: null, p_limit: 100
    })
  ])
  return {
    counts: counts.data || { total: 0, today: 0, this_week: 0, by_action: [], by_admin: [] },
    logs: list.data || []
  }
}

export default async function AdminAuditPage() {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  const { counts, logs } = await getData()
  return <AuditLog initialCounts={counts} initialLogs={logs} />
}
