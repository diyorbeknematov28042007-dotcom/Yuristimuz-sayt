// ════════════════════════════════════════════════
// ADMIN — Shikoyatlar ro'yxati (Client)
// /src/app/admin/reports/ReportsList.tsx
// ════════════════════════════════════════════════

'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  Flag, Clock, CheckCircle2, XCircle, AlertTriangle, ChevronRight,
  Loader2, FileText, MessageSquare, User, Star, Megaphone
} from 'lucide-react'

interface Report {
  id: string
  target_type: string
  target_id: string
  reason: string
  details: string | null
  status: string
  created_at: string
  reporter_id: string
  reporter_username: string
  reporter_full_name: string
  reports_count: number
  target_preview: string | null
}

interface Counts {
  all: number; pending: number; reviewing: number; resolved: number; rejected: number
}

type FilterType = 'pending' | 'resolved' | 'rejected' | 'all'

const REASON_LABELS: Record<string, string> = {
  spam: 'Spam', fraud: 'Firibgarlik', harassment: 'Haqorat',
  misinformation: 'Yolg\'on ma\'lumot', private_info: 'Maxfiy ma\'lumot',
  copyright: 'Mualliflik huquqi', inappropriate: 'Nomaqbul', other: 'Boshqa',
}

const TYPE_INFO: Record<string, { label: string, icon: any, color: string }> = {
  ad: { label: 'E\'lon', icon: Megaphone, color: '#ea580c' },
  review: { label: 'Sharh', icon: Star, color: '#d97706' },
  user: { label: 'Foydalanuvchi', icon: User, color: '#4338ca' },
  message: { label: 'Xabar', icon: MessageSquare, color: '#0891b2' },
}

export default function ReportsList({ initialCounts, initialReports }: { initialCounts: Counts, initialReports: Report[] }) {
  const [counts, setCounts] = useState(initialCounts)
  const [reports, setReports] = useState(initialReports)
  const [filter, setFilter] = useState<FilterType>('pending')
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    supabase.rpc('admin_get_reports', {
      p_filter: filter, p_target_type: typeFilter, p_limit: 100
    }).then(({ data }) => {
      if (data) setReports(data)
      supabase.rpc('admin_get_report_counts').then(({ data: c }) => {
        if (c) setCounts(c)
        setLoading(false)
      })
    })
  }, [filter, typeFilter])

  const tabs = [
    { id: 'pending' as FilterType, label: 'Kutilmoqda', count: counts.pending, color: '#d97706' },
    { id: 'resolved' as FilterType, label: 'Hal qilingan', count: counts.resolved, color: '#16a34a' },
    { id: 'rejected' as FilterType, label: 'Rad etilgan', count: counts.rejected, color: '#64748b' },
    { id: 'all' as FilterType, label: 'Hammasi', count: counts.all, color: '#64748b' },
  ]

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px', marginBottom: 4 }}>
          Shikoyatlar
        </h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          Foydalanuvchilardan kelgan shikoyatlarni ko'rib chiqish
        </p>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 12, paddingBottom: 4 }}>
        {tabs.map((tab) => {
          const isActive = filter === tab.id
          return (
            <button key={tab.id} onClick={() => setFilter(tab.id)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 13px',
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
                  padding: '1px 7px', borderRadius: 999, fontSize: 10, fontWeight: 700,
                }}>{tab.count}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Type filter */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 16, paddingBottom: 4 }}>
        <button onClick={() => setTypeFilter(null)} style={{
          padding: '6px 12px',
          background: typeFilter === null ? '#eef2ff' : '#fff',
          color: typeFilter === null ? '#4338ca' : '#64748b',
          border: `1px solid ${typeFilter === null ? '#c7d2fe' : '#e2e8f0'}`,
          borderRadius: 7, fontSize: 11.5, fontWeight: 600,
          cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'inherit',
        }}>
          Barcha turlar
        </button>
        {Object.entries(TYPE_INFO).map(([type, info]) => {
          const Icon = info.icon
          const isActive = typeFilter === type
          return (
            <button key={type} onClick={() => setTypeFilter(type)} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 12px',
              background: isActive ? '#eef2ff' : '#fff',
              color: isActive ? '#4338ca' : '#64748b',
              border: `1px solid ${isActive ? '#c7d2fe' : '#e2e8f0'}`,
              borderRadius: 7, fontSize: 11.5, fontWeight: 600,
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'inherit',
            }}>
              <Icon size={12} color={isActive ? '#4338ca' : info.color} />
              {info.label}
            </button>
          )
        })}
      </div>

      {/* List */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <Loader2 size={20} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : reports.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <Flag size={32} color="#cbd5e1" style={{ marginBottom: 10 }} />
            <p style={{ fontSize: 13, fontWeight: 500, color: '#64748b' }}>
              {filter === 'pending' ? 'Yangi shikoyatlar yo\'q' : 'Shikoyatlar topilmadi'}
            </p>
          </div>
        ) : (
          reports.map((r, idx) => <ReportRow key={r.id} report={r} isLast={idx === reports.length - 1} />)
        )}
      </div>
    </div>
  )
}

