// ════════════════════════════════════════════════
// ADMIN — Foydalanuvchilar ro'yxati (Client)
// /src/app/admin/users/UsersList.tsx
// ════════════════════════════════════════════════

'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  Search, Users, UserCheck, Ban, Shield, ChevronRight, Loader2,
  CheckCircle2, FileText, AlertTriangle, Briefcase
} from 'lucide-react'

interface User {
  id: string
  username: string
  full_name: string
  role: string
  email: string | null
  phone: string | null
  avatar_url: string | null
  city: string | null
  is_verified: boolean
  created_at: string
  is_blocked: boolean
  blocked_until: string | null
  blocked_reason: string | null
  warnings_count: number
  ads_count: number
  reports_against: number
}

interface Counts {
  all: number; lawyer: number; client: number; blocked: number; verified: number
}

type FilterType = 'all' | 'lawyer' | 'client' | 'blocked' | 'verified'

export default function UsersList({ initialCounts, initialUsers }: { initialCounts: Counts, initialUsers: User[] }) {
  const [counts, setCounts] = useState(initialCounts)
  const [users, setUsers] = useState(initialUsers)
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true)
      const { data } = await supabase.rpc('admin_get_users', {
        p_filter: filter, p_search: search.trim() || null, p_limit: 100
      })
      if (data) setUsers(data)
      const { data: c } = await supabase.rpc('admin_get_user_counts')
      if (c) setCounts(c)
      setLoading(false)
    }, search ? 300 : 0)
    return () => clearTimeout(timer)
  }, [filter, search])

  const tabs = [
    { id: 'all' as FilterType, label: 'Hammasi', count: counts.all, icon: Users, color: '#64748b' },
    { id: 'lawyer' as FilterType, label: 'Yuristlar', count: counts.lawyer, icon: Briefcase, color: '#4338ca' },
    { id: 'client' as FilterType, label: 'Mijozlar', count: counts.client, icon: Users, color: '#0891b2' },
    { id: 'verified' as FilterType, label: 'Tasdiqlangan', count: counts.verified, icon: CheckCircle2, color: '#16a34a' },
    { id: 'blocked' as FilterType, label: 'Bloklangan', count: counts.blocked, icon: Ban, color: '#dc2626' },
  ]

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px', marginBottom: 4 }}>
          Foydalanuvchilar
        </h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          Barcha foydalanuvchilarni boshqarish va nazorat qilish
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 14, paddingBottom: 4 }}>
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = filter === tab.id
          return (
            <button key={tab.id} onClick={() => setFilter(tab.id)} style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '8px 13px',
              background: isActive ? '#0f172a' : '#fff',
              color: isActive ? '#fff' : '#475569',
              border: `1px solid ${isActive ? '#0f172a' : '#e2e8f0'}`,
              borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'inherit',
            }}>
              <Icon size={13} color={isActive ? '#fff' : tab.color} />
              {tab.label}
              <span style={{
                background: isActive ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                color: isActive ? '#fff' : tab.color,
                padding: '1px 7px', borderRadius: 999, fontSize: 10, fontWeight: 700,
              }}>{tab.count}</span>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16, position: 'relative' }}>
        <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ism, username, telefon yoki email bo'yicha qidirish..."
          style={{
            width: '100%', padding: '11px 14px 11px 40px', fontSize: 13,
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
            outline: 'none', fontFamily: 'inherit',
          }}
        />
        {loading && <Loader2 size={14} color="#94a3b8" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', animation: 'spin 1s linear infinite' }} />}
      </div>

      {/* List */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
        {users.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <Users size={32} color="#cbd5e1" style={{ marginBottom: 10 }} />
            <p style={{ fontSize: 13, fontWeight: 500, color: '#64748b' }}>
              {search ? `"${search}" topilmadi` : 'Foydalanuvchilar yo\'q'}
            </p>
          </div>
        ) : (
          users.map((u, idx) => <UserRow key={u.id} user={u} isLast={idx === users.length - 1} />)
        )}
      </div>

      {users.length > 0 && (
        <div style={{ marginTop: 12, textAlign: 'center', fontSize: 11, color: '#94a3b8' }}>
          Jami: {users.length} ta
        </div>
      )}
    </div>
  )
}

function UserRow({ user, isLast }: { user: User, isLast: boolean }) {
  const isBlockedActive = user.is_blocked
  
  return (
    <Link href={`/admin/users/${user.id}`} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
      borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
      textDecoration: 'none', color: 'inherit',
      background: isBlockedActive ? '#fef2f2' : 'transparent',
    }}>
      {/* Avatar */}
      {user.avatar_url ? (
        <img src={user.avatar_url} alt={user.full_name} style={{ width: 42, height: 42, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
      ) : (
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: `linear-gradient(135deg, ${stringToColor(user.username)}aa, ${stringToColor(user.username)})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 15, flexShrink: 0,
        }}>
          {(user.full_name || user.username).charAt(0).toUpperCase()}
        </div>
      )}

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.full_name || user.username}
          </span>
          {user.is_verified && <Shield size={11} color="#16a34a" style={{ flexShrink: 0 }} />}
          <span style={{
            padding: '1px 6px',
            background: user.role === 'lawyer' ? '#eef2ff' : '#f0fdf4',
            color: user.role === 'lawyer' ? '#4338ca' : '#16a34a',
            borderRadius: 4, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px',
          }}>
            {user.role === 'lawyer' ? 'Yurist' : 'Mijoz'}
          </span>
        </div>
        <div style={{ fontSize: 11, color: '#64748b', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span>@{user.username}</span>
          {user.ads_count > 0 && <span>• {user.ads_count} e'lon</span>}
          {user.city && <span>• {user.city}</span>}
          {user.warnings_count > 0 && (
            <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: 2 }}>
              <AlertTriangle size={9} /> {user.warnings_count}
            </span>
          )}
        </div>
      </div>

      {/* Status */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
        {isBlockedActive ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px',
            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 999,
            fontSize: 10, fontWeight: 700, color: '#b91c1c',
          }}>
            <Ban size={9} /> {user.blocked_until ? 'Vaqtinchalik' : 'Doimiy'}
          </div>
        ) : user.reports_against > 0 ? (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px',
            background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 999,
            fontSize: 10, fontWeight: 700, color: '#92400e',
          }}>
            <AlertTriangle size={9} /> {user.reports_against} shikoyat
          </div>
        ) : null}
        <ChevronRight size={14} color="#cbd5e1" />
      </div>
    </Link>
  )
}

function stringToColor(str: string): string {
  const colors = ['#4338ca', '#7c3aed', '#0891b2', '#16a34a', '#ea580c', '#db2777', '#0369a1', '#9333ea']
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}
