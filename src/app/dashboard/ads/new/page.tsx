// ════════════════════════════════════════════════
// /dashboard/ads/new — eski sahifa o'rniga redirect
// /src/app/dashboard/ads/new/page.tsx
// E'lon yaratish endi /dashboard/ads dagi modal orqali bo'ladi
// ════════════════════════════════════════════════

import { redirect } from 'next/navigation'

export default function NewAdRedirect() {
  redirect('/dashboard/ads')
}
