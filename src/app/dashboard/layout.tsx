import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import LogoutButton from '@/components/layout/LogoutButton'
import { SidebarNav, BottomNav } from '@/components/layout/NavLinks'
import { Scale } from 'lucide-react'
import { NotificationProvider } from '@/contexts/NotificationContext'
import SurveyModal from '@/components/SurveyModal'
import NotificationBell from '@/components/NotificationBell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  if (!user) redirect('/auth/login')

  const initials = user.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'

  // Avatar: rasm bo'lsa rasm, bo'lmasa initials (har joyda ishlatiladi)
  const Avatar = ({ size }: { size: number }) => (
    <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.29), overflow: 'hidden', flexShrink: 0, background: user.avatar_url ? '#f1f5f9' : 'linear-gradient(135deg,#0f172a,#4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {user.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.avatar_url} alt={user.full_name || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={{ color: '#fff', fontWeight: 800, fontSize: Math.round(size * 0.35) }}>{initials}</span>
      )}
    </div>
  )

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
            <Avatar size={34} />
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
            <NotificationBell userId={user.id} size={17} />
            <Link href="/dashboard/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, textDecoration: 'none' }}>
              <Avatar size={30} />
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
            <NotificationBell userId={user.id} size={18} />
            <Link href="/dashboard/profile">
              <Avatar size={30} />
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
