import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import LogoutButton from '@/components/layout/LogoutButton'
import { SidebarNav, BottomNav } from '@/components/layout/NavLinks'
import { Scale, Bell } from 'lucide-react'
import { NotificationProvider } from '@/contexts/NotificationContext'
import SurveyModal from '@/components/SurveyModal'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  if (!user) redirect('/auth/login')

  const initials = user.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'

  return (
    <NotificationProvider userId={user.id}>
    <SurveyModal />
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .desktop-main { margin-left: 0 !important; }
          .mobile-bottom-nav-wrapper { display: block !important; }
          .desktop-topbar { display: none !important; }
          .mobile-topbar { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-bottom-nav-wrapper { display: none !important; }
          .mobile-topbar { display: none !important; }
        }
      `}</style>

      {/* ====== DESKTOP SIDEBAR ====== */}
      <aside className="desktop-sidebar" style={{ width: 240, position: 'fixed', top: 0, left: 0, height: '100%', background: '#fff', borderRight: '0.5px solid #e2e8f0', zIndex: 40, display: 'flex', flexDirection: 'column' }}>
        {/* Logo */}
        <div style={{ height: 64, padding: '0 20px', borderBottom: '0.5px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: '#0f172a', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={15} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', letterSpacing: '-0.3px' }}>Yuristim</span>
            <span style={{ fontSize: 9, fontWeight: 700, background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: 4 }}>BETA</span>
          </Link>
        </div>

        {/* Sidebar nav — client component */}
        <SidebarNav />

        {/* User */}
        <div style={{ padding: 12, borderTop: '0.5px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10 }}>
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#0f172a,#4338ca)', color: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.full_name}</p>
              <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>@{user.username} · {user.role === 'lawyer' ? 'Yurist' : 'Mijoz'}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* ====== MAIN CONTENT ====== */}
      <div className="desktop-main" style={{ marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Desktop topbar */}
        <header className="desktop-topbar" style={{ height: 64, background: '#fff', borderBottom: '0.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 24px', position: 'sticky', top: 0, zIndex: 30 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: 8, borderRadius: 9 }}>
              <Bell size={17} />
            </button>
            <Link href="/dashboard/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, textDecoration: 'none' }}>
              <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#0f172a,#4338ca)', color: '#fff', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11 }}>
                {initials}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{user.full_name?.split(' ')[0]}</span>
            </Link>
          </div>
        </header>

        {/* Mobile topbar */}
        <header className="mobile-topbar" style={{ height: 56, background: '#fff', borderBottom: '0.5px solid #e2e8f0', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', position: 'sticky', top: 0, zIndex: 30 }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, background: '#0f172a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={13} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>Yuristim</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 4 }}>
              <Bell size={18} />
            </button>
            <Link href="/dashboard/profile">
              <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#0f172a,#4338ca)', color: '#fff', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11 }}>
                {initials}
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '24px 16px 100px' }}>
          {children}
        </main>
      </div>

      {/* ====== MOBILE BOTTOM NAV ====== */}
      <div className="mobile-bottom-nav-wrapper">
        <BottomNav />
      </div>
    </div>
    </NotificationProvider>
  )
}
