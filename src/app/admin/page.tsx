// ════════════════════════════════════════════════
// ADMIN DASHBOARD — Asosiy sahifa
// /src/app/admin/page.tsx
// ════════════════════════════════════════════════

import { getAdminFromCookie } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import {
  Users, UserCheck, FileText, MessageSquare, Star,
  Bell, TrendingUp, Activity, ArrowUpRight, AlertCircle,
  CheckCircle2, Clock, Sparkles
} from 'lucide-react'
import Link from 'next/link'

// Statistika olish (server-side)
async function getStats() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data, error } = await supabase.rpc('get_admin_stats')
    if (error) {
      console.error('Stats fetch xato:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Stats xato:', err)
    return null
  }
}

export default async function AdminDashboardPage() {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  const stats = await getStats()

  // Statistika kartochkalari
  const mainCards = [
    {
      label: 'Foydalanuvchilar',
      value: stats?.total_users ?? '—',
      sublabel: `${stats?.users_today ?? 0} ta bugun`,
      icon: Users,
      color: '#4338ca',
      bgColor: '#eef2ff',
      href: '/admin/users',
    },
    {
      label: 'Yuristlar',
      value: stats?.total_lawyers ?? '—',
      sublabel: `${stats?.verified_lawyers ?? 0} ta tasdiqlangan`,
      icon: UserCheck,
      color: '#16a34a',
      bgColor: '#f0fdf4',
      href: '/admin/lawyers',
    },
    {
      label: 'Mijozlar',
      value: stats?.total_clients ?? '—',
      sublabel: `${stats?.users_this_week ?? 0} ta haftada`,
      icon: Users,
      color: '#0891b2',
      bgColor: '#ecfeff',
      href: '/admin/users?role=client',
    },
    {
      label: 'E\'lonlar',
      value: stats?.total_ads ?? '—',
      sublabel: `${stats?.open_ads ?? 0} ta ochiq`,
      icon: FileText,
      color: '#ea580c',
      bgColor: '#fff7ed',
      href: '/admin/ads',
    },
  ]

  // Aktivlik kartochkalari
  const activityCards = [
    {
      label: 'Bugungi xabarlar',
      value: stats?.messages_today ?? 0,
      icon: MessageSquare,
      color: '#7c3aed',
    },
    {
      label: 'Jami suhbatlar',
      value: stats?.total_conversations ?? 0,
      icon: Activity,
      color: '#0891b2',
    },
    {
      label: 'Sharhlar',
      value: stats?.total_reviews ?? 0,
      sublabel: stats?.avg_rating ? `⭐ ${stats.avg_rating}` : null,
      icon: Star,
      color: '#d97706',
    },
    {
      label: 'Push obunalar',
      value: stats?.push_subscriptions ?? 0,
      icon: Bell,
      color: '#db2777',
    },
  ]

  // Tezkor amallar (e'tibor talab qiluvchilar)
  const pendingLawyers = stats?.pending_lawyers ?? 0
  const hasUrgent = pendingLawyers > 0

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#0f172a',
          letterSpacing: '-0.4px',
          marginBottom: 4,
        }}>
          Bosh sahifa
        </h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          Yuristim platformasi umumiy ko'rinishi
        </p>
      </div>

      {/* Diqqat kerak — agar pending narsalar bo'lsa */}
      {hasUrgent && (
        <div style={{
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          border: '1px solid #fbbf24',
          borderRadius: 12,
          padding: '14px 16px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 36, height: 36,
            background: '#f59e0b',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <AlertCircle size={18} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#92400e',
            }}>
              Diqqat talab qiladi
            </div>
            <div style={{ fontSize: 11.5, color: '#a16207', marginTop: 2 }}>
              {pendingLawyers} ta yurist profili tasdiqlanmagan
            </div>
          </div>
          <Link
            href="/admin/lawyers"
            style={{
              background: '#f59e0b',
              color: '#fff',
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              flexShrink: 0,
            }}>
            Ko'rish
            <ArrowUpRight size={13} />
          </Link>
        </div>
      )}

      {/* Asosiy statistika kartochkalari */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 12,
        marginBottom: 24,
      }}>
        {mainCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 14,
                padding: '18px',
                textDecoration: 'none',
                transition: 'all 200ms',
                display: 'block',
              }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}>
                <div style={{
                  width: 36, height: 36,
                  background: card.bgColor,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={17} color={card.color} />
                </div>
                <ArrowUpRight size={14} color="#cbd5e1" />
              </div>
              <div style={{
                fontSize: 11.5,
                color: '#64748b',
                fontWeight: 500,
                marginBottom: 4,
              }}>
                {card.label}
              </div>
              <div style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.4px',
                lineHeight: 1,
                marginBottom: 6,
              }}>
                {card.value}
              </div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>
                {card.sublabel}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Aktivlik bo'limi */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: '18px',
        marginBottom: 16,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16,
        }}>
          <Activity size={15} color="#0f172a" />
          <h2 style={{
            fontSize: 14,
            fontWeight: 700,
            color: '#0f172a',
            letterSpacing: '-0.2px',
          }}>
            Aktivlik
          </h2>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12,
        }}>
          {activityCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.label} style={{
                padding: '12px',
                background: '#f8fafc',
                borderRadius: 10,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8,
                }}>
                  <Icon size={13} color={card.color} />
                  <span style={{
                    fontSize: 11,
                    color: '#64748b',
                    fontWeight: 500,
                  }}>
                    {card.label}
                  </span>
                </div>
                <div style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#0f172a',
                  lineHeight: 1,
                }}>
                  {card.value}
                  {card.sublabel && (
                    <span style={{
                      fontSize: 11,
                      color: '#d97706',
                      marginLeft: 6,
                      fontWeight: 600,
                    }}>
                      {card.sublabel}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bo'sh holatda yoki rivojlanish */}
      <div style={{
        background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
        border: '1px solid #bae6fd',
        borderRadius: 14,
        padding: '18px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 12,
        }}>
          <Sparkles size={15} color="#0369a1" />
          <h3 style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#0c4a6e',
          }}>
            Faza 3 — Rivojlanish jarayoni
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { id: '3.1', name: 'Admin auth tizimi', status: 'done' },
            { id: '3.2', name: 'Admin dashboard layout', status: 'done' },
            { id: '3.3', name: 'Yuristlarni tasdiqlash', status: 'next' },
            { id: '3.4', name: 'E\'lonlar moderatsiyasi', status: 'pending' },
            { id: '3.5', name: 'Shikoyat tizimi', status: 'pending' },
            { id: '3.6', name: 'Foydalanuvchi boshqaruvi', status: 'pending' },
            { id: '3.7', name: 'Statistika dashboard', status: 'pending' },
            { id: '3.8', name: 'Audit log', status: 'pending' },
          ].map((item) => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              color: '#0c4a6e',
            }}>
              {item.status === 'done' && (
                <CheckCircle2 size={13} color="#16a34a" style={{ flexShrink: 0 }} />
              )}
              {item.status === 'next' && (
                <Clock size={13} color="#d97706" style={{ flexShrink: 0 }} />
              )}
              {item.status === 'pending' && (
                <div style={{
                  width: 13, height: 13,
                  border: '1.5px solid #94a3b8',
                  borderRadius: '50%',
                  flexShrink: 0,
                }} />
              )}
              <span style={{
                fontWeight: item.status === 'next' ? 600 : 500,
                color: item.status === 'done' ? '#15803d' :
                       item.status === 'next' ? '#92400e' : '#64748b',
              }}>
                {item.id} — {item.name}
                {item.status === 'next' && (
                  <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700 }}>
                    KEYINGI
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 24,
        textAlign: 'center',
        fontSize: 11,
        color: '#94a3b8',
      }}>
        Yuristim Admin Panel · v0.3.2 (MVP)
      </div>
    </div>
  )
}
