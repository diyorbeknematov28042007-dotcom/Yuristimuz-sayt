// ════════════════════════════════════════════════
// ADMIN — Survey / Marketing tahlili (server)
// /src/app/admin/survey/page.tsx
// ════════════════════════════════════════════════

import { getAdminFromCookie } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import SurveyStats from './SurveyStats'

async function getStats() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await supabase.rpc('admin_survey_stats')
  return data || null
}

export default async function AdminSurveyPage() {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  const stats = await getStats()
  return <SurveyStats stats={stats} />
}
