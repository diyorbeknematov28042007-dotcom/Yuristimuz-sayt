// ════════════════════════════════════════════════
// MENING E'LONLARIM SAHIFASI
// /src/app/dashboard/my-ads/page.tsx
// ════════════════════════════════════════════════

'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import {
  Plus, MapPin, X, Trash2, CheckCircle2, Clock, AlertCircle,
  Eye, Calendar, AlertTriangle, Loader2, FileText, ChevronLeft
} from 'lucide-react'
import AdTermsModal from '@/components/AdTermsModal'
import AdFormModal from '@/components/AdFormModal'
import { formatPrice, formatAdDate } from '@/lib/ads-constants'

interface MyAd {
  id: string
  title: string
  description: string
  category: string
  categories?: string[]
  is_negotiable?: boolean
  city: string | null
  budget_min: number | null
  budget_max: number | null
  status: string
  views_count: number
  created_at: string
  updated_at: string
  poster_role: string
  responses_count: number
  moderation_score: number
  moderation_reason: string | null
  rejected_at: string | null
  approved_at: string | null
}

type StatusFilter = 'all' | 'open' | 'pending_review' | 'rejected' | 'in_progress' | 'closed'

export default function MyAdsPage() {
  const [user, setUser] = useState<any>(null)
  const [ads, setAds] = useState<MyAd[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [showCreate, setShowCreate] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [statusInfo, setStatusInfo] = useState<{ riskLevel: 'low' | 'medium' | 'high', message: string } | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<MyAd | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => {
      setUser(d.user)
      if (d.user) fetchMyAds(d.user.id)
    })
  }, [])

  const fetchMyAds = async (userId: string) => {
    setLoading(true)
    const { data, error } = await supabase.rpc('get_my_ads', {
      p_user_id: userId,
      p_status: null,
    })
    if (!error) setAds(data || [])
    setLoading(false)
  }

  const filteredAds = ads.filter(a => {
    if (filter === 'all') return true
    if (filter === 'rejected') return a.status === 'rejected' || a.status === 'auto_rejected'
    return a.status === filter
  })

  // Count'lar
  const counts = {
    all: ads.length,
    open: ads.filter(a => a.status === 'open').length,
    pending_review: ads.filter(a => a.status === 'pending_review').length,
    rejected: ads.filter(a => a.status === 'rejected' || a.status === 'auto_rejected').length,
    in_progress: ads.filter(a => a.status === 'in_progress').length,
    closed: ads.filter(a => a.status === 'closed').length,
  }

  // E'lon muvaffaqiyatli yaratildi (AdFormModal'dan)
  const handleAdSuccess = (d: any) => {
    setShowCreate(false)
    if (d.riskLevel && d.message) {
      setStatusInfo({ riskLevel: d.riskLevel, message: d.message })
      setTimeout(() => setStatusInfo(null), 12000)
    }
    if (user) fetchMyAds(user.id)
  }

  // E'lon o'chirish
  const handleDelete = async () => {
    if (!deleteConfirm || deleting) return
    setDeleting(true)
    try {
      const res = await fetch('/api/ads/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId: deleteConfirm.id }),
      })
      const d = await res.json()
      if (!res.ok) {
        alert(d.error || "O'chirishda xato")
      } else {
        setAds(prev => prev.filter(a => a.id !== deleteConfirm.id))
        setDeleteConfirm(null)
      }
    } catch (err: any) {
      alert("Tarmoq xatosi: " + err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/dashboard/ads" style={{
            display: 'flex', alignItems: 'center', gap: 4,
            color: '#64748b', textDecoration: 'none', fontSize: 12, fontWeight: 500,
          }}>
            <ChevronLeft size={14} />
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px' }}>
            Mening e'lonlarim
          </h1>
        </div>
        <button onClick={() => setShowCreate(true)} style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: '#0f172a', color: '#fff', border: 'none',
          padding: '10px 16px', borderRadius: 11,
          fontSize: 13, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(15,23,42,0.2)',
        }}>
          <Plus size={14} /> Yangi
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{
        display: 'flex', gap: 6, overflowX: 'auto',
        marginBottom: 14, paddingBottom: 4,
      }}>
        {([
          { id: 'all' as StatusFilter, label: 'Hammasi', count: counts.all, color: '#64748b' },
          { id: 'open' as StatusFilter, label: 'Faol', count: counts.open, color: '#16a34a' },
          { id: 'pending_review' as StatusFilter, label: 'Kutilmoqda', count: counts.pending_review, color: '#d97706' },
          { id: 'rejected' as StatusFilter, label: 'Rad etilgan', count: counts.rejected, color: '#dc2626' },
          { id: 'in_progress' as StatusFilter, label: 'Jarayonda', count: counts.in_progress, color: '#4338ca' },
          { id: 'closed' as StatusFilter, label: 'Yopilgan', count: counts.closed, color: '#94a3b8' },
        ]).map(tab => {
          const isActive = filter === tab.id
          return (
            <button key={tab.id} onClick={() => setFilter(tab.id)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 12px',
              background: isActive ? '#0f172a' : '#fff',
              color: isActive ? '#fff' : '#475569',
              border: `1px solid ${isActive ? '#0f172a' : '#e2e8f0'}`,
              borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
              fontFamily: 'inherit',
            }}>
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  background: isActive ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                  color: isActive ? '#fff' : tab.color,
                  padding: '1px 6px', borderRadius: 999,
                  fontSize: 10, fontWeight: 700,
                }}>{tab.count}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : filteredAds.length === 0 ? (
        <div style={{
          padding: 60, textAlign: 'center',
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: 14,
        }}>
          <FileText size={32} color="#cbd5e1" style={{ marginBottom: 10 }} />
          <p style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginBottom: 14 }}>
            {filter === 'all'
              ? "Sizning hali e'lonlaringiz yo'q"
              : "Bu kategoriya bo'yicha e'lon yo'q"}
          </p>
          {filter === 'all' && (
            <button onClick={() => setShowCreate(true)} style={{
              padding: '10px 18px', background: '#0f172a',
              color: '#fff', border: 'none', borderRadius: 10,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              Birinchi e'lon yarating
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredAds.map(ad => (
            <MyAdCard key={ad.id} ad={ad} onDelete={() => setDeleteConfirm(ad)} />
          ))}
        </div>
      )}

      {/* E'lon yaratish modali (umumiy komponent) */}
      {showCreate && (
        <AdFormModal
          userRole={user?.role}
          onClose={() => setShowCreate(false)}
          onSuccess={handleAdSuccess}
          onNeedsTerms={() => { setShowCreate(false); setShowTerms(true) }}
        />
      )}

      {/* Etika modal */}
      {showTerms && <AdTermsModal onAccept={handleTermsAccepted} onCancel={() => setShowTerms(false)} />}

      {/* Status banner */}
      {statusInfo && <StatusBanner info={statusInfo} onClose={() => setStatusInfo(null)} />}

      {/* Delete tasdiqlash modal */}
      {deleteConfirm && (
        <DeleteConfirmModal
          ad={deleteConfirm}
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirm(null)}
          deleting={deleting}
        />
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────
// Mening e'lon kartochkasi
// ─────────────────────────────────────────
function MyAdCard({ ad, onDelete }: { ad: MyAd, onDelete: () => void }) {
  const status = getStatusInfo(ad)

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 14,
      padding: 16,
      position: 'relative',
    }}>
      {/* Top - status + delete */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 10px',
          background: status.bg, border: `1px solid ${status.border}`,
          borderRadius: 999, fontSize: 11, fontWeight: 700,
          color: status.color,
        }}>
          {status.icon}
          {status.label}
        </div>
        <button onClick={onDelete} aria-label="O'chirish" style={{
          background: '#fef2f2', color: '#dc2626',
          border: 'none', borderRadius: 8,
          padding: 6, cursor: 'pointer',
          display: 'flex',
        }}>
          <Trash2 size={13} />
        </button>
      </div>

      {/* Title + description */}
      <h3 style={{ fontSize: 14.5, fontWeight: 700, color: '#0f172a', marginBottom: 6, lineHeight: 1.35 }}>
        {ad.title}
      </h3>
      <p style={{
        fontSize: 12.5, color: '#64748b', lineHeight: 1.55, marginBottom: 10,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {ad.description}
      </p>

      {/* Moderation message (agar bor bo'lsa) */}
      {(ad.status === 'rejected' || ad.status === 'auto_rejected') && ad.moderation_reason && (
        <div style={{
          padding: '10px 12px',
          background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 10, marginBottom: 10,
          fontSize: 11.5, color: '#991b1b', lineHeight: 1.5,
        }}>
          <strong>Rad etish sababi:</strong> {ad.moderation_reason}
        </div>
      )}

      {ad.status === 'pending_review' && (
        <div style={{
          padding: '10px 12px',
          background: '#fef3c7', border: '1px solid #fde68a',
          borderRadius: 10, marginBottom: 10,
          fontSize: 11.5, color: '#92400e', lineHeight: 1.5,
        }}>
          <strong>⏳ Admin tasdiqlashini kutmoqda.</strong> Saytda ko'rinmaydi.
        </div>
      )}

      {/* Meta */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        fontSize: 11, color: '#94a3b8',
      }}>
        {/* Yo'nalishlar (bir nechta bo'lishi mumkin) */}
        {(ad.categories && ad.categories.length > 0 ? ad.categories : [ad.category]).map((cat, i) => (
          <span key={i} style={{
            padding: '2px 7px', background: '#eef2ff', color: '#4338ca',
            borderRadius: 5, fontSize: 10, fontWeight: 700, letterSpacing: '0.3px',
          }}>
            {cat}
          </span>
        ))}
        {ad.city && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <MapPin size={10} /> {ad.city}
          </span>
        )}
        {/* Narx — yashil ramka (audit B1) */}
        {ad.budget_min && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#15803d', fontWeight: 700, background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '3px 9px', borderRadius: 7 }}>
            {formatPrice(ad.budget_min)}{ad.budget_max ? ` – ${formatPrice(ad.budget_max)}` : ''} so'm{ad.is_negotiable ? ' dan' : ''}
          </span>
        )}
        {/* Ko'rishlar — sariq ramka (audit B3) */}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#a16207', fontWeight: 600, background: '#fefce8', border: '1px solid #fef08a', padding: '3px 9px', borderRadius: 7 }}>
          <Eye size={11} /> {ad.views_count}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Calendar size={10} /> {formatAdDate(ad.created_at)}
        </span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Status info helper
