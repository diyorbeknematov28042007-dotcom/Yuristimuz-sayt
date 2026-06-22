// ════════════════════════════════════════════════
// ADMIN SIDEBAR (mobile + desktop)
// /src/app/admin/AdminSidebar.tsx
// ════════════════════════════════════════════════

'use client'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Shield, LayoutDashboard, FileText, Users, MessageSquare,
  AlertTriangle, BarChart3, Settings, LogOut, Menu, X,
  ScrollText, UserCheck, Loader2, PieChart, ShieldCheck
} from 'lucide-react'

interface AdminInfo {
  username: string
  loginAt: number
}

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/lawyers', label: 'Yuristlar', icon: UserCheck, badge: 'review' },
  { href: '/admin/verification', label: 'Verifikatsiya', icon: ShieldCheck, badge: 'review' },
  { href: '/admin/ads', label: 'E\'lonlar', icon: FileText, badge: 'review' },
  { href: '/admin/users', label: 'Foydalanuvchilar', icon: Users },
  { href: '/admin/reports', label: 'Shikoyatlar', icon: AlertTriangle, badge: 'review' },
  { href: '/admin/analytics', label: 'Statistika', icon: BarChart3 },
  { href: '/admin/survey', label: "So'rovnoma", icon: PieChart },
  { href: '/admin/audit', label: 'Audit log', icon: ScrollText },
  { href: '/admin/settings', label: 'Sozlamalar', icon: Settings },
]

export default function AdminSidebar({ admin }: { admin: AdminInfo }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)

  // Route o'zgarganda mobile menu yopish
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Body scroll lock mobile menu ochilganda
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLogout = async () => {
    if (logoutLoading) return
    setLogoutLoading(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (err) {
      console.error('Logout xato:', err)
      setLogoutLoading(false)
    }
  }

  const sidebarContent = (
    <>
      {/* Logo / Header */}
      <div style={{
        padding: '20px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #4338ca, #6366f1)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Shield size={18} color="#fff" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 14, fontWeight: 700, color: '#fff',
              letterSpacing: '-0.2px',
            }}>
              Yuristim Admin
            </div>
            <div style={{
              fontSize: 11, color: 'rgba(255,255,255,0.5)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              @{admin.username}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: '12px 10px',
        overflowY: 'auto',
      }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '10px 12px',
                marginBottom: 2,
                borderRadius: 8,
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                background: isActive ? 'rgba(99,102,241,0.2)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 150ms',
                position: 'relative',
                borderLeft: isActive ? '2px solid #818cf8' : '2px solid transparent',
                paddingLeft: isActive ? 10 : 12,
              }}>
              <Icon size={15} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge === 'review' && (
                <span style={{
                  width: 6, height: 6,
                  background: '#f59e0b',
                  borderRadius: '50%',
                  flexShrink: 0,
                }} title="Tekshirish kerak" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{
        padding: '12px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}>
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            background: 'transparent',
            border: '1px solid rgba(220,38,38,0.3)',
            borderRadius: 8,
            color: '#fca5a5',
            fontSize: 12,
            fontWeight: 600,
            cursor: logoutLoading ? 'wait' : 'pointer',
            fontFamily: 'inherit',
            transition: 'all 150ms',
          }}>
          {logoutLoading ? (
            <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <LogOut size={13} />
          )}
          Tizimdan chiqish
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile header bar */}
      <div className="admin-mobile-header" style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: '#0f172a',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={18} color="#fff" />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
            Yuristim Admin
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Menyu ochish"
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: 8,
            padding: 8,
            cursor: 'pointer',
            display: 'flex',
          }}>
          <Menu size={18} color="#fff" />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 50,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Sidebar (mobile drawer + desktop fixed) */}
      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`} style={{
        position: 'fixed',
        top: 0, bottom: 0,
        left: mobileOpen ? 0 : -280,
        width: 240,
        background: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 51,
        transition: 'left 250ms ease-out',
        boxShadow: mobileOpen ? '4px 0 20px rgba(0,0,0,0.3)' : 'none',
      }}>
        {/* Close button (mobile) */}
        <button
          className="admin-close-btn"
          onClick={() => setMobileOpen(false)}
          aria-label="Yopish"
          style={{
            position: 'absolute',
            top: 12, right: 12,
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: 6,
            padding: 6,
            cursor: 'pointer',
            display: 'flex',
            zIndex: 1,
          }}>
          <X size={14} color="#fff" />
        </button>
        {sidebarContent}
      </aside>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (min-width: 768px) {
          .admin-mobile-header {
            display: none !important;
          }
          .admin-sidebar {
            left: 0 !important;
            box-shadow: 1px 0 3px rgba(0,0,0,0.05) !important;
          }
          .admin-close-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
