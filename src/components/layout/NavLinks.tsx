'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FileText, MessageCircle, Grid3x3, User, Settings, Briefcase } from 'lucide-react'
import { useNotifications } from '@/contexts/NotificationContext'

const mainLinks = [
  { href: '/dashboard',          label: 'Asosiy',    icon: Home,          size: 20 },
  { href: '/dashboard/ads',      label: "E'lonlar",  icon: FileText,      size: 20 },
  { href: '/dashboard/chat',     label: 'Suhbatlar', icon: MessageCircle, size: 20 },
  { href: '/dashboard/services', label: 'Xizmatlar', icon: Grid3x3,       size: 20 },
  { href: '/dashboard/profile',  label: 'Profil',    icon: User,          size: 20 },
]

// Faqat desktop sidebar da ko'rinadi (mobile bottom nav da o'rin yo'q)
const secondaryLinks = [
  { href: '/dashboard/my-ads',   label: "Mening e'lonlarim",  icon: Briefcase, size: 18 },
]

function isActive(href: string, pathname: string) {
  if (href === '/dashboard') return pathname === '/dashboard'
  return pathname.startsWith(href)
}

// ── Desktop sidebar nav ────────────────────────────
export function SidebarNav() {
  const pathname = usePathname()
  const { totalUnread } = useNotifications()

  return (
    <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
      {mainLinks.map(link => {
        const active = isActive(link.href, pathname)
        const Icon = link.icon
        const isChatLink = link.href === '/dashboard/chat'
        return (
          <Link key={link.href} href={link.href}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10, marginBottom: 2,
              fontSize: 13.5, fontWeight: active ? 700 : 500,
              color: active ? '#0f172a' : '#64748b',
              textDecoration: 'none',
              background: active ? '#f1f5f9' : 'transparent',
              borderLeft: active ? '3px solid #0f172a' : '3px solid transparent',
              transition: 'all 150ms',
              position: 'relative',
            }}>
            <Icon size={20} color={active ? '#0f172a' : '#94a3b8'} />
            <span style={{ flex: 1 }}>{link.label}</span>
            {/* Chat unread badge */}
            {isChatLink && totalUnread > 0 && (
              <span style={{
                background: '#ef4444', color: '#fff',
                fontSize: 10.5, fontWeight: 700,
                padding: '2px 7px', borderRadius: 100,
                minWidth: 20, textAlign: 'center',
                lineHeight: 1.4,
              }}>
                {totalUnread > 99 ? '99+' : totalUnread}
              </span>
            )}
          </Link>
        )
      })}

      <div style={{ height: 1, background: '#f1f5f9', margin: '10px 0' }} />

      {/* Mening e'lonlarim (faqat sidebar) */}
      {secondaryLinks.map(link => {
        const active = isActive(link.href, pathname)
        const Icon = link.icon
        return (
          <Link key={link.href} href={link.href}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10, marginBottom: 2,
              fontSize: 13.5, fontWeight: active ? 700 : 500,
              color: active ? '#0f172a' : '#64748b',
              textDecoration: 'none',
              background: active ? '#f1f5f9' : 'transparent',
              borderLeft: active ? '3px solid #0f172a' : '3px solid transparent',
              transition: 'all 150ms',
            }}>
            <Icon size={20} color={active ? '#0f172a' : '#94a3b8'} />
            {link.label}
          </Link>
        )
      })}

      {/* Sozlamalar */}
      {(() => {
        const active = pathname.startsWith('/dashboard/settings')
        return (
          <Link href="/dashboard/settings"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10,
              fontSize: 13.5, fontWeight: active ? 700 : 500,
              color: active ? '#0f172a' : '#64748b',
              textDecoration: 'none',
              background: active ? '#f1f5f9' : 'transparent',
              borderLeft: active ? '3px solid #0f172a' : '3px solid transparent',
              transition: 'all 150ms',
            }}>
            <Settings size={20} color={active ? '#0f172a' : '#94a3b8'} />
            Sozlamalar
          </Link>
        )
      })()}
    </nav>
  )
}

// ── Mobile bottom nav ──────────────────────────────
export function BottomNav() {
  const pathname = usePathname()
  const { totalUnread } = useNotifications()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(255,255,255,0.97)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderTop: '0.5px solid #e2e8f0',
      zIndex: 50,
      paddingTop: 8,
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: 'calc(14px + env(safe-area-inset-bottom))',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
    }}>
      {mainLinks.map(link => {
        const active = isActive(link.href, pathname)
        const Icon = link.icon
        const isChatLink = link.href === '/dashboard/chat'
        return (
          <Link key={link.href} href={link.href}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 3, padding: '4px 10px', textDecoration: 'none',
              minWidth: 44, position: 'relative',
            }}>
            <div style={{ position: 'relative' }}>
              <Icon size={22} color={active ? '#0f172a' : '#94a3b8'} strokeWidth={active ? 2.5 : 1.8} />
              {/* Chat unread badge - mobile da kichik */}
              {isChatLink && totalUnread > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -5, right: -8,
                  background: '#ef4444', color: '#fff',
                  fontSize: 9, fontWeight: 700,
                  padding: '1px 5px', borderRadius: 100,
                  minWidth: 16, textAlign: 'center',
                  lineHeight: 1.3,
                  border: '1.5px solid #fff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }}>
                  {totalUnread > 9 ? '9+' : totalUnread}
                </span>
              )}
            </div>
            <span style={{
              fontSize: 9, fontWeight: active ? 700 : 500,
              letterSpacing: '0.1px',
              color: active ? '#0f172a' : '#94a3b8',
            }}>
              {link.label}
            </span>
            {/* Faol ko'rsatgich nuqtasi */}
            {active && (
              <div style={{
                position: 'absolute', top: -8, left: '50%',
                transform: 'translateX(-50%)',
                width: 20, height: 3, borderRadius: 100,
                background: '#0f172a',
              }} />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
