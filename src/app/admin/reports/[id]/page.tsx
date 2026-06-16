// ════════════════════════════════════════════════
// ADMIN — Shikoyat tafsiloti
// /src/app/admin/reports/[id]/page.tsx
// ════════════════════════════════════════════════

import { getAdminFromCookie } from '@/lib/admin-auth'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import {
  ChevronLeft, Flag, User, Calendar, AlertTriangle, Megaphone,
  Star, MessageSquare, Shield, Ban, FileText, Clock
} from 'lucide-react'
import ResolveActions from './ResolveActions'

async function getDetails(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data, error } = await supabase.rpc('admin_get_report_details', { p_report_id: id })
  if (error || !data || !data.id) return null
  return data
}

const REASON_LABELS: Record<string, string> = {
  spam: 'Spam yoki reklama', fraud: 'Firibgarlik', harassment: 'Haqorat yoki tahdid',
  misinformation: 'Yolg\'on ma\'lumot', private_info: 'Maxfiy ma\'lumot oshkor qilingan',
  copyright: 'Mualliflik huquqi buzilgan', inappropriate: 'Nomaqbul kontent', other: 'Boshqa sabab',
}

const TYPE_INFO: Record<string, { label: string, icon: any, color: string }> = {
  ad: { label: 'E\'lon', icon: Megaphone, color: '#ea580c' },
  review: { label: 'Sharh', icon: Star, color: '#d97706' },
  user: { label: 'Foydalanuvchi', icon: User, color: '#4338ca' },
  message: { label: 'Xabar', icon: MessageSquare, color: '#0891b2' },
}

