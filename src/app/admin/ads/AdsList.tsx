// ════════════════════════════════════════════════
// ADMIN — E'lonlar ro'yxati (Client Component)
// /src/app/admin/ads/AdsList.tsx
// ════════════════════════════════════════════════

'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  Search, FileText, CheckCircle2, XCircle, Clock, AlertTriangle,
  ChevronRight, Loader2, Shield, User, MapPin, Calendar
} from 'lucide-react'

interface Ad {
  id: string
  title: string
  description: string
  category: string
  city: string | null
  budget_min: number | null
  budget_max: number | null
  status: string
  created_at: string
  submitted_at: string
  views_count: number
  moderation_score: number
  moderation_flags: any
  moderation_reason: string | null
  approved_at: string | null
  approved_by: string | null
  rejected_at: string | null
  rejected_by: string | null
  poster_id: string
  poster_role: string
  poster_username: string
  poster_full_name: string
  poster_is_verified: boolean
}

interface Counts {
  all: number
  pending: number
  approved: number
  rejected: number
  high_risk: number
}

type FilterType = 'pending' | 'approved' | 'rejected' | 'high_risk' | 'all'

export default function AdsList({
  initialCounts,
  initialAds,
}: {
  initialCounts: Counts
  initialAds: Ad[]
}) {
  const [counts, setCounts] = useState<Counts>(initialCounts)
  const [ads, setAds] = useState<Ad[]>(initialAds)
  const [filter, setFilter] = useState<FilterType>('pending')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const { data } = await supabase.rpc('admin_get_ads', {
          p_filter: filter,
          p_search: search.trim() || null,
          p_limit: 100,
        })
        if (data) setAds(data)
        const { data: cnt } = await supabase.rpc('admin_get_ad_counts')
        if (cnt) setCounts(cnt)
      } finally {
        setLoading(false)
      }
    }, search ? 300 : 0)
    return () => clearTimeout(timer)
  }, [filter, search])

  const tabs = [
    { id: 'pending' as FilterType, label: 'Kutilmoqda', count: counts.pending, icon: Clock, color: '#d97706' },
    { id: 'high_risk' as FilterType, label: 'Yuqori xavf', count: counts.high_risk, icon: AlertTriangle, color: '#dc2626' },
    { id: 'approved' as FilterType, label: 'Tasdiqlangan', count: counts.approved, icon: CheckCircle2, color: '#16a34a' },
    { id: 'rejected' as FilterType, label: 'Rad etilgan', count: counts.rejected, icon: XCircle, color: '#dc2626' },
    { id: 'all' as FilterType, label: 'Hammasi', count: counts.all, icon: FileText, color: '#64748b' },
  ]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px', marginBottom: 4 }}>
          E'lonlarni boshqarish
        </h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          E'lonlarni tasdiqlash, rad etish va moderatsiya
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 14, paddingBottom: 4 }}>
        {tabs.map((tab) => {
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
        <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Sarlavha, tavsif yoki muallif bo'yicha qidirish..."
          style={{
            width: '100%',
            padding: '11px 14px 11px 40px',
            fontSize: 13,
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        {loading && (
          <Loader2 size={14} color="#94a3b8" style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            animation: 'spin 1s linear infinite',
          }} />
        )}
      </div>

      {/* List */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
        {ads.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <FileText size={32} color="#cbd5e1" style={{ marginBottom: 10 }} />
            <p style={{ fontSize: 13, fontWeight: 500, color: '#64748b' }}>
              {filter === 'pending' ? 'Tekshirilishi kerak bo\'lgan e\'lonlar yo\'q' :
               search ? `"${search}" bo'yicha hech narsa topilmadi` : 'E\'lonlar topilmadi'}
            </p>
          </div>
        ) : (
          ads.map((ad, idx) => <AdRow key={ad.id} ad={ad} isLast={idx === ads.length - 1} />)
        )}
      </div>
    </div>
  )
}

function AdRow({ ad, isLast }: { ad: Ad, isLast: boolean }) {
  const status = getStatus(ad)
  const risk = getRiskLevel(ad.moderation_score)

  return (
    <Link
      href={`/admin/ads/${ad.id}`}
      style={{
        display: 'block',
        padding: '14px 16px',
        borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
        textDecoration: 'none',
        color: 'inherit',
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* Status indicator */}
        <div style={{
          width: 4,
          alignSelf: 'stretch',
          background: status.color,
          borderRadius: 2,
          flexShrink: 0,
        }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: '#0f172a',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              minWidth: 0,
            }}>
              {ad.title}
            </span>
            {ad.poster_role === 'lawyer' && ad.poster_is_verified && (
              <Shield size={11} color="#16a34a" style={{ flexShrink: 0 }} />
            )}
          </div>

          {/* Description preview */}
          <p style={{
            fontSize: 12,
            color: '#64748b',
            lineHeight: 1.5,
            marginBottom: 8,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {ad.description}
          </p>

          {/* Meta */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            fontSize: 11,
            color: '#94a3b8',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <User size={10} />
              {ad.poster_full_name || ad.poster_username}
              <span style={{
                marginLeft: 4,
                padding: '1px 5px',
                background: ad.poster_role === 'lawyer' ? '#eef2ff' : '#f0fdf4',
                color: ad.poster_role === 'lawyer' ? '#4338ca' : '#16a34a',
                borderRadius: 4,
                fontSize: 9,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
              }}>
                {ad.poster_role === 'lawyer' ? 'Yurist' : 'Mijoz'}
              </span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <FileText size={10} />
              {ad.category}
            </span>
            {ad.city && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <MapPin size={10} />
                {ad.city}
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Calendar size={10} />
              {timeAgo(ad.submitted_at || ad.created_at)}
            </span>
          </div>
        </div>

        {/* Right side - badges */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          alignItems: 'flex-end',
          flexShrink: 0,
        }}>
          {/* Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 8px',
            background: status.bg,
            border: `1px solid ${status.border}`,
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 700,
            color: status.color,
          }}>
            {status.icon}
            {status.label}
          </div>

          {/* Risk score */}
          {ad.moderation_score > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              padding: '2px 8px',
              background: risk.bg,
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 700,
              color: risk.color,
            }}>
              <AlertTriangle size={9} />
              {ad.moderation_score}
            </div>
          )}

          <ChevronRight size={13} color="#cbd5e1" style={{ marginTop: 2 }} />
        </div>
      </div>
    </Link>
  )
}

function getStatus(ad: Ad) {
  if (ad.status === 'pending_review') return {
    label: 'Kutilmoqda',
    bg: '#fef3c7', border: '#fde68a', color: '#92400e',
    icon: <Clock size={9} />,
  }
  if (ad.status === 'open') return {
    label: 'Tasdiqlangan',
    bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d',
    icon: <CheckCircle2 size={9} />,
  }
  if (ad.status === 'in_progress') return {
    label: 'Jarayonda',
    bg: '#eef2ff', border: '#c7d2fe', color: '#4338ca',
    icon: <Clock size={9} />,
  }
  if (ad.status === 'closed') return {
    label: 'Yopilgan',
    bg: '#f8fafc', border: '#e2e8f0', color: '#64748b',
    icon: <CheckCircle2 size={9} />,
  }
  if (ad.status === 'rejected') return {
    label: 'Rad etilgan',
    bg: '#fef2f2', border: '#fecaca', color: '#b91c1c',
    icon: <XCircle size={9} />,
  }
  if (ad.status === 'auto_rejected') return {
    label: 'Auto-rad',
    bg: '#fef2f2', border: '#fecaca', color: '#b91c1c',
    icon: <XCircle size={9} />,
  }
  return {
    label: ad.status,
    bg: '#f8fafc', border: '#e2e8f0', color: '#64748b',
    icon: <FileText size={9} />,
  }
}

function getRiskLevel(score: number) {
  if (score >= 70) return { bg: '#fef2f2', color: '#b91c1c' }
  if (score >= 30) return { bg: '#fef3c7', color: '#92400e' }
  return { bg: '#f8fafc', color: '#64748b' }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'hozir'
  if (minutes < 60) return `${minutes} daq oldin`
  if (hours < 24) return `${hours} soat oldin`
  if (days < 7) return `${days} kun oldin`
  return new Date(iso).toLocaleDateString('uz-UZ')
}
