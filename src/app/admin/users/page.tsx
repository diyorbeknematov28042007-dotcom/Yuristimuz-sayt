// ════════════════════════════════════════════════
// ADMIN — Foydalanuvchilar ro'yxati
// /src/app/admin/users/page.tsx
// ════════════════════════════════════════════════

import { getAdminFromCookie } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import UsersList from './UsersList'

async function getInitialData() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [counts, list] = await Promise.all([
    supabase.rpc('admin_get_user_counts'),
    supabase.rpc('admin_get_users', { p_filter: 'all', p_search: null, p_limit: 100 })
  ])
  return {
    counts: counts.data || { all: 0, lawyer: 0, client: 0, blocked: 0, verified: 0 },
    users: list.data || []
  }
}

export default async function AdminUsersPage() {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  const { counts, users } = await getInitialData()
  return <UsersList initialCounts={counts} initialUsers={users} />
}
