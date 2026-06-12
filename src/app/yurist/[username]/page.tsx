import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import {
  Scale, MapPin, Star, BadgeCheck, Clock, Briefcase,
  Languages, MessageCircle, Award, FileText, AlertCircle,
  Share2, Calendar, Eye
} from 'lucide-react'
import ShareButton from '@/components/lawyer/ShareButton'

// ─────────────────────────────────────────────
// Data fetching
// ─────────────────────────────────────────────
async function getLawyer(username: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data } = await supabase.rpc('get_public_lawyer', { p_username: username })
  if (!data || data.length === 0) return null

  // Profil ko'rishlar sonini oshirish (analytics)
  await supabase.rpc('increment_profile_views', { p_user_id: data[0].id })

  return data[0]
}

// ─────────────────────────────────────────────
// SEO Meta tags
// ─────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: { username: string } }
): Promise<Metadata> {
  const lawyer = await getLawyer(params.username)

  if (!lawyer) {
    return { title: 'Yurist topilmadi — Yuristim' }
  }

  const specs = lawyer.specialization?.slice(0, 3).join(', ') || 'huquqshunos'
  const title = `${lawyer.full_name} — ${specs} | Yuristim`
  const desc = lawyer.description
    ? lawyer.description.slice(0, 155)
    : `${lawyer.full_name} — ${lawyer.city || "O'zbekiston"}da ${specs} sohasida xizmat ko'rsatuvchi yurist. Yuristim platformasi orqali bog'laning.`

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: 'profile',
      siteName: 'Yuristim',
      locale: 'uz_UZ',
    },
    twitter: {
      card: 'summary',
      title,
      description: desc,
    },
    alternates: {
      canonical: `https://yuristimuz-sayt.vercel.app/yurist/${params.username}`,
    },
  }
}

