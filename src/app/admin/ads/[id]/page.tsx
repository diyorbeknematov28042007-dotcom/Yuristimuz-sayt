// ════════════════════════════════════════════════
// ADMIN — Bitta e'lon tafsiloti
// /src/app/admin/ads/[id]/page.tsx
// ════════════════════════════════════════════════

import { getAdminFromCookie } from '@/lib/admin-auth'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import {
  ChevronLeft, User, MapPin, Calendar, FileText, DollarSign,
  AlertTriangle, CheckCircle2, XCircle, Clock, Shield,
  Phone, CreditCard, Link2, Volume2, AlertCircle
} from 'lucide-react'
import AdModerationActions from './AdModerationActions'

async function getAdDetails(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data, error } = await supabase.rpc('admin_get_ads', {
    p_filter: 'all',
    p_search: null,
    p_limit: 1000,
  })
  if (error || !data) return null
  return data.find((ad: any) => ad.id === id) || null
}

export default async function AdminAdDetailPage({ params }: { params: { id: string } }) {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  const ad = await getAdDetails(params.id)
  if (!ad) notFound()

  const flags = ad.moderation_flags || {}
  const patternFlags = flags.pattern || {}
  const geminiFlags = flags.gemini || {}

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <Link href="/admin/ads" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 12,
        color: '#64748b',
        textDecoration: 'none',
        marginBottom: 14,
        fontWeight: 500,
      }}>
        <ChevronLeft size={14} />
        E'lonlar ro'yxatiga qaytish
      </Link>

      {/* Status banner */}
      <StatusBanner ad={ad} />

      {/* Main content */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: 22,
        marginBottom: 14,
      }}>
        <h1 style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#0f172a',
          letterSpacing: '-0.3px',
          marginBottom: 10,
          lineHeight: 1.3,
        }}>
          {ad.title}
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          <Badge icon={FileText} label={ad.category} />
          {ad.city && <Badge icon={MapPin} label={ad.city} />}
          {ad.budget_min && (
            <Badge icon={DollarSign} label={
              ad.budget_max
                ? `${ad.budget_min.toLocaleString()} - ${ad.budget_max.toLocaleString()} so'm`
                : `${ad.budget_min.toLocaleString()} so'm dan`
            } />
          )}
          <Badge icon={Calendar} label={new Date(ad.submitted_at).toLocaleString('uz-UZ')} />
        </div>

        <div style={{
          padding: '14px 16px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 10,
          fontSize: 13.5,
          color: '#0f172a',
          lineHeight: 1.65,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          {ad.description}
        </div>
      </div>

      {/* Poster info */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: 18,
        marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <User size={15} color="#0f172a" />
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
            E'lon muallifi
          </h2>
        </div>

        <Link
          href={ad.poster_role === 'lawyer' ? `/admin/lawyers/${ad.poster_id}` : '#'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 12px',
            background: '#f8fafc',
            borderRadius: 10,
            textDecoration: 'none',
            color: 'inherit',
          }}>
          <div style={{
            width: 42, height: 42,
            background: `linear-gradient(135deg, ${stringToColor(ad.poster_username)}aa, ${stringToColor(ad.poster_username)})`,
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 16,
            flexShrink: 0,
          }}>
            {(ad.poster_full_name || ad.poster_username).charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                {ad.poster_full_name || ad.poster_username}
              </span>
              {ad.poster_role === 'lawyer' && ad.poster_is_verified && (
                <Shield size={11} color="#16a34a" />
              )}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', display: 'flex', gap: 8 }}>
              <span>@{ad.poster_username}</span>
              <span style={{
                padding: '1px 6px',
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
            </div>
          </div>
        </Link>
      </div>

      {/* Moderation analysis */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: 18,
        marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <AlertTriangle size={15} color="#0f172a" />
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
            Moderatsiya tahlili
          </h2>
        </div>

        {/* Risk score */}
        <div style={{
          marginBottom: 14,
          padding: '14px 16px',
          background: getRiskBg(ad.moderation_score),
          borderRadius: 10,
        }}>
          <div style={{
            fontSize: 11,
            color: '#64748b',
            marginBottom: 4,
            fontWeight: 600,
          }}>
            Umumiy xavf darajasi
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{
              fontSize: 28,
              fontWeight: 700,
              color: getRiskColor(ad.moderation_score),
              letterSpacing: '-0.5px',
            }}>
              {ad.moderation_score}
            </span>
            <span style={{ fontSize: 13, color: '#64748b' }}>/ 100</span>
            <span style={{
              marginLeft: 'auto',
              fontSize: 11,
              fontWeight: 700,
              color: getRiskColor(ad.moderation_score),
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
            }}>
              {ad.moderation_score < 30 ? 'Past xavf' : ad.moderation_score < 70 ? 'O\'rtacha' : 'Yuqori xavf'}
            </span>
          </div>
        </div>

        {/* Pattern checks */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            🔍 Pattern tekshirish
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <FlagItem
              active={patternFlags.hasPhone}
              icon={Phone}
              label="Telefon raqami"
              detail={patternFlags.hasPhone ? 'Aniqlandi' : 'Yo\'q'}
              warningForRole={ad.poster_role === 'client'}
            />
            <FlagItem
              active={patternFlags.hasCard}
              icon={CreditCard}
              label="Karta raqami"
              detail={patternFlags.hasCard ? 'Aniqlandi (jiddiy)' : 'Yo\'q'}
              critical={patternFlags.hasCard}
            />
            <FlagItem
              active={patternFlags.hasExternalLink}
              icon={Link2}
              label="Tashqi link"
              detail={patternFlags.hasExternalLink ? 'Aniqlandi' : 'Yo\'q'}
              warningForRole={ad.poster_role === 'client'}
            />
            <FlagItem
              active={patternFlags.hasExcessiveCaps}
              icon={Volume2}
              label="Ko'p bosh harf"
              detail={patternFlags.hasExcessiveCaps ? '60%+ bosh harf' : 'Normal'}
            />
            {patternFlags.spamKeywords?.length > 0 && (
              <FlagItem
                active={true}
                icon={AlertCircle}
                label="Spam kalit so'zlar"
                detail={patternFlags.spamKeywords.join(', ')}
                critical={true}
              />
            )}
          </div>
        </div>

        {/* Gemini analysis */}
        {geminiFlags && Object.keys(geminiFlags).length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
              🤖 AI tahlili (Gemini)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <FlagItem
                active={!geminiFlags.is_legal}
                icon={FileText}
                label="Huquqiy mavzu"
                detail={geminiFlags.is_legal ? '✓ Ha' : '✗ Yo\'q'}
                critical={!geminiFlags.is_legal}
              />
              <FlagItem
                active={geminiFlags.is_toxic}
                icon={AlertTriangle}
                label="Haqorat / tahdid"
                detail={geminiFlags.is_toxic ? 'Aniqlandi' : 'Yo\'q'}
                critical={geminiFlags.is_toxic}
              />
              <FlagItem
                active={!geminiFlags.category_match}
                icon={FileText}
                label="Kategoriya mos kelishi"
                detail={geminiFlags.category_match ? '✓ Mos' : '✗ Mos emas'}
              />
              {geminiFlags.gemini_reason && (
                <div style={{
                  marginTop: 6,
                  padding: '10px 12px',
                  background: '#fff7ed',
                  border: '1px solid #fed7aa',
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#9a3412',
                  lineHeight: 1.5,
                }}>
                  <strong>AI sharhi:</strong> {geminiFlags.gemini_reason}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {(ad.status === 'pending_review' || ad.status === 'open' || ad.status === 'rejected' || ad.status === 'auto_rejected') && (
        <AdModerationActions
          adId={ad.id}
          currentStatus={ad.status}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────
// Helper components
// ─────────────────────────────────────────

function StatusBanner({ ad }: { ad: any }) {
  if (ad.status === 'open' && ad.approved_at) {
    return (
      <div style={{
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: 12,
        padding: '12px 16px',
        marginBottom: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <CheckCircle2 size={16} color="#16a34a" />
        <div style={{ flex: 1, fontSize: 12, color: '#15803d' }}>
          <strong>Tasdiqlangan</strong> · {new Date(ad.approved_at).toLocaleString('uz-UZ')}
          {ad.approved_by && ` · admin ${ad.approved_by}`}
        </div>
      </div>
    )
  }
  if (ad.status === 'rejected' || ad.status === 'auto_rejected') {
    return (
      <div style={{
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: 12,
        padding: '12px 16px',
        marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: ad.moderation_reason ? 6 : 0 }}>
          <XCircle size={16} color="#dc2626" />
          <div style={{ flex: 1, fontSize: 12, color: '#991b1b' }}>
            <strong>{ad.status === 'auto_rejected' ? 'Avtomatik rad' : 'Rad etilgan'}</strong>
            {' · '}
            {new Date(ad.rejected_at || ad.created_at).toLocaleString('uz-UZ')}
            {ad.rejected_by && ` · admin ${ad.rejected_by}`}
          </div>
        </div>
        {ad.moderation_reason && (
          <div style={{
            marginLeft: 26,
            padding: '8px 10px',
            background: 'rgba(255,255,255,0.7)',
            borderRadius: 6,
            fontSize: 12,
            color: '#991b1b',
          }}>
            <strong>Sabab:</strong> {ad.moderation_reason}
          </div>
        )}
      </div>
    )
  }
  if (ad.status === 'pending_review') {
    return (
      <div style={{
        background: '#fef3c7',
        border: '1px solid #fde68a',
        borderRadius: 12,
        padding: '12px 16px',
        marginBottom: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <Clock size={16} color="#d97706" />
        <div style={{ flex: 1, fontSize: 12, color: '#92400e' }}>
          <strong>Tekshirish kutilmoqda</strong> · {new Date(ad.submitted_at).toLocaleString('uz-UZ')}
        </div>
      </div>
    )
  }
  return null
}

function Badge({ icon: Icon, label }: any) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '4px 10px',
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: 999,
      fontSize: 11,
      color: '#475569',
      fontWeight: 500,
    }}>
      <Icon size={11} color="#64748b" />
      {label}
    </div>
  )
}

function FlagItem({ active, icon: Icon, label, detail, critical, warningForRole }: any) {
  const color = critical ? '#dc2626' : active ? (warningForRole ? '#d97706' : '#64748b') : '#94a3b8'
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '7px 10px',
      background: active ? (critical ? '#fef2f2' : warningForRole ? '#fff7ed' : '#f8fafc') : 'transparent',
      borderRadius: 8,
      border: active ? `1px solid ${critical ? '#fecaca' : warningForRole ? '#fed7aa' : '#e2e8f0'}` : '1px solid transparent',
    }}>
      <Icon size={12} color={color} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: '#0f172a', fontWeight: 500, flex: 1 }}>
        {label}
      </span>
      <span style={{ fontSize: 11, color, fontWeight: 600 }}>
        {detail}
      </span>
    </div>
  )
}

function getRiskBg(score: number) {
  if (score >= 70) return '#fef2f2'
  if (score >= 30) return '#fff7ed'
  return '#f0fdf4'
}

function getRiskColor(score: number) {
  if (score >= 70) return '#dc2626'
  if (score >= 30) return '#d97706'
  return '#16a34a'
}

function stringToColor(str: string): string {
  const colors = ['#4338ca', '#7c3aed', '#0891b2', '#16a34a', '#ea580c', '#db2777', '#0369a1', '#9333ea']
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