// ─────────────────────────────────────────
function getStatusInfo(ad: MyAd) {
  if (ad.status === 'open') return {
    label: 'Faol', bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d',
    icon: <CheckCircle2 size={11} />,
  }
  if (ad.status === 'pending_review') return {
    label: 'Tekshirilmoqda', bg: '#fef3c7', border: '#fde68a', color: '#92400e',
    icon: <Clock size={11} />,
  }
  if (ad.status === 'rejected' || ad.status === 'auto_rejected') return {
    label: 'Rad etilgan', bg: '#fef2f2', border: '#fecaca', color: '#b91c1c',
    icon: <AlertCircle size={11} />,
  }
  if (ad.status === 'in_progress') return {
    label: 'Jarayonda', bg: '#eef2ff', border: '#c7d2fe', color: '#4338ca',
    icon: <Clock size={11} />,
  }
  if (ad.status === 'closed') return {
    label: 'Yopilgan', bg: '#f8fafc', border: '#e2e8f0', color: '#64748b',
    icon: <CheckCircle2 size={11} />,
  }
  return {
    label: ad.status, bg: '#f8fafc', border: '#e2e8f0', color: '#64748b',
    icon: <FileText size={11} />,
  }
}


// ─────────────────────────────────────────
// Status banner
// ─────────────────────────────────────────
function StatusBanner({ info, onClose }: any) {
  const colors = {
    low: { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', accent: '#16a34a' },
    medium: { bg: '#fef3c7', border: '#fde68a', text: '#92400e', accent: '#d97706' },
    high: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', accent: '#dc2626' },
  }[info.riskLevel as 'low' | 'medium' | 'high']

  return (
    <div style={{
      position: 'fixed', bottom: 20, left: 16, right: 16, maxWidth: 520,
      margin: '0 auto', padding: '16px 18px',
      background: colors.bg, border: `1px solid ${colors.border}`,
      borderRadius: 14, boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
      zIndex: 90, display: 'flex', gap: 12, alignItems: 'flex-start',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: colors.accent, color: '#fff', fontSize: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, fontWeight: 700,
      }}>
        {info.riskLevel === 'low' ? '✓' : info.riskLevel === 'medium' ? '⏳' : '⚠'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 4 }}>
          {info.riskLevel === 'low' ? 'Avtomatik tasdiqlandi' :
           info.riskLevel === 'medium' ? 'Joylashtirildi (tekshiriladi)' :
           'Tekshirish kutilmoqda'}
        </div>
        <div style={{ fontSize: 12, lineHeight: 1.55, color: colors.text }}>
          {info.message}
        </div>
      </div>
      <button onClick={onClose} style={{
        background: 'transparent', border: 'none', cursor: 'pointer',
        padding: 4, color: '#64748b', display: 'flex',
        alignSelf: 'flex-start',
      }}>
        <X size={14} />
      </button>
    </div>
  )
}

