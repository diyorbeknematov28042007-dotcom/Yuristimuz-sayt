// ════════════════════════════════════════════════
// ADMIN — Verifikatsiya sahifasi (server)
// /src/app/admin/verification/page.tsx
// ════════════════════════════════════════════════

import { getAdminFromCookie } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import VerificationReview from './VerificationReview'

export default async function AdminVerificationPage() {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  return <VerificationReview />
}
