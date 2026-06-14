// ════════════════════════════════════════════════
// ADMIN — Bitta yurist tafsiloti
// /src/app/admin/lawyers/[id]/page.tsx
// ════════════════════════════════════════════════

import { getAdminFromCookie } from '@/lib/admin-auth'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import {
  ChevronLeft, Shield, CheckCircle2, XCircle, Clock, AlertCircle,
  User, Phone, MapPin, Briefcase, Award, GraduationCap, Calendar,
  FileText, Star, MessageSquare, Globe, Send, Building, Languages
} from 'lucide-react'
import VerifyActions from './VerifyActions'
import DiplomaViewer from './DiplomaViewer'

async function getLawyerDetails(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data, error } = await supabase.rpc('admin_get_lawyer_details', { p_lawyer_id: id })
  if (error || !data || !data.id) return null
  return data
}

export default async function AdminLawyerDetailPage({ params }: { params: { id: string } }) {
  const admin = await getAdminFromCookie()
  if (!admin) redirect('/admin/login')

  const lawyer = await getLawyerDetails(params.id)
  if (!lawyer) notFound()

  const status = getStatus(lawyer)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Back link */}
      <Link href="/admin/lawyers" style={{
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
        Yuristlar ro'yxatiga qaytish
      </Link>

      {/* Header card */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: 14,
        padding: 22,
        marginBottom: 14,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14,
          marginBottom: 16,
        }}>
          {/* Avatar */}
          <div style={{
            width: 64, height: 64,
            background: `linear-gradient(135deg, ${stringToColor(lawyer.username)}aa, ${stringToColor(lawyer.username)})`,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 24,
            flexShrink: 0,
            letterSpacing: '-0.5px',
          }}>
            {(lawyer.full_name || lawyer.username).charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexWrap: 'wrap',
              marginBottom: 4,
            }}>
              <h1 style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#0f172a',
                letterSpacing: '-0.3px',
              }}>
                {lawyer.full_name || lawyer.username}
              </h1>
              {lawyer.is_verified && (
                <Shield size={14} color="#16a34a" />
              )}
            </div>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>
              @{lawyer.username}
            </p>
            
            {/* Status badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              background: status.bg,
              border: `1px solid ${status.border}`,
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 700,
              color: status.color,
            }}>
              {status.icon}
              {status.label}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: 10,
          paddingTop: 14,
          borderTop: '1px solid #f1f5f9',
        }}>
          <Stat icon={MessageSquare} label="Suhbatlar" value={lawyer.total_conversations || 0} color="#4338ca" />
          <Stat icon={FileText} label="E'lonlar" value={lawyer.total_ads || 0} color="#ea580c" />
          <Stat icon={Star} label="Sharhlar" value={lawyer.total_reviews || 0} color="#d97706" />
          <Stat icon={Award} label="Reyting" value={lawyer.avg_rating ? `${lawyer.avg_rating}` : '—'} color="#16a34a" />
        </div>
      </div>

      {/* Verification info (agar bor bo'lsa) */}
      {(lawyer.is_verified || lawyer.rejected_at) && (
        <div style={{
          background: lawyer.is_verified ? '#f0fdf4' : '#fef2f2',
          border: `1px solid ${lawyer.is_verified ? '#bbf7d0' : '#fecaca'}`,
          borderRadius: 12,
          padding: 14,
          marginBottom: 14,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
          }}>
            {lawyer.is_verified ? (
              <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
            ) : (
              <XCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 13,
                fontWeight: 700,
                color: lawyer.is_verified ? '#15803d' : '#b91c1c',
                marginBottom: 4,
              }}>
                {lawyer.is_verified ? 'Tasdiqlangan' : 'Rad etilgan'}
              </div>
              <div style={{
                fontSize: 11.5,
                color: lawyer.is_verified ? '#166534' : '#991b1b',
                lineHeight: 1.5,
              }}>
                {lawyer.is_verified ? (
                  <>
                    {new Date(lawyer.verified_at).toLocaleString('uz-UZ')} da
                    {lawyer.verified_by && <> · admin <strong>{lawyer.verified_by}</strong></>}
                  </>
                ) : (
                  <>
                    <div>{new Date(lawyer.rejected_at).toLocaleString('uz-UZ')}{lawyer.rejected_by && ` · admin ${lawyer.rejected_by}`}</div>
                    {lawyer.rejection_reason && (
                      <div style={{ marginTop: 6, padding: '8px 10px', background: 'rgba(255,255,255,0.7)', borderRadius: 6 }}>
                        <strong>Sabab:</strong> {lawyer.rejection_reason}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <VerifyActions 
        lawyerId={lawyer.id}
        isVerified={lawyer.is_verified}
        isRejected={!!lawyer.rejected_at}
        hasDiploma={!!lawyer.diploma_url}
        profileComplete={!!(lawyer.license_number && lawyer.specialization && lawyer.specialization.length > 0)}
      />

      {/* Diplom */}
      {lawyer.diploma_url && (
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 14,
          padding: 18,
          marginBottom: 14,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
          }}>
            <GraduationCap size={15} color="#0f172a" />
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
              Diplom
            </h2>
          </div>
          <DiplomaViewer url={lawyer.diploma_url} />
        </div>
      )}

      {/* Litsenziya */}
      {(lawyer.license_number || lawyer.license_authority || lawyer.license_valid_until) && (
        <Section title="Litsenziya" icon={Award}>
          <Field icon={FileText} label="Litsenziya raqami" value={lawyer.license_number} />
          <Field icon={Building} label="Bergan organ" value={lawyer.license_authority} />
          <Field icon={Calendar} label="Amal qilish muddati" value={
            lawyer.license_valid_until ? new Date(lawyer.license_valid_until).toLocaleDateString('uz-UZ') : null
          } />
        </Section>
      )}

      {/* Mutaxassislik */}
      {(lawyer.specialization?.length || lawyer.experience_years || lawyer.hourly_rate) && (
        <Section title="Mutaxassislik" icon={Briefcase}>
          {lawyer.specialization?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, fontWeight: 600 }}>
                Yo'nalishlar
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {lawyer.specialization.map((spec: string) => (
                  <span key={spec} style={{
                    padding: '4px 10px',
                    background: '#eef2ff',
                    color: '#4338ca',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 600,
                  }}>
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          )}
          <Field icon={Calendar} label="Tajriba" value={lawyer.experience_years ? `${lawyer.experience_years} yil` : null} />
          <Field icon={Award} label="Soatlik narx" value={lawyer.hourly_rate ? `${lawyer.hourly_rate.toLocaleString()} so'm` : null} />
          {lawyer.description && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4, fontWeight: 600 }}>
                Tavsif
              </div>
              <p style={{ fontSize: 12.5, color: '#0f172a', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {lawyer.description}
              </p>
            </div>
          )}
        </Section>
      )}

      {/* Ish joyi va ta'lim */}
      {(lawyer.workplace || lawyer.job_title || lawyer.education_university) && (
        <Section title="Faoliyat va ta'lim" icon={Building}>
          <Field icon={Briefcase} label="Lavozim" value={lawyer.job_title} />
          <Field icon={Building} label="Ish joyi" value={lawyer.workplace} />
          <Field icon={GraduationCap} label="Universitet" value={lawyer.education_university} />
          <Field icon={Calendar} label="Bitirgan yili" value={lawyer.education_year} />
        </Section>
      )}

      {/* Boshqa */}
      {(lawyer.location || lawyer.languages?.length || lawyer.public_phone || lawyer.social_telegram || lawyer.website) && (
        <Section title="Aloqa va boshqa" icon={Phone}>
          <Field icon={MapPin} label="Joylashuv" value={lawyer.location} />
          <Field icon={Phone} label="Ommaviy telefon" value={lawyer.public_phone} />
          <Field icon={Phone} label="Maxfiy telefon" value={lawyer.phone} />
          {lawyer.languages?.length > 0 && (
            <Field icon={Languages} label="Tillar" value={lawyer.languages.join(', ')} />
          )}
          <Field icon={Send} label="Telegram" value={lawyer.social_telegram} link={
            lawyer.social_telegram ? `https://t.me/${lawyer.social_telegram.replace('@', '')}` : null
          } />
          <Field icon={Globe} label="Veb-sayt" value={lawyer.website} link={lawyer.website} />
        </Section>
      )}

      {/* Account info */}
      <Section title="Akkaunt ma'lumoti" icon={User}>
        <Field icon={Calendar} label="Ro'yxatdan o'tgan" value={
          new Date(lawyer.created_at).toLocaleString('uz-UZ')
        } />
        <Field icon={User} label="Username" value={`@${lawyer.username}`} />
      </Section>
    </div>
  )
}

// ─────────────────────────────────────────
// UI helpers
// ─────────────────────────────────────────
function Stat({ icon: Icon, label, value, color }: any) {
  return (
    <div style={{
      textAlign: 'center',
      padding: 10,
      background: '#f8fafc',
      borderRadius: 8,
    }}>
      <Icon size={14} color={color} style={{ marginBottom: 4 }} />
      <div style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px' }}>
        {value}
      </div>
      <div style={{ fontSize: 10, color: '#64748b', marginTop: 1 }}>
        {label}
      </div>
    </div>
  )
}

function Section({ title, icon: Icon, children }: any) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 14,
      padding: 18,
      marginBottom: 14,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
      }}>
        <Icon size={15} color="#0f172a" />
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  )
}