// ─────────────────────────────────────────────
// Page component
// ─────────────────────────────────────────────
export default async function PublicLawyerPage(
  { params }: { params: { username: string } }
) {
  const lawyer = await getLawyer(params.username)

  if (!lawyer) {
    return (
      <div style={{ minHeight: '100vh', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 64, height: 64, background: '#fef2f2', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <AlertCircle size={28} color="#dc2626" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Yurist topilmadi</h1>
          <p style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>
            <strong>@{params.username}</strong> nomli yurist mavjud emas yoki ro'yxatdan o'tmagan.
          </p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#0f172a', color: '#fff', padding: '11px 22px', borderRadius: 11, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    )
  }

  const ini = (n: string) => n?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U'

  const profileUrl = `https://yuristimuz-sayt.vercel.app/yurist/${lawyer.username}`

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif" }}>

      {/* ═══════════════════════════════════ */}
      {/* TOP NAV BAR                            */}
      {/* ═══════════════════════════════════ */}
      <header style={{ background: '#fff', borderBottom: '0.5px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 16px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, background: '#0f172a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={14} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', letterSpacing: '-0.3px' }}>Yuristim</span>
          </Link>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/auth/login"
              style={{ fontSize: 13, fontWeight: 600, color: '#475569', padding: '8px 14px', borderRadius: 9, textDecoration: 'none' }}>
              Kirish
            </Link>
            <Link href="/auth/signup"
              style={{ fontSize: 13, fontWeight: 700, background: '#0f172a', color: '#fff', padding: '8px 16px', borderRadius: 9, textDecoration: 'none' }}>
              Ro'yxatdan o'tish
            </Link>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '20px 16px 60px' }}>

        {/* ═══════════════════════════════════ */}
        {/* PROFIL HEADER CARD                     */}
        {/* ═══════════════════════════════════ */}
        <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 20, padding: 24, marginBottom: 14, position: 'relative', overflow: 'hidden' }}>

          {/* Dekorativ fon */}
          <div style={{ position: 'absolute', top: -50, right: -50, width: 220, height: 220, background: 'radial-gradient(circle, rgba(67,56,202,0.07), transparent 70%)', pointerEvents: 'none' }} />

          {/* Avatar + Ism + Verified */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, position: 'relative', marginBottom: 18 }}>
            <div style={{
              width: 84, height: 84,
              background: 'linear-gradient(135deg, #0f172a, #4338ca)',
              color: '#fff', borderRadius: 22,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 28, flexShrink: 0,
              boxShadow: '0 8px 24px rgba(15,23,42,0.18)',
            }}>
              {ini(lawyer.full_name)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px', marginBottom: 4 }}>
                {lawyer.full_name}
              </h1>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>@{lawyer.username}</p>

              {/* Tasdiqlangan / Tasdiqlanmagan badge */}
              {lawyer.is_verified ? (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#dbeafe', padding: '4px 11px', borderRadius: 7 }}>
                  <BadgeCheck size={13} color="#1d4ed8" />
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: '#1d4ed8', letterSpacing: '0.4px' }}>TASDIQLANGAN YURIST</span>
                </div>
              ) : (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#fef3c7', padding: '4px 11px', borderRadius: 7, border: '0.5px solid #fde68a' }}>
                  <AlertCircle size={12} color="#a16207" />
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: '#a16207', letterSpacing: '0.4px' }}>TASDIQLANMAGAN</span>
                </div>
              )}
            </div>
          </div>

          {/* Asosiy ko'rsatkichlar (yon-yon) */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12.5, color: '#475569', marginBottom: 18, paddingBottom: 18, borderBottom: '0.5px solid #f1f5f9' }}>
            {lawyer.city && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <MapPin size={13} color="#94a3b8" /> {lawyer.city}
              </span>
            )}
            {parseFloat(lawyer.rating) > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Star size={13} color="#f59e0b" fill="#f59e0b" />
                <strong style={{ color: '#0f172a' }}>{parseFloat(lawyer.rating).toFixed(1)}</strong>
                <span style={{ color: '#94a3b8' }}>({lawyer.total_reviews || 0} sharh)</span>
              </span>
            )}
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={13} color="#94a3b8" /> {lawyer.response_time}
            </span>
          </div>

          {/* CTA tugmalar */}
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href={`/auth/login?redirect=/dashboard/lawyers/${lawyer.id}`}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '13px', background: '#0f172a', color: '#fff',
                borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(15,23,42,0.2)',
              }}>
              <MessageCircle size={15} /> Bog'lanish
            </Link>
            <ShareButton url={profileUrl} name={lawyer.full_name} />
          </div>
        </div>

        {/* ═══════════════════════════════════ */}
        {/* STATS GRID                              */}
        {/* ═══════════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
          <StatCard
            icon={<Briefcase size={15} />}
            label="Tajriba"
            value={lawyer.experience_years > 0 ? `${lawyer.experience_years} yil` : '—'}
            color="#1d4ed8" bg="#eff6ff"
          />
          <StatCard
            icon={<Award size={15} />}
            label="Soatlik"
            value={lawyer.hourly_rate ? `${(Number(lawyer.hourly_rate) / 1000).toFixed(0)}K` : '—'}
            color="#166534" bg="#f0fdf4"
            suffix={lawyer.hourly_rate ? "so'm" : ''}
          />
          <StatCard
            icon={<Calendar size={15} />}
            label="Platformada"
            value={`${Math.max(1, Math.floor((Date.now() - new Date(lawyer.created_at).getTime()) / (1000 * 60 * 60 * 24)))} kun`}
            color="#7e22ce" bg="#faf5ff"
          />
        </div>

        {/* ═══════════════════════════════════ */}
        {/* IXTISOSLIK                              */}
        {/* ═══════════════════════════════════ */}
        {lawyer.specialization?.length > 0 && (
          <Section title="Ixtisoslik" icon={<Award size={15} color="#475569" />}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {lawyer.specialization.map((s: string) => (
                <span key={s} style={{
                  fontSize: 12, fontWeight: 600,
                  background: '#f1f5f9', color: '#0f172a',
                  padding: '6px 13px', borderRadius: 100,
                }}>
                  {s}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* ═══════════════════════════════════ */}
        {/* TILLAR                                  */}
        {/* ═══════════════════════════════════ */}
        {lawyer.languages?.length > 0 && (
          <Section title="Bilish tillari" icon={<Languages size={15} color="#475569" />}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {lawyer.languages.map((l: string) => (
                <span key={l} style={{
                  fontSize: 12, fontWeight: 600,
                  background: '#eef2ff', color: '#4338ca',
                  padding: '6px 13px', borderRadius: 100,
                }}>
                  🌐 {l}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* ═══════════════════════════════════ */}
        {/* PROFESSIONAL TAVSIF                     */}
        {/* ═══════════════════════════════════ */}
        {lawyer.description && (
          <Section title="Tavsif" icon={<FileText size={15} color="#475569" />}>
            <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
              {lawyer.description}
            </p>
          </Section>
        )}

        {/* ═══════════════════════════════════ */}
        {/* QISQACHA (BIO)                          */}
        {/* ═══════════════════════════════════ */}
        {lawyer.bio && lawyer.bio !== lawyer.description && (
          <Section title="Qisqacha o'zim haqimda" icon={<FileText size={15} color="#475569" />}>
            <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
              {lawyer.bio}
            </p>
          </Section>
        )}

        {/* ═══════════════════════════════════ */}
        {/* ISH JOYI                                */}
        {/* ═══════════════════════════════════ */}
        {(lawyer.workplace || lawyer.job_title) && (
          <Section title="Ish joyi" icon={<span style={{ fontSize: 14 }}>🏢</span>}>
            {lawyer.job_title && (
              <p style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a', marginBottom: 4 }}>
                {lawyer.job_title}
              </p>
            )}
            {lawyer.workplace && (
              <p style={{ fontSize: 13, color: '#64748b' }}>{lawyer.workplace}</p>
            )}
          </Section>
        )}

        {/* ═══════════════════════════════════ */}
        {/* TA'LIM VA SERTIFIKATLAR                 */}
        {/* ═══════════════════════════════════ */}
        {(lawyer.education_university || lawyer.certificates?.length > 0) && (
          <Section title="Ta'lim va sertifikatlar" icon={<span style={{ fontSize: 14 }}>🎓</span>}>
            {lawyer.education_university && (
              <div style={{ marginBottom: lawyer.certificates?.length > 0 ? 14 : 0, paddingBottom: lawyer.certificates?.length > 0 ? 14 : 0, borderBottom: lawyer.certificates?.length > 0 ? '0.5px solid #f1f5f9' : 'none' }}>
                <p style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a', marginBottom: 3 }}>
                  {lawyer.education_university}
                </p>
                {lawyer.education_year && (
                  <p style={{ fontSize: 12, color: '#64748b' }}>
                    Tugatgan: {lawyer.education_year}-yil
                  </p>
                )}
              </div>
            )}
            {lawyer.certificates?.length > 0 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
                  Qo'shimcha sertifikatlar
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {lawyer.certificates.map((c: string) => (
                    <span key={c} style={{
                      fontSize: 11.5, fontWeight: 600,
                      background: '#eef2ff', color: '#4338ca',
                      padding: '5px 11px', borderRadius: 100,
                    }}>
                      🏆 {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </Section>
        )}

        {/* ═══════════════════════════════════ */}
        {/* LITSENZIYA                              */}
        {/* ═══════════════════════════════════ */}
        {lawyer.license_number && (
          <Section title="Advokatlik litsenziyasi" icon={<span style={{ fontSize: 14 }}>⚖️</span>}>
            <div style={{
              background: '#dbeafe', border: '1px solid #93c5fd',
              borderRadius: 10, padding: '12px 14px',
            }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#1d4ed8', color: '#fff', padding: '3px 9px', borderRadius: 5, fontSize: 10, fontWeight: 700, letterSpacing: '0.4px', marginBottom: 8 }}>
                ⚖️ LITSENZIYALANGAN ADVOKAT
              </div>
              <p style={{ fontSize: 13, color: '#1e3a8a', marginBottom: 4 }}>
                <strong>Litsenziya raqami:</strong> {lawyer.license_number}
              </p>
              {lawyer.license_authority && (
                <p style={{ fontSize: 12, color: '#1e40af' }}>
                  {lawyer.license_authority}
                </p>
              )}
            </div>
          </Section>
        )}

        {/* ═══════════════════════════════════ */}
        {/* ALOQA VA IJTIMOIY TARMOQLAR             */}
        {/* ═══════════════════════════════════ */}
        {(lawyer.public_phone || lawyer.social_telegram || lawyer.social_linkedin || lawyer.website) && (
          <Section title="Aloqa" icon={<span style={{ fontSize: 14 }}>🌐</span>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {lawyer.public_phone && (
                <a href={`tel:${lawyer.public_phone}`}
                  style={contactLinkStyle('#0f172a', '#f1f5f9')}>
                  <span style={{ fontSize: 18 }}>📱</span>
                  <span style={{ flex: 1 }}>{lawyer.public_phone}</span>
                  <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Qo'ng'iroq</span>
                </a>
              )}
              {lawyer.social_telegram && (
                <a href={`https://t.me/${lawyer.social_telegram}`} target="_blank" rel="noopener noreferrer"
                  style={contactLinkStyle('#0c4a6e', '#f0f9ff')}>
                  <span style={{ fontSize: 18 }}>✈️</span>
                  <span style={{ flex: 1 }}>@{lawyer.social_telegram}</span>
                  <span style={{ fontSize: 11, color: '#0284c7', fontWeight: 600 }}>Telegram</span>
                </a>
              )}
              {lawyer.social_linkedin && (
                <a href={lawyer.social_linkedin} target="_blank" rel="noopener noreferrer"
                  style={contactLinkStyle('#1e3a8a', '#eff6ff')}>
                  <span style={{ fontSize: 18 }}>💼</span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lawyer.social_linkedin.replace(/^https?:\/\//, '')}</span>
                  <span style={{ fontSize: 11, color: '#1d4ed8', fontWeight: 600 }}>LinkedIn</span>
                </a>
              )}
              {lawyer.website && (
                <a href={lawyer.website} target="_blank" rel="noopener noreferrer"
                  style={contactLinkStyle('#475569', '#fafafa')}>
                  <span style={{ fontSize: 18 }}>🌐</span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lawyer.website.replace(/^https?:\/\//, '')}</span>
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Veb-sayt</span>
                </a>
              )}
            </div>
          </Section>
        )}

        {/* ═══════════════════════════════════ */}
        {/* TASDIQLANMAGAN OGOHLANTIRISH            */}
        {/* ═══════════════════════════════════ */}
        {!lawyer.is_verified && (
          <div style={{
            background: '#fef3c7',
            border: '1px solid #fde68a',
            borderRadius: 14,
            padding: '14px 16px',
            marginTop: 16,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 11,
          }}>
            <AlertCircle size={18} color="#a16207" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#78350f', marginBottom: 3 }}>
                Ushbu yurist hali tasdiqlanmagan
              </p>
              <p style={{ fontSize: 12, color: '#92400e', lineHeight: 1.55 }}>
                Bog'lanishdan oldin yurist litsenziyasi va malakasini tekshiring. Tasdiqlangan yuristlar uchun ko'k ✓ belgi qo'yiladi.
              </p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════ */}
        {/* FOOTER CTA                              */}
        {/* ═══════════════════════════════════ */}
        <div style={{
          marginTop: 24,
          background: 'linear-gradient(135deg, #0f172a, #4338ca)',
          borderRadius: 18,
          padding: '24px 22px',
          textAlign: 'center',
          color: '#fff',
        }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
            Yuristim platformasiga qo'shiling
          </h3>
          <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)', marginBottom: 16, lineHeight: 1.55 }}>
            Yuristlar bilan bog'laning, AI maslahat oling va o'z huquqlaringizni himoya qiling
          </p>
          <Link href="/auth/signup"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: '#0f172a', padding: '11px 22px', borderRadius: 11, fontSize: 13.5, fontWeight: 700, textDecoration: 'none' }}>
            Bepul ro'yxatdan o'tish →
          </Link>
        </div>
      </main>
    </div>
  )
}

// ─────────────────────────────────────────────
// Reusable components
// ─────────────────────────────────────────────
function StatCard({ icon, label, value, color, bg, suffix }: any) {
  return (
    <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: '12px 14px' }}>
      <div style={{ width: 28, height: 28, background: bg, color, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        {icon}
      </div>
      <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.2px' }}>
        {value}
        {suffix && <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, marginLeft: 3 }}>{suffix}</span>}
      </p>
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 16, padding: 18, marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        {icon}
        <h3 style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>{title}</h3>
      </div>
      {children}
    </div>
  )
}

function contactLinkStyle(textColor: string, bgColor: string): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '11px 14px',
    background: bgColor,
    border: '0.5px solid #e2e8f0',
    borderRadius: 11,
    fontSize: 13, fontWeight: 600, color: textColor,
    textDecoration: 'none',
    transition: 'all 150ms',
  }
}
