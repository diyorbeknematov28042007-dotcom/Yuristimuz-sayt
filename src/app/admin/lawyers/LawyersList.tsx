// ════════════════════════════════════════════════
// ADMIN — Yuristlar ro'yxati (Client Component)
// /src/app/admin/lawyers/LawyersList.tsx
// ════════════════════════════════════════════════

'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  Search, Filter, UserCheck, UserX, Clock, AlertCircle,
  CheckCircle2, XCircle, FileText, Loader2, ChevronRight,
  Users, Award, Shield, Phone
} from 'lucide-react'

interface Lawyer {
  id: string
  username: string
  full_name: string
  phone: string | null
  created_at: string
  is_verified: boolean
  has_diploma: boolean
  license_number: string | null
  specialization: string[] | null
  experience_years: number | null
  workplace: string | null
  job_title: string | null
  verified_at: string | null
  verified_by: string | null
  rejection_reason: string | null
  rejected_at: string | null
  submitted_for_review_at: string | null
  profile_complete: boolean
}

interface Counts {
  all: number
  verified: number
  pending: number
  rejected: number
  incomplete: number
}

type FilterType = 'all' | 'pending' | 'verified' | 'rejected' | 'incomplete'

export default function LawyersList({
  initialCounts,
  initialLawyers
}: {
  initialCounts: Counts
  initialLawyers: Lawyer[]
}) {
  const [counts, setCounts] = useState<Counts>(initialCounts)
  const [lawyers, setLawyers] = useState<Lawyer[]>(initialLawyers)
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  // Filterga qarab fetch
  useEffect(() => {
    const ctrl = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase.rpc('admin_get_lawyers', {
          p_filter: filter,
          p_search: search.trim() || null,
          p_limit: 100
        })
        if (!error && data) setLawyers(data)
        
        // Counts ham yangilash
        const { data: cnt } = await supabase.rpc('admin_get_lawyer_counts')
        if (cnt) setCounts(cnt)
      } catch (e) {
        console.error('Fetch xato:', e)
      } finally {
        setLoading(false)
      }
    }, search ? 300 : 0)  // search uchun debounce

    return () => {
      clearTimeout(timer)
      ctrl.abort()
    }
  }, [filter, search])

  const filterTabs = [
    { id: 'all' as FilterType, label: 'Hammasi', count: counts.all, icon: Users, color: '#64748b' },
    { id: 'pending' as FilterType, label: 'Kutilmoqda', count: counts.pending, icon: Clock, color: '#d97706' },
    { id: 'verified' as FilterType, label: 'Tasdiqlangan', count: counts.verified, icon: CheckCircle2, color: '#16a34a' },
    { id: 'rejected' as FilterType, label: 'Rad etilgan', count: counts.rejected, icon: XCircle, color: '#dc2626' },
    { id: 'incomplete' as FilterType, label: 'To\'liq emas', count: counts.incomplete, icon: AlertCircle, color: '#94a3b8' },
  ]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#0f172a',
          letterSpacing: '-0.4px',
          marginBottom: 4,
        }}>
          Yuristlarni boshqarish
        </h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          Yuristlarni tasdiqlash, rad etish va profillarni boshqarish
        </p>
      </div>

      {/* Filter tabs (mobile-friendly horizontal scroll) */}
      <div style={{
        display: 'flex',
        gap: 6,
        overflowX: 'auto',
        marginBottom: 14,
        paddingBottom: 4,
        WebkitOverflowScrolling: 'touch',
      }}>
        {filterTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = filter === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 13px',
                background: isActive ? '#0f172a' : '#fff',
                color: isActive ? '#fff' : '#475569',
                border: `1px solid ${isActive ? '#0f172a' : '#e2e8f0'}`,
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: 'inherit',
                transition: 'all 150ms',
                flexShrink: 0,
              }}>
              <Icon size={13} color={isActive ? '#fff' : tab.color} />
              {tab.label}
              <span style={{
                background: isActive ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                color: isActive ? '#fff' : '#0f172a',
                padding: '1px 7px',
                borderRadius: 999,
                fontSize: 10,
                fontWeight: 700,
              }}>
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16, position: 'relative' }}>
        <Search size={15} color="#94a3b8" style={{
          position: 'absolute',
          left: 14,
          top: '50%',
          transform: 'translateY(-50%)',
        }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ism, username, telefon yoki litsenziya bo'yicha qidirish..."
          style={{
            width: '100%',
            padding: '11px 14px 11px 40px',
            fontSize: 13,
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            outline: 'none',
            fontFamily: 'inherit',
            color: '#0f172a',
          }}
        />
        {loading && (
          <Loader2 size={14} color="#94a3b8" style={{
            position: 'absolute',
            right: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            animation: 'spin 1s linear infinite',
          }} />
        )}
      </div>

      {/* List */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        overflow: 'hidden',
      }}>
        {lawyers.length === 0 ? (
          <div style={{
            padding: 60,
            textAlign: 'center',
            color: '#94a3b8',
          }}>
            <Users size={32} color="#cbd5e1" style={{ marginBottom: 10 }} />
            <p style={{ fontSize: 13, fontWeight: 500, color: '#64748b' }}>
              {search ? `"${search}" bo'yicha hech narsa topilmadi` : 'Yuristlar topilmadi'}
            </p>
          </div>
        ) : (
          lawyers.map((lawyer, idx) => (
            <LawyerRow key={lawyer.id} lawyer={lawyer} isLast={idx === lawyers.length - 1} />
          ))
        )}
      </div>

      {lawyers.length > 0 && (
        <div style={{
          marginTop: 12,
          textAlign: 'center',
          fontSize: 11,
          color: '#94a3b8',
        }}>
          Jami: {lawyers.length} ta yurist
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────
// Bitta yurist qatori
// ─────────────────────────────────────────
function LawyerRow({ lawyer, isLast }: { lawyer: Lawyer, isLast: boolean }) {
  const status = getStatus(lawyer)
  
  return (
    <Link
      href={`/admin/lawyers/${lawyer.id}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 16px',
        borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'background 150ms',
      }}>
      {/* Avatar placeholder */}
      <div style={{
        width: 42, height: 42,
        background: `linear-gradient(135deg, ${stringToColor(lawyer.username)}aa, ${stringToColor(lawyer.username)})`,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: 14,
        flexShrink: 0,
        letterSpacing: '-0.3px',
      }}>
        {(lawyer.full_name || lawyer.username).charAt(0).toUpperCase()}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 2,
        }}>
          <span style={{
            fontSize: 13.5,
            fontWeight: 700,
            color: '#0f172a',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            letterSpacing: '-0.2px',
          }}>
            {lawyer.full_name || lawyer.username}
          </span>
          {lawyer.is_verified && (
            <Shield size={11} color="#16a34a" style={{ flexShrink: 0 }} />
          )}
        </div>
        <div style={{
          fontSize: 11,
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap',
        }}>
          <span>@{lawyer.username}</span>
          {lawyer.experience_years && (
            <span>• {lawyer.experience_years} yil tajriba</span>
          )}
          {lawyer.specialization && lawyer.specialization.length > 0 && (
            <span>• {lawyer.specialization.slice(0, 2).join(', ')}</span>
          )}
        </div>
      </div>

      {/* Status badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 9px',
        background: status.bg,
        border: `1px solid ${status.border}`,
        borderRadius: 999,
        fontSize: 10.5,
        fontWeight: 700,
        color: status.color,
        flexShrink: 0,
      }}>
        {status.icon}
        <span>{status.label}</span>
      </div>

      <ChevronRight size={14} color="#cbd5e1" style={{ flexShrink: 0 }} />
    </Link>
  )
}

// ─────────────────────────────────────────
// Status hisoblash
// ─────────────────────────────────────────
function getStatus(lawyer: Lawyer) {
  if (lawyer.is_verified) {
    return {
      label: 'Tasdiqlangan',
      bg: '#f0fdf4',
      border: '#bbf7d0',
      color: '#15803d',
      icon: <CheckCircle2 size={10} />,
    }
  }
  if (lawyer.rejected_at) {
    return {
      label: 'Rad etilgan',
      bg: '#fef2f2',
      border: '#fecaca',
      color: '#b91c1c',
      icon: <XCircle size={10} />,
    }
  }
  if (lawyer.profile_complete) {
    return {
      label: 'Kutilmoqda',
      bg: '#fef3c7',
      border: '#fde68a',
      color: '#92400e',
      icon: <Clock size={10} />,
    }
  }
  return {
    label: 'To\'liq emas',
    bg: '#f8fafc',
    border: '#e2e8f0',
    color: '#64748b',
    icon: <AlertCircle size={10} />,
  }
}

// Helper - string'dan rang yaratish (consistent avatar rang)
function stringToColor(str: string): string {
  const colors = ['#4338ca', '#7c3aed', '#0891b2', '#16a34a', '#ea580c', '#db2777', '#0369a1', '#9333ea']
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