function Field({ icon: Icon, label, value, link }: any) {
  if (!value) return null
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 0',
      borderBottom: '1px solid #f1f5f9',
    }}>
      <Icon size={13} color="#94a3b8" style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: 12, color: '#64748b' }}>{label}</div>
      <div style={{ fontSize: 12.5, color: '#0f172a', fontWeight: 600 }}>
        {link ? (
          <a href={link} target="_blank" rel="noreferrer" style={{ color: '#4338ca', textDecoration: 'none' }}>
            {value}
          </a>
        ) : value}
      </div>
    </div>
  )
}

function getStatus(lawyer: any) {
  if (lawyer.is_verified) return {
    label: 'Tasdiqlangan',
    bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d',
    icon: <CheckCircle2 size={11} />,
  }
  if (lawyer.rejected_at) return {
    label: 'Rad etilgan',
    bg: '#fef2f2', border: '#fecaca', color: '#b91c1c',
    icon: <XCircle size={11} />,
  }
  if (lawyer.diploma_url && lawyer.license_number && lawyer.specialization?.length > 0) return {
    label: 'Tasdiqlash kutilmoqda',
    bg: '#fef3c7', border: '#fde68a', color: '#92400e',
    icon: <Clock size={11} />,
  }
  return {
    label: 'Profil to\'liq emas',
    bg: '#f8fafc', border: '#e2e8f0', color: '#64748b',
    icon: <AlertCircle size={11} />,
  }
}

function stringToColor(str: string): string {
  const colors = ['#4338ca', '#7c3aed', '#0891b2', '#16a34a', '#ea580c', '#db2777', '#0369a1', '#9333ea']
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
