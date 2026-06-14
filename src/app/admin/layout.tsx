// ════════════════════════════════════════════════
// ADMIN LAYOUT (sidebar + content)
// /src/app/admin/layout.tsx
// ════════════════════════════════════════════════

import { ReactNode } from 'react'
import { getAdminFromCookie } from '@/lib/admin-auth'
import AdminSidebar from './AdminSidebar'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await getAdminFromCookie()

  // Login sahifasi uchun sidebar yo'q — to'g'ridan-to'g'ri children
  // (login sahifasida o'zining background'i bor)
  if (!admin) {
    return <>{children}</>
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <AdminSidebar admin={admin} />
      
      {/* Main content */}
      <main className="admin-main" style={{
        marginLeft: 0,
        padding: '20px',
        minHeight: '100vh',
      }}>
        {children}
      </main>

      <style>{`
        @media (min-width: 768px) {
          .admin-main {
            margin-left: 240px !important;
            padding: 32px !important;
          }
        }
      `}</style>
    </div>
  )
}