// ─────────────────────────────────────────
// Delete confirm modal
// ─────────────────────────────────────────
function DeleteConfirmModal({ ad, onConfirm, onCancel, deleting }: any) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)',
      zIndex: 110, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: 16, backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16,
        maxWidth: 400, width: '100%', padding: 22,
      }}>
        <div style={{
          width: 44, height: 44, background: '#fef2f2',
          border: '1px solid #fecaca', borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 14,
        }}>
          <AlertTriangle size={20} color="#dc2626" />
        </div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
          E'lonni o'chirish?
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.55, marginBottom: 14 }}>
          <strong>"{ad.title}"</strong> e'lonini butunlay o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onCancel} disabled={deleting} style={{
            flex: 1, padding: '11px 14px',
            background: '#fff', color: '#64748b',
            border: '1px solid #e2e8f0', borderRadius: 10,
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            Bekor
          </button>
          <button onClick={onConfirm} disabled={deleting} style={{
            flex: 1, padding: '11px 14px',
            background: '#dc2626', color: '#fff',
            border: 'none', borderRadius: 10,
            fontSize: 13, fontWeight: 600,
            cursor: deleting ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontFamily: 'inherit',
          }}>
            {deleting ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={13} />}
            O'chirish
          </button>
        </div>
      </div>
    </div>
  )
}