export default async function AdminReportDetailPage({ params }: { params: { id: string } }) {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  const report = await getDetails(params.id)
  if (!report) notFound()

  const typeInfo = TYPE_INFO[report.target_type] || TYPE_INFO.ad
  const TypeIcon = typeInfo.icon
  const target = report.target || {}
  const isResolved = report.status === 'resolved' || report.status === 'rejected'

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Link href="/admin/reports" style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        fontSize: 12, color: '#64748b', textDecoration: 'none',
        marginBottom: 14, fontWeight: 500,
      }}>
        <ChevronLeft size={14} /> Shikoyatlar ro'yxatiga qaytish
      </Link>

      {/* Resolved banner */}
      {isResolved && (
        <div style={{
          background: report.status === 'resolved' ? '#f0fdf4' : '#f8fafc',
          border: `1px solid ${report.status === 'resolved' ? '#bbf7d0' : '#e2e8f0'}`,
          borderRadius: 12, padding: '12px 16px', marginBottom: 14,
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: report.status === 'resolved' ? '#15803d' : '#64748b', marginBottom: 2 }}>
            {report.status === 'resolved' ? '✓ Hal qilingan' : 'Rad etilgan'}
          </div>
          <div style={{ fontSize: 11.5, color: '#64748b' }}>
            {report.resolved_by && `Admin ${report.resolved_by} · `}
            {report.resolved_at && new Date(report.resolved_at).toLocaleString('uz-UZ')}
            {report.resolution_note && ` · ${report.resolution_note}`}
          </div>
        </div>
      )}

      {/* Reason header */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 44, height: 44, background: '#fef2f2', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Flag size={20} color="#dc2626" />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>
              {REASON_LABELS[report.reason] || report.reason}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <TypeIcon size={12} color={typeInfo.color} /> {typeInfo.label}
              </span>
              {report.all_reports && report.all_reports.length > 1 && (
                <span style={{
                  padding: '2px 8px', background: '#fef3c7', color: '#92400e',
                  borderRadius: 999, fontSize: 10, fontWeight: 700,
                }}>
                  {report.all_reports.length} ta shikoyat
                </span>
              )}
            </div>
          </div>
        </div>

        {report.details && (
          <div style={{
            padding: '12px 14px', background: '#f8fafc', borderRadius: 10,
            fontSize: 13, color: '#334155', lineHeight: 1.55,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4, textTransform: 'uppercase' }}>
              Shikoyatchi izohi
            </div>
            {report.details}
          </div>
        )}

        {/* Reporter */}
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f5f9', fontSize: 12, color: '#64748b' }}>
          <strong>Shikoyatchi:</strong> {report.reporter?.full_name || report.reporter?.username} (@{report.reporter?.username})
          {' · '}
          {new Date(report.created_at).toLocaleString('uz-UZ')}
        </div>
      </div>

      {/* Target content */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <TypeIcon size={15} color="#0f172a" />
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
            Shikoyat qilingan {typeInfo.label.toLowerCase()}
          </h2>
        </div>

        <TargetContent type={report.target_type} target={target} />
      </div>

      {/* All reports (agar bir nechta bo'lsa) */}
      {report.all_reports && report.all_reports.length > 1 && (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20, marginBottom: 14 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
            Barcha shikoyatlar ({report.all_reports.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {report.all_reports.map((r: any) => (
              <div key={r.id} style={{ padding: '10px 12px', background: '#f8fafc', borderRadius: 9 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#b91c1c' }}>
                    {REASON_LABELS[r.reason] || r.reason}
                  </span>
                  <span style={{ fontSize: 10, color: '#94a3b8' }}>
                    {new Date(r.created_at).toLocaleDateString('uz-UZ')}
                  </span>
                </div>
                {r.details && <p style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.4 }}>{r.details}</p>}
                <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 3 }}>
                  {r.reporter?.full_name || r.reporter?.username}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {!isResolved && (
        <ResolveActions
          reportId={report.id}
          targetType={report.target_type}
          targetOwnerBlocked={target.poster_is_blocked || target.is_blocked || false}
        />
      )}
    </div>
  )
}

function TargetContent({ type, target }: { type: string, target: any }) {
  if (!target || !target.id) {
    return (
      <div style={{ padding: 20, textAlign: 'center', background: '#f8fafc', borderRadius: 10, fontSize: 13, color: '#94a3b8' }}>
        Obyekt o'chirilgan yoki topilmadi
      </div>
    )
  }

  if (type === 'ad') {
    return (
      <div>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{target.title}</h3>
        <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, marginBottom: 12, whiteSpace: 'pre-wrap' }}>
          {target.description}
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 11, color: '#64748b' }}>
          <Badge>{target.category}</Badge>
          <Badge>Status: {target.status}</Badge>
        </div>
        <PosterInfo target={target} role={target.poster_role} username={target.poster_username} fullName={target.poster_full_name} blocked={target.poster_is_blocked} />
      </div>
    )
  }

  if (type === 'review') {
    return (
      <div>
        <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={16} fill={i <= target.rating ? '#fbbf24' : 'none'} color={i <= target.rating ? '#fbbf24' : '#cbd5e1'} />
          ))}
        </div>
        <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, marginBottom: 12 }}>
          {target.comment || '(izoh yo\'q)'}
        </p>
        {target.is_hidden && <Badge color="#dc2626">Yashirilgan</Badge>}
        <PosterInfo role="client" username={target.client_username} fullName={target.client_full_name} label="Sharh muallifi" />
      </div>
    )
  }

  if (type === 'user') {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, #4338ca, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 20, fontWeight: 700,
          }}>
            {(target.full_name || target.username || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
              {target.full_name || target.username}
            </div>
            <div style={{ fontSize: 12, color: '#64748b' }}>@{target.username} · {target.role}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {target.is_blocked && <Badge color="#dc2626">Bloklangan</Badge>}
          {target.warnings_count > 0 && <Badge color="#d97706">{target.warnings_count} ogohlantirish</Badge>}
          <Badge>Ro'yxat: {new Date(target.created_at).toLocaleDateString('uz-UZ')}</Badge>
        </div>
      </div>
    )
  }

  if (type === 'message') {
    return (
      <div>
        <div style={{
          padding: '12px 14px', background: '#f8fafc', borderRadius: 10,
          fontSize: 13, color: '#334155', lineHeight: 1.55, marginBottom: 12,
        }}>
          {target.content}
        </div>
        {target.is_hidden && <Badge color="#dc2626">Yashirilgan</Badge>}
        <PosterInfo role="" username={target.sender_username} fullName={target.sender_full_name} label="Xabar muallifi" />
      </div>
    )
  }

  return null
}

function PosterInfo({ target, role, username, fullName, blocked, label = 'Muallif' }: any) {
  return (
    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{label}:</span>
      <span style={{ fontSize: 12, color: '#0f172a', fontWeight: 600 }}>{fullName || username}</span>
      <span style={{ fontSize: 11, color: '#64748b' }}>@{username}</span>
      {role && (
        <span style={{
          padding: '1px 6px', background: role === 'lawyer' ? '#eef2ff' : '#f0fdf4',
          color: role === 'lawyer' ? '#4338ca' : '#16a34a', borderRadius: 4,
          fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
        }}>
          {role === 'lawyer' ? 'Yurist' : role === 'client' ? 'Mijoz' : role}
        </span>
      )}
      {blocked && <Ban size={12} color="#dc2626" />}
    </div>
  )
}

function Badge({ children, color = '#64748b' }: any) {
  return (
    <span style={{
      padding: '3px 9px',
      background: color === '#64748b' ? '#f1f5f9' : color + '15',
      color, borderRadius: 6, fontSize: 11, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      {children}
    </span>
  )
}
