// ════════════════════════════════════════════════
// ADMIN DASHBOARD (vaqtinchalik — 3.2'da to'liq qilamiz)
// /src/app/admin/page.tsx
// ════════════════════════════════════════════════

import { Shield, LogOut, ArrowRight } from 'lucide-react'
import { getAdminFromCookie } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'
import AdminLogoutButton from './AdminLogoutButton'

export default async function AdminHomePage() {
  const admin = await getAdminFromCookie()

  if (!admin) {
    redirect('/admin/login')
  }

  const loginDate = new Date(admin.loginAt)
  const sessionMinutes = Math.floor((Date.now() - admin.loginAt) / 60000)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        maxWidth: 600,
        margin: '40px auto 0',
      }}>
        {/* Header */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '24px',
          marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 44,
                height: 44,
                background: 'linear-gradient(135deg, #0f172a, #4338ca)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Shield size={20} color="#fff" />
              </div>
              <div>
                <h1 style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: '#0f172a',
                  letterSpacing: '-0.3px',
                }}>
                  Admin Panel
                </h1>
                <p style={{ fontSize: 12, color: '#64748b' }}>
                  Yuristim boshqaruv tizimi
                </p>
              </div>
            </div>
            <AdminLogoutButton />
          </div>

          {/* Sessiya ma'lumoti */}
          <div style={{
            marginTop: 16,
            padding: '12px 14px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 10,
          }}>
            <div style={{ fontSize: 12, color: '#166534', fontWeight: 600, marginBottom: 4 }}>
              ✓ Tizimga kirildi
            </div>
            <div style={{ fontSize: 11, color: '#15803d', lineHeight: 1.5 }}>
              Foydalanuvchi: <strong>{admin.username}</strong><br/>
              Kirish vaqti: {loginDate.toLocaleString('uz-UZ')}<br/>
              Sessiya: {sessionMinutes} daqiqa (2 soatdan keyin avtomatik chiqish)
            </div>
          </div>
        </div>

        {/* Faza 3 holati */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '24px',
        }}>
          <h2 style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#0f172a',
            marginBottom: 16,
          }}>
            Admin panel rivojlanish jarayoni
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { id: '3.1', name: 'Admin auth tizimi', status: 'done' },
              { id: '3.2', name: 'Admin dashboard layout', status: 'next' },
              { id: '3.3', name: 'Yuristlarni tasdiqlash', status: 'pending' },
              { id: '3.4', name: 'E\'lonlar moderatsiyasi', status: 'pending' },
              { id: '3.5', name: 'Shikoyat tizimi', status: 'pending' },
              { id: '3.6', name: 'Foydalanuvchi boshqaruvi', status: 'pending' },
              { id: '3.7', name: 'Statistika dashboard', status: 'pending' },
              { id: '3.8', name: 'Audit log', status: 'pending' },
            ].map((item) => (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                background: item.status === 'done' ? '#f0fdf4' : item.status === 'next' ? '#fef3c7' : '#f8fafc',
                border: `1px solid ${item.status === 'done' ? '#bbf7d0' : item.status === 'next' ? '#fde68a' : '#e2e8f0'}`,
                borderRadius: 8,
              }}>
                <div style={{
                  width: 24,
                  height: 24,
                  background: item.status === 'done' ? '#16a34a' : item.status === 'next' ? '#d97706' : '#cbd5e1',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#fff',
                  flexShrink: 0,
                }}>
                  {item.id}
                </div>
                <div style={{ flex: 1, fontSize: 13, color: '#0f172a', fontWeight: 500 }}>
                  {item.name}
                </div>
                <div style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: item.status === 'done' ? '#166534' : item.status === 'next' ? '#92400e' : '#64748b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {item.status === 'done' ? '✓ Bajarildi' : item.status === 'next' ? '→ Keyingi' : 'Kutilmoqda'}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 16,
            padding: '12px 14px',
            background: '#eef2ff',
            border: '1px solid #c7d2fe',
            borderRadius: 10,
            fontSize: 12,
            color: '#4338ca',
            lineHeight: 1.6,
          }}>
            <strong>Keyingi qadam:</strong> 3.2 — To'liq dashboard layout, sidebar, navigation va asosiy sahifalar tuzilishi.
          </div>
        </div>
      </div>
    </div>
  )
}
