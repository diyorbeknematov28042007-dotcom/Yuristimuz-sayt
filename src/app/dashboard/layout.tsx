import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import LogoutButton from '@/components/layout/LogoutButton'
import { Scale, Home, FileText, MessageCircle, Grid3x3, User, Settings, Bell, ChevronDown } from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  if (!user) redirect('/auth/login')

  const initials = user.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'

  const navLinks = [
    { href: '/dashboard', label: 'Asosiy', icon: <Home size={20} />, mobileIcon: <Home size={22} /> },
    { href: '/dashboard/ads', label: "E'lonlar", icon: <FileText size={20} />, mobileIcon: <FileText size={22} /> },
    { href: '/dashboard/chat', label: 'Suhbatlar', icon: <MessageCircle size={20} />, mobileIcon: <MessageCircle size={22} /> },
    { href: '/dashboard/services', label: 'Xizmatlar', icon: <Grid3x3 size={20} />, mobileIcon: <Grid3x3 size={22} /> },
    { href: '/dashboard/profile', label: 'Profil', icon: <User size={20} />, mobileIcon: <User size={22} /> },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>

      {/* ====== DESKTOP SIDEBAR ====== */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .desktop-main { margin-left: 0 !important; }
          .mobile-bottom-nav { display: flex !important; }
          .desktop-topbar { display: none !important; }
          .mobile-topbar { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-bottom-nav { display: none !important; }
          .mobile-topbar { display: none !important; }
        }
        .nav-link-item:hover { background: #f1f5f9 !important; color: #0f172a !important; }
        .nav-link-item:hover span { color: #0f172a !important; }
      `}</style>

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

        <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="nav-link-item"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, fontSize: 13.5, fontWeight: 500, color: '#64748b', textDecoration: 'none', marginBottom: 2, transition: 'all 150ms' }}>
              <span style={{ color: '#94a3b8', transition: 'color 150ms' }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
          <div style={{ height: 1, background: '#f1f5f9', margin: '10px 0' }} />
          <Link href="/dashboard/settings" className="nav-link-item"
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, fontSize: 13.5, fontWeight: 500, color: '#64748b', textDecoration: 'none', transition: 'all 150ms' }}>
            <span style={{ color: '#94a3b8' }}><Settings size={20} /></span>
            Sozlamalar
          </Link>
        </nav>

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
        <main style={{ flex: 1, padding: '24px 24px 90px' }}>
          {children}
        </main>
      </div>

      {/* ====== MOBILE BOTTOM NAV ====== */}
      <nav className="mobile-bottom-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderTop: '0.5px solid #e2e8f0', zIndex: 50, padding: '8px 0 12px', alignItems: 'center', justifyContent: 'space-around' }}>
        {navLinks.map(link => (
          <Link key={link.href} href={link.href}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '4px 12px', textDecoration: 'none', color: '#64748b', minWidth: 48 }}>
            {link.mobileIcon}
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.2px' }}>{link.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
