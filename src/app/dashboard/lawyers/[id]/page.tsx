'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  ArrowLeft, MapPin, Star, BadgeCheck, Clock, Briefcase,
  Languages, MessageCircle, Phone, Mail, Award, FileText,
  Loader2, AlertCircle, DollarSign
} from 'lucide-react'

export default function LawyerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const lawyerId = params.id as string

  const [lawyer, setLawyer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [startingChat, setStartingChat] = useState(false)

  useEffect(() => {
    fetchData()
  }, [lawyerId])

  const fetchData = async () => {
    try {
      // Joriy foydalanuvchi
      const meRes = await fetch('/api/auth/me')
      const meData = await meRes.json()
      if (meData.user) setCurrentUser(meData.user)

      // Yurist ma'lumotlari (search_lawyers dan bittaga olamiz)
      const { data } = await supabase.rpc('search_lawyers', {
        p_limit: 1, p_offset: 0,
      })

      // Aniq IDsi bo'yicha qidirish - to'g'ridan-to'g'ri jadval orqali
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', lawyerId)
        .eq('role', 'lawyer')
        .single()

      if (!user) { setLoading(false); return }

      const { data: lp } = await supabase.rpc('get_lawyer_profile', { p_user_id: lawyerId })
      const profile = lp?.[0]

      setLawyer({
        ...user,
        ...(profile || {}),
        specialization: profile?.specialization || [],
        languages: profile?.languages || ["O'zbekcha"],
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStartChat = async () => {
    if (!currentUser || currentUser.id === lawyerId) return
    setStartingChat(true)
    try {
      const { data } = await supabase.rpc('get_or_create_conversation', {
        p_user1_id: currentUser.id,
        p_user2_id: lawyerId,
      })
      router.push(`/dashboard/chat?conv=${data?.[0]?.id}`)
    } catch {
      setStartingChat(false)
    }
  }

  const ini = (n: string) => n?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U'

  if (loading) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', justifyContent: 'center', padding: 60 }}>
        <Loader2 size={28} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (!lawyer) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Link href="/dashboard/lawyers" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13, textDecoration: 'none', marginBottom: 20 }}>
          <ArrowLeft size={14} /> Yuristlar ro'yxati
        </Link>
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fafafa', borderRadius: 18 }}>
          <AlertCircle size={32} color="#cbd5e1" style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: '#475569' }}>Yurist topilmadi</p>
        </div>
      </div>
    )
  }

  const isOwnProfile = currentUser?.id === lawyer.id

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>

      {/* Back */}
      <Link href="/dashboard/lawyers"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13, textDecoration: 'none', marginBottom: 16 }}>
        <ArrowLeft size={14} /> Yuristlar ro'yxati
      </Link>

      {/* Profile header card */}
      <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 20, padding: 24, marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
        {/* Decorative bg */}
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'radial-gradient(circle, rgba(67,56,202,0.08), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 18, position: 'relative' }}>
          {/* Avatar */}
          <div style={{
            width: 80, height: 80,
            background: 'linear-gradient(135deg, #0f172a, #4338ca)',
            color: '#fff', borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 26, flexShrink: 0,
            boxShadow: '0 8px 24px rgba(15,23,42,0.18)',
          }}>
            {ini(lawyer.full_name)}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px' }}>
                {lawyer.full_name}
              </h1>
              {lawyer.is_verified && (
                <div title="Tasdiqlangan yurist" style={{ display: 'flex', alignItems: 'center', gap: 3, background: '#dbeafe', padding: '2px 8px', borderRadius: 5 }}>
                  <BadgeCheck size={13} color="#1d4ed8" />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#1d4ed8', letterSpacing: '0.3px' }}>TASDIQLANGAN</span>
                </div>
              )}
            </div>

            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 10 }}>@{lawyer.username}</p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12.5, color: '#475569' }}>
              {lawyer.city && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={12} /> {lawyer.city}
                </span>
              )}
              {parseFloat(lawyer.rating) > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Star size={12} color="#f59e0b" fill="#f59e0b" />
                  <strong style={{ color: '#0f172a' }}>{parseFloat(lawyer.rating).toFixed(1)}</strong>
                  ({lawyer.total_reviews || 0} sharh)
                </span>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={12} /> {lawyer.response_time || '24 soat ichida'}
              </span>
            </div>
          </div>
        </div>

        {/* CTA tugmalar */}
        {!isOwnProfile && currentUser && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleStartChat} disabled={startingChat}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 12,
                fontSize: 14, fontWeight: 700, cursor: startingChat ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 4px 12px rgba(15,23,42,0.2)',
              }}>
              {startingChat ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <><MessageCircle size={15} /> Yozish</>}
            </button>
            {lawyer.phone && (
              <a href={`tel:${lawyer.phone}`}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '12px 16px', background: '#fff', color: '#0f172a',
                  border: '1px solid #e2e8f0', borderRadius: 12,
                  fontSize: 14, fontWeight: 600, textDecoration: 'none',
                }}>
                <Phone size={15} />
              </a>
            )}
          </div>
        )}

        {isOwnProfile && (
          <Link href="/dashboard/settings"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: '#f8fafc', color: '#475569', border: '0.5px solid #e2e8f0', borderRadius: 12, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Profilingizni tahrirlash
          </Link>
        )}
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
        <StatCard icon={<Briefcase size={16} />} label="Tajriba" value={lawyer.experience_years > 0 ? `${lawyer.experience_years} yil` : '—'} color="#1d4ed8" bg="#eff6ff" />
        <StatCard icon={<DollarSign size={16} />} label="Soatlik" value={lawyer.hourly_rate ? `${(Number(lawyer.hourly_rate) / 1000).toFixed(0)}K so'm` : '—'} color="#166534" bg="#f0fdf4" />
        <StatCard icon={<Award size={16} />} label="Sohalar" value={lawyer.specialization?.length || 0} color="#7e22ce" bg="#faf5ff" />
      </div>

      {/* Specialization */}
      {lawyer.specialization?.length > 0 && (
        <Section title="Ixtisoslik" icon={<Award size={16} color="#475569" />}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {lawyer.specialization.map((s: string) => (
              <span key={s} style={{ fontSize: 12, fontWeight: 600, background: '#f1f5f9', color: '#0f172a', padding: '5px 12px', borderRadius: 100 }}>
                {s}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Languages */}
      {lawyer.languages?.length > 0 && (
        <Section title="Bilish tillari" icon={<Languages size={16} color="#475569" />}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {lawyer.languages.map((l: string) => (
              <span key={l} style={{ fontSize: 12, fontWeight: 600, background: '#eef2ff', color: '#4338ca', padding: '5px 12px', borderRadius: 100 }}>
                🌐 {l}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Description */}
      {lawyer.description && (
        <Section title="Tavsif" icon={<FileText size={16} color="#475569" />}>
          <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {lawyer.description}
          </p>
        </Section>
      )}

      {/* Bio */}
      {lawyer.bio && (
        <Section title="Qisqacha" icon={<FileText size={16} color="#475569" />}>
          <p style={{ fontSize: 13.5, color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {lawyer.bio}
          </p>
        </Section>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function StatCard({ icon, label, value, color, bg }: any) {
  return (
    <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: '12px 14px' }}>
      <div style={{ width: 30, height: 30, background: bg, color, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
        {icon}
      </div>
      <p style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>{label}</p>
      <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.2px' }}>{value}</p>
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
