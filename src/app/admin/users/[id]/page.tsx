// ════════════════════════════════════════════════
// ADMIN — Foydalanuvchi tafsiloti
// /src/app/admin/users/[id]/page.tsx
// ════════════════════════════════════════════════

import { getAdminFromCookie } from '@/lib/admin-auth'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import {
  ChevronLeft, Shield, Ban, AlertTriangle, MessageSquare, FileText,
  Star, Calendar, Phone, Mail, MapPin, Eye, User, Briefcase, Flag
} from 'lucide-react'
import UserActions from './UserActions'

async function getUserDetails(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data, error } = await supabase.rpc('admin_get_user_details', { p_user_id: id })
  if (error || !data || !data.id) return null
  return data
}

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  const user = await getUserDetails(params.id)
  if (!user) notFound()

  const blockedActive = user.is_blocked

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Link href="/admin/users" style={{
        display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12,
        color: '#64748b', textDecoration: 'none', marginBottom: 14, fontWeight: 500,
      }}>
        <ChevronLeft size={14} /> Foydalanuvchilar ro'yxatiga qaytish
      </Link>

      {/* Block banner */}
      {blockedActive && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12,
          padding: '12px 16px', marginBottom: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: user.blocked_reason ? 6 : 0 }}>
            <Ban size={16} color="#dc2626" />
            <div style={{ flex: 1, fontSize: 12, color: '#991b1b' }}>
              <strong>{user.blocked_until ? 'Vaqtinchalik bloklangan' : 'Doimiy bloklangan'}</strong>
              {user.blocked_until && ` · ${new Date(user.blocked_until).toLocaleString('uz-UZ')} gacha`}
              {user.blocked_by && ` · admin ${user.blocked_by}`}
            </div>
          </div>
          {user.blocked_reason && (
            <div style={{ marginLeft: 26, padding: '8px 10px', background: 'rgba(255,255,255,0.7)', borderRadius: 6, fontSize: 12, color: '#991b1b' }}>
              <strong>Sabab:</strong> {user.blocked_reason}
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 22, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.full_name} style={{ width: 64, height: 64, borderRadius: 14, objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{
              width: 64, height: 64, borderRadius: 14,
              background: `linear-gradient(135deg, ${stringToColor(user.username)}aa, ${stringToColor(user.username)})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 24, flexShrink: 0,
            }}>
              {(user.full_name || user.username).charAt(0).toUpperCase()}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>{user.full_name || user.username}</h1>
              {user.is_verified && <Shield size={14} color="#16a34a" />}
            </div>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>@{user.username}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{
                padding: '3px 10px',
                background: user.role === 'lawyer' ? '#eef2ff' : '#f0fdf4',
                color: user.role === 'lawyer' ? '#4338ca' : '#16a34a',
                borderRadius: 999, fontSize: 11, fontWeight: 700,
              }}>
                {user.role === 'lawyer' ? 'Yurist' : 'Mijoz'}
              </span>
              {user.warnings_count > 0 && (
                <span style={{
                  padding: '3px 10px', background: '#fff7ed', color: '#9a3412',
                  borderRadius: 999, fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <AlertTriangle size={10} /> {user.warnings_count} ogohlantirish
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
          {user.phone && <Field icon={Phone} label="Telefon" value={user.phone} />}
          {user.email && <Field icon={Mail} label="Email" value={user.email} />}
          {user.city && <Field icon={MapPin} label="Shahar" value={user.city} />}
          <Field icon={Calendar} label="Ro'yxatdan o'tgan" value={new Date(user.created_at).toLocaleString('uz-UZ')} />
          <Field icon={Eye} label="Profil ko'rishlar" value={String(user.profile_views)} />
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: 10, marginBottom: 14,
      }}>
        <StatCard icon={FileText} label="E'lonlar" value={user.ads_count} sub={`${user.ads_open} faol`} color="#ea580c" />
        <StatCard icon={MessageSquare} label="Suhbatlar" value={user.conversations_count} color="#4338ca" />
        {user.role === 'lawyer' ? (
          <StatCard icon={Star} label="Olingan sharh" value={user.reviews_received} color="#d97706" />
        ) : (
          <StatCard icon={Star} label="Yozgan sharh" value={user.reviews_written} color="#d97706" />
        )}
        <StatCard icon={Flag} label="Shikoyatlar" value={user.reports_against} sub="unga qarshi" color="#dc2626" />
      </div>

      {/* Lawyer profile (agar yurist) */}
      {user.role === 'lawyer' && user.lawyer_profile && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 18, marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Briefcase size={15} color="#0f172a" />
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>Yurist profili</h2>
            <Link href={`/admin/lawyers/${user.id}`} style={{
              marginLeft: 'auto', fontSize: 11, color: '#4338ca', textDecoration: 'none', fontWeight: 600,
            }}>
              To'liq ko'rish →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Field icon={Shield} label="Tasdiqlangan" value={user.lawyer_profile.is_verified ? 'Ha' : 'Yo\'q'} />
            {user.lawyer_profile.license_number && <Field icon={FileText} label="Litsenziya" value={user.lawyer_profile.license_number} />}
            {user.lawyer_profile.experience_years && <Field icon={Calendar} label="Tajriba" value={`${user.lawyer_profile.experience_years} yil`} />}
          </div>
        </div>
      )}

      {/* Actions */}
      <UserActions
        userId={user.id}
        isBlocked={blockedActive}
      />
    </div>
  )
}

function Field({ icon: Icon, label, value }: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon size={13} color="#94a3b8" style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: '#64748b', flex: 1 }}>{label}</span>
      <span style={{ fontSize: 12.5, color: '#0f172a', fontWeight: 600 }}>{value}</span>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub, color }: any) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <Icon size={15} color={color} style={{ marginBottom: 8 }} />
      <div style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{label}{sub && ` · ${sub}`}</div>
    </div>
  )
}

function stringToColor(str: string): string {
  const colors = ['#4338ca', '#7c3aed', '#0891b2', '#16a34a', '#ea580c', '#db2777', '#0369a1', '#9333ea']
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}
