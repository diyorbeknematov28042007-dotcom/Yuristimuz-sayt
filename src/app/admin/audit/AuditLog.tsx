// ════════════════════════════════════════════════
// ADMIN — Audit log (Client)
// /src/app/admin/audit/AuditLog.tsx
// Admin amallari jurnali — kim, qachon, nimani qildi
// ════════════════════════════════════════════════

'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  ShieldCheck, ShieldX, RotateCcw, CheckCircle2, XCircle, Ban,
  AlertTriangle, Flag, EyeOff, Trash2, Loader2, ScrollText,
  Clock, Calendar, User, Filter
} from 'lucide-react'

interface AuditEntry {
  id: string
  admin_username: string
  action: string
  target_type: string | null
  target_id: string | null
  target_label: string | null
  details: string | null
  metadata: any
  created_at: string
}

interface Counts {
  total: number
  today: number
  this_week: number
  by_action: { action: string; count: number }[] | null
  by_admin: { admin: string; count: number }[] | null
}

// Har bir amal turi uchun ko'rinish
const ACTION_INFO: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  lawyer_verified: { label: 'Yurist tasdiqlandi', icon: ShieldCheck, color: '#16a34a', bg: '#f0fdf4' },
  lawyer_rejected: { label: 'Yurist rad etildi', icon: ShieldX, color: '#dc2626', bg: '#fef2f2' },
  lawyer_reset: { label: 'Yurist holati tiklandi', icon: RotateCcw, color: '#0891b2', bg: '#ecfeff' },
  ad_approved: { label: 'E\'lon tasdiqlandi', icon: CheckCircle2, color: '#16a34a', bg: '#f0fdf4' },
  ad_rejected: { label: 'E\'lon rad etildi', icon: XCircle, color: '#dc2626', bg: '#fef2f2' },
  report_resolved: { label: 'Shikoyat hal qilindi', icon: Flag, color: '#d97706', bg: '#fffbeb' },
  user_blocked: { label: 'Foydalanuvchi bloklandi', icon: Ban, color: '#dc2626', bg: '#fef2f2' },
  user_unblocked: { label: 'Blokdan chiqarildi', icon: ShieldCheck, color: '#16a34a', bg: '#f0fdf4' },
  user_warned: { label: 'Ogohlantirish berildi', icon: AlertTriangle, color: '#d97706', bg: '#fffbeb' },
}

function actionInfo(action: string) {
  return ACTION_INFO[action] || { label: action, icon: ScrollText, color: '#64748b', bg: '#f8fafc' }
}

const TARGET_LABELS: Record<string, string> = {
  lawyer: 'Yurist', ad: 'E\'lon', report: 'Shikoyat', user: 'Foydalanuvchi', message: 'Xabar', review: 'Sharh',
}

