import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import LogoutButton from '@/components/layout/LogoutButton'
import {
  Scale, Home, FileText, MessageCircle, User, Settings, Bell, ChevronDown
} from 'lucide-react'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  if (!user) redirect('/auth/login')

  const isLawyer = user.role === 'lawyer'

  const navLinks = [
    { href: '/dashboard', label: 'Bosh sahifa', icon: <Home size={17} /> },
    { href: '/dashboard/ads', label: 'Elonlar', icon: <FileText size={17} /> },
    { href: '/dashboard/lawyers', label: 'Yuristlar', icon: <Scale size={17} /> },
    { href: '/dashboard/chat', label: 'Chat', icon: <MessageCircle size={17} /> },
    { href: '/dashboard/profile', label: 'Profil', icon: <User size={17} /> },
    { href: '/dashboard/settings', label: 'Sozlamalar', icon: <Settings size={17} /> },
  ]

  const initials = user.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U'

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, position: 'fixed', top: 0, left: 0, height: '100%',
        background: '#fff', borderRight: '0.5px solid #e2e8f0', zIndex: 40,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Logo */}
        <div style={{ height: 64, padding: '0 20px', borderBottom: '0.5px solid #e2e8f0', display: 'flex', alignItems: 'center' }}>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: '#0f172a', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={15} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#0f172a', letterSpacing: '-0.3px' }}>Yuristim</span>
            <span style={{ fontSize: 9, fontWeight: 700, background: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: 4, letterSpacing: '0.5px' }}>BETA</span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}
              style={{
                display: 'flex', alignItems: 'center', gap: 11,
                padding: '10px 12px', borderRadius: 10,
                fontSize: 13.5, fontWeight: 500, color: '#64748b',
                textDecoration: 'none', marginBottom: 2, transition: 'all 150ms',
              }}>
              <span style={{ color: '#94a3b8' }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: 12, borderTop: '0.5px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 11 }}>
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#0f172a,#4338ca)', color: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.full_name}</p>
              <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>
                @{user.username} · {isLawyer ? 'Yurist' : 'Mijoz'}
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Top bar */}
        <header style={{
          height: 64, background: '#fff', borderBottom: '0.5px solid #e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '0 24px', position: 'sticky', top: 0, zIndex: 30,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: 8, borderRadius: 9, position: 'relative' }}>
              <Bell size={17} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, cursor: 'pointer' }}>
              <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#0f172a,#4338ca)', color: '#fff', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11 }}>
                {initials}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{user.full_name?.split(' ')[0]}</span>
              <ChevronDown size={13} color="#94a3b8" />
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: 24 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
