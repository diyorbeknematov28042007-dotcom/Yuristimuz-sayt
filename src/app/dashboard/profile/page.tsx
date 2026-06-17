// ════════════════════════════════════════════════
// FOYDALANUVCHI PROFIL SAHIFASI (shaxsiy kabinet)
// /src/app/dashboard/profile/page.tsx
// ════════════════════════════════════════════════

'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  Settings, LogOut, ChevronRight, MapPin, Mail, Phone, Calendar,
  FileText, MessageSquare, Star, Eye, Shield, ShieldCheck, ShieldAlert,
  Briefcase, User as UserIcon, ExternalLink, Loader2, Edit3
} from 'lucide-react'

interface Profile {
  id: string
  username: string
  full_name: string
  role: string
  email: string | null
  phone: string | null
  avatar_url: string | null
  city: string | null
  bio: string | null
  is_verified: boolean
  created_at: string
  profile_views: number
  ads_count: number
  ads_open: number
  conversations_count: number
  reviews_written: number
  reviews_received: number
  lawyer_verified: boolean | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(async (d) => {
        if (d.user) {
          const { data } = await supabase.rpc('get_my_profile', { p_user_id: d.user.id })
          setProfile(data)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '60px 0', textAlign: 'center' }}>
        <Loader2 size={24} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!profile) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '60px 0', textAlign: 'center' }}>
        <p style={{ color: '#64748b', fontSize: 14 }}>Profil yuklanmadi. Iltimos, qayta kiring.</p>
        <Link href="/auth/login" style={{ color: '#4338ca', fontSize: 13, fontWeight: 600, textDecoration: 'none', marginTop: 10, display: 'inline-block' }}>
          Tizimga kirish
        </Link>
      </div>
    )
  }

  const isLawyer = profile.role === 'lawyer'
  const initials = (profile.full_name || profile.username || '?')
    .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', paddingBottom: 60 }}>

      {/* ── Profil sarlavhasi karti ── */}
      <div style={{
        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18,
        padding: 24, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.full_name}
              style={{ width: 72, height: 72, borderRadius: 18, objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{
              width: 72, height: 72, borderRadius: 18,
              background: 'linear-gradient(135deg, #0f172a, #4338ca)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 26, fontWeight: 700, flexShrink: 0,
            }}>{initials}</div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px' }}>
                {profile.full_name}
              </h1>
              {isLawyer && profile.lawyer_verified && (
                <ShieldCheck size={17} color="#16a34a" />
              )}
            </div>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>@{profile.username}</p>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '4px 11px', borderRadius: 999, fontSize: 11.5, fontWeight: 700,
              background: isLawyer ? '#eef2ff' : '#f0fdf4',
              color: isLawyer ? '#4338ca' : '#16a34a',
            }}>
              {isLawyer ? <Briefcase size={12} /> : <UserIcon size={12} />}
              {isLawyer ? 'Yurist' : 'Mijoz'}
            </span>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.6, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
            {profile.bio}
          </p>
        )}

        {/* Kontakt ma'lumotlari */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {profile.city && <InfoRow icon={MapPin} text={profile.city} />}
          {profile.email && <InfoRow icon={Mail} text={profile.email} />}
          {profile.phone && <InfoRow icon={Phone} text={profile.phone} />}
          <InfoRow icon={Calendar} text={`Ro'yxatdan o'tgan: ${fmtDate(profile.created_at)}`} />
        </div>

        {/* Tahrirlash tugmasi */}
        <Link href="/dashboard/settings" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          marginTop: 18, padding: '11px', background: '#0f172a', color: '#fff',
          borderRadius: 11, fontSize: 13, fontWeight: 600, textDecoration: 'none',
        }}>
          <Edit3 size={14} /> Profilni tahrirlash
        </Link>
      </div>

      {/* ── Statistika ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 10, marginBottom: 16,
      }}>
        <StatCard icon={FileText} label="E'lonlar" value={profile.ads_count} sub={`${profile.ads_open} faol`} color="#ea580c" />
        <StatCard icon={MessageSquare} label="Suhbatlar" value={profile.conversations_count} color="#0891b2" />
        {isLawyer ? (
          <>
            <StatCard icon={Star} label="Sharhlar" value={profile.reviews_received} sub="olingan" color="#d97706" />
            <StatCard icon={Eye} label="Profil ko'rishlar" value={profile.profile_views} color="#4338ca" />
          </>
        ) : (
          <StatCard icon={Star} label="Sharhlar" value={profile.reviews_written} sub="yozilgan" color="#d97706" />
        )}
      </div>

      {/* ── Yurist uchun: verifikatsiya holati ── */}
      {isLawyer && (
        <div style={{
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16,
          padding: 18, marginBottom: 16,
        }}>
          {profile.lawyer_verified ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={20} color="#16a34a" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>Tasdiqlangan yurist</p>
                <p style={{ fontSize: 12, color: '#64748b' }}>Profilingiz tekshirildi va tasdiqlandi</p>
              </div>
              <Link href={`/yurist/${profile.username}`} style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '8px 13px',
                background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 9,
                fontSize: 12, fontWeight: 600, color: '#0f172a', textDecoration: 'none', flexShrink: 0,
              }}>
                <ExternalLink size={13} /> Profilim
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldAlert size={20} color="#d97706" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>Tasdiqlanmagan</p>
                <p style={{ fontSize: 12, color: '#64748b' }}>Profilingizni to'ldiring va tekshiruvga yuboring</p>
              </div>
              <Link href="/dashboard/settings" style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '8px 13px',
                background: '#0f172a', color: '#fff', borderRadius: 9,
                fontSize: 12, fontWeight: 600, textDecoration: 'none', flexShrink: 0,
              }}>
                To'ldirish
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── Tezkor havolalar ── */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
        <MenuLink href="/dashboard/my-ads" icon={FileText} label="Mening e'lonlarim" />
        <MenuLink href="/dashboard/chat" icon={MessageSquare} label="Suhbatlarim" />
        <MenuLink href="/dashboard/settings" icon={Settings} label="Sozlamalar" isLast />
      </div>

      {/* ── Chiqish ── */}
      <button onClick={handleLogout} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '13px', background: '#fff', border: '1px solid #fecaca',
        borderRadius: 12, fontSize: 13.5, fontWeight: 600, color: '#dc2626',
        cursor: 'pointer', fontFamily: 'inherit',
      }}>
        <LogOut size={15} /> Hisobdan chiqish
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// ─── Sub-komponentlar ───
function InfoRow({ icon: Icon, text }: { icon: any, text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon size={14} color="#94a3b8" style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: '#475569' }}>{text}</span>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub, color }: any) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 16 }}>
      <Icon size={16} color={color} style={{ marginBottom: 10 }} />
      <div style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.5px' }}>
        {value}
      </div>
      <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 5 }}>
        {label}{sub && ` · ${sub}`}
      </div>
    </div>
  )
}

function MenuLink({ href, icon: Icon, label, isLast }: any) {
  return (
    <Link href={href} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
      textDecoration: 'none', color: 'inherit',
      borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
    }}>
      <Icon size={17} color="#64748b" />
      <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: '#0f172a' }}>{label}</span>
      <ChevronRight size={16} color="#cbd5e1" />
    </Link>
  )
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
}