export default function AuditLog({ initialCounts, initialLogs }: { initialCounts: Counts, initialLogs: AuditEntry[] }) {
  const [counts] = useState(initialCounts)
  const [logs, setLogs] = useState(initialLogs)
  const [actionFilter, setActionFilter] = useState<string | null>(null)
  const [adminFilter, setAdminFilter] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    supabase.rpc('admin_get_audit_log', {
      p_action_filter: actionFilter,
      p_admin_filter: adminFilter,
      p_target_type: null,
      p_limit: 200,
    }).then(({ data }) => {
      if (data) setLogs(data)
      setLoading(false)
    })
  }, [actionFilter, adminFilter])

  // Sanaga ko'ra guruhlash
  const grouped = groupByDate(logs)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px', marginBottom: 4 }}>
          Audit log
        </h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          Admin amallari jurnali — kim, qachon va nimani qilgani
        </p>
      </div>

      {/* Statistika kartalari */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
        <StatBox icon={ScrollText} label="Jami amallar" value={counts.total} color="#4338ca" />
        <StatBox icon={Clock} label="Bugun" value={counts.today} color="#16a34a" />
        <StatBox icon={Calendar} label="Bu hafta" value={counts.this_week} color="#0891b2" />
      </div>

      {/* Filtrlar */}
      <div style={{ marginBottom: 16 }}>
        {/* Amal turi bo'yicha */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6, marginBottom: 8 }}>
          <FilterChip active={actionFilter === null} onClick={() => setActionFilter(null)} icon={Filter}>
            Barcha amallar
          </FilterChip>
          {counts.by_action?.map((a) => {
            const info = actionInfo(a.action)
            return (
              <FilterChip key={a.action} active={actionFilter === a.action} onClick={() => setActionFilter(a.action)} icon={info.icon} iconColor={info.color}>
                {info.label} ({a.count})
              </FilterChip>
            )
          })}
        </div>

        {/* Admin bo'yicha (agar bir nechta admin bo'lsa) */}
        {counts.by_admin && counts.by_admin.length > 1 && (
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
            <FilterChip active={adminFilter === null} onClick={() => setAdminFilter(null)} icon={User}>
              Barcha adminlar
            </FilterChip>
            {counts.by_admin.map((a) => (
              <FilterChip key={a.admin} active={adminFilter === a.admin} onClick={() => setAdminFilter(a.admin)} icon={User}>
                {a.admin} ({a.count})
              </FilterChip>
            ))}
          </div>
        )}
      </div>

      {/* Timeline */}
      {loading ? (
        <div style={{ padding: 60, textAlign: 'center' }}>
          <Loader2 size={20} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      ) : logs.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14 }}>
          <ScrollText size={32} color="#cbd5e1" style={{ marginBottom: 10 }} />
          <p style={{ fontSize: 13, fontWeight: 500, color: '#64748b' }}>
            {actionFilter || adminFilter ? 'Bu filtr bo\'yicha amal topilmadi' : 'Hali hech qanday amal qilinmagan'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {grouped.map((group) => (
            <div key={group.date}>
              {/* Sana sarlavhasi */}
              <div style={{
                fontSize: 12, fontWeight: 700, color: '#64748b',
                marginBottom: 10, paddingLeft: 4, textTransform: 'uppercase', letterSpacing: '0.3px',
              }}>
                {group.label}
              </div>

              {/* Shu kungi amallar */}
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
                {group.entries.map((entry, idx) => (
                  <AuditRow key={entry.id} entry={entry} isLast={idx === group.entries.length - 1} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function AuditRow({ entry, isLast }: { entry: AuditEntry, isLast: boolean }) {
  const info = actionInfo(entry.action)
  const Icon = info.icon

  // metadata'dan qo'shimcha ma'lumot
  let metaText = ''
  if (entry.metadata) {
    if (entry.metadata.permanent) metaText = 'doimiy'
    else if (entry.metadata.block_days) metaText = `${entry.metadata.block_days} kun`
  }

  return (
    <div style={{
      display: 'flex', gap: 12, padding: '13px 16px',
      borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
    }}>
      {/* Ikon */}
      <div style={{
        width: 34, height: 34, borderRadius: 9, background: info.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={16} color={info.color} />
      </div>

      {/* Tafsilot */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{info.label}</span>
          {metaText && (
            <span style={{
              padding: '1px 7px', background: '#f1f5f9', color: '#64748b',
              borderRadius: 5, fontSize: 10, fontWeight: 700,
            }}>{metaText}</span>
          )}
        </div>

        {/* Target */}
        {entry.target_label && (
          <div style={{ fontSize: 12.5, color: '#334155', marginBottom: entry.details ? 3 : 0 }}>
            {entry.target_type && (
              <span style={{ color: '#94a3b8' }}>{TARGET_LABELS[entry.target_type] || entry.target_type}: </span>
            )}
            <span style={{ fontWeight: 500 }}>{entry.target_label}</span>
          </div>
        )}

        {/* Sabab/izoh */}
        {entry.details && (
          <div style={{
            fontSize: 11.5, color: '#64748b', lineHeight: 1.45,
            background: '#f8fafc', padding: '6px 10px', borderRadius: 7, marginTop: 4,
          }}>
            {entry.details}
          </div>
        )}

        {/* Admin + vaqt */}
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <User size={10} /> {entry.admin_username}
          </span>
          <span>·</span>
          <span>{fmtTime(entry.created_at)}</span>
        </div>
      </div>
    </div>
  )
}

function StatBox({ icon: Icon, label, value, color }: any) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 14 }}>
      <Icon size={15} color={color} style={{ marginBottom: 8 }} />
      <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>{label}</div>
    </div>
  )
}

function FilterChip({ active, onClick, icon: Icon, iconColor, children }: any) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px',
      background: active ? '#0f172a' : '#fff',
      color: active ? '#fff' : '#475569',
      border: `1px solid ${active ? '#0f172a' : '#e2e8f0'}`,
      borderRadius: 8, fontSize: 11.5, fontWeight: 600,
      cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: 'inherit',
    }}>
      {Icon && <Icon size={12} color={active ? '#fff' : (iconColor || '#94a3b8')} />}
      {children}
    </button>
  )
}

// ─── Helpers ───
function groupByDate(logs: AuditEntry[]) {
  const groups: { date: string; label: string; entries: AuditEntry[] }[] = []
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)

  for (const entry of logs) {
    const d = new Date(entry.created_at)
    const dateKey = d.toISOString().split('T')[0]
    let group = groups.find(g => g.date === dateKey)
    if (!group) {
      const ed = new Date(d); ed.setHours(0, 0, 0, 0)
      let label: string
      if (ed.getTime() === today.getTime()) label = 'Bugun'
      else if (ed.getTime() === yesterday.getTime()) label = 'Kecha'
      else label = d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
      group = { date: dateKey, label, entries: [] }
      groups.push(group)
    }
    group.entries.push(entry)
  }
  return groups
}

function fmtTime(iso: string): string {
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000)
  if (m < 1) return 'hozir'
  if (m < 60) return `${m} daqiqa oldin`
  if (h < 24) return `${h} soat oldin`
  return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
}