function ReportRow({ report, isLast }: { report: Report, isLast: boolean }) {
  const typeInfo = TYPE_INFO[report.target_type] || TYPE_INFO.ad
  const TypeIcon = typeInfo.icon
  const status = getStatusInfo(report.status)

  return (
    <Link href={`/admin/reports/${report.id}`} style={{
      display: 'block', padding: '14px 16px',
      borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
      textDecoration: 'none', color: 'inherit',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 36, height: 36,
          background: typeInfo.color + '15',
          borderRadius: 9,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <TypeIcon size={16} color={typeInfo.color} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
            <span style={{
              padding: '2px 7px', background: '#fef2f2', color: '#b91c1c',
              borderRadius: 5, fontSize: 10, fontWeight: 700,
            }}>
              {REASON_LABELS[report.reason] || report.reason}
            </span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              {typeInfo.label}
            </span>
            {report.reports_count > 1 && (
              <span style={{
                padding: '2px 7px', background: '#fef3c7', color: '#92400e',
                borderRadius: 5, fontSize: 10, fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 3,
              }}>
                <AlertTriangle size={9} /> {report.reports_count} shikoyat
              </span>
            )}
          </div>

          {report.target_preview && (
            <p style={{
              fontSize: 13, color: '#0f172a', fontWeight: 500, marginBottom: 3,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              "{report.target_preview}"
            </p>
          )}

          {report.details && (
            <p style={{
              fontSize: 11.5, color: '#64748b', lineHeight: 1.4, marginBottom: 4,
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
            }}>
              {report.details}
            </p>
          )}

          <div style={{ fontSize: 11, color: '#94a3b8' }}>
            {report.reporter_full_name || report.reporter_username} · {timeAgo(report.created_at)}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', background: status.bg, border: `1px solid ${status.border}`,
            borderRadius: 999, fontSize: 10, fontWeight: 700, color: status.color,
          }}>
            {status.icon} {status.label}
          </div>
          <ChevronRight size={14} color="#cbd5e1" />
        </div>
      </div>
    </Link>
  )
}

function getStatusInfo(status: string) {
  if (status === 'pending') return { label: 'Yangi', bg: '#fef3c7', border: '#fde68a', color: '#92400e', icon: <Clock size={9} /> }
  if (status === 'reviewing') return { label: 'Ko\'rilmoqda', bg: '#eef2ff', border: '#c7d2fe', color: '#4338ca', icon: <Clock size={9} /> }
  if (status === 'resolved') return { label: 'Hal qilindi', bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', icon: <CheckCircle2 size={9} /> }
  if (status === 'rejected') return { label: 'Rad etildi', bg: '#f8fafc', border: '#e2e8f0', color: '#64748b', icon: <XCircle size={9} /> }
  return { label: status, bg: '#f8fafc', border: '#e2e8f0', color: '#64748b', icon: null }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), d = Math.floor(diff / 86400000)
  if (m < 1) return 'hozir'
  if (m < 60) return `${m} daq oldin`
  if (h < 24) return `${h} soat oldin`
  if (d < 7) return `${d} kun oldin`
  return new Date(iso).toLocaleDateString('uz-UZ')
}
