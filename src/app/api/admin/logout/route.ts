// ════════════════════════════════════════════════
// ADMIN LOGOUT API
// /src/app/api/admin/logout/route.ts
// ════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { clearAdminCookie } from '@/lib/admin-auth'

export async function POST() {
  clearAdminCookie()
  return NextResponse.json({ success: true })
}
