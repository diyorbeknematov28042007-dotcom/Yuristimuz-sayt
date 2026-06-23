'use client'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  User, Mail, Phone, MapPin, FileText,
  CheckCircle2, X, Sparkles, Save, AlertCircle,
  Briefcase, Award, Clock, Languages, DollarSign,
  Bell, Volume2, VolumeX, MessageCircle, Smartphone, Loader2, Plus
} from 'lucide-react'
import AvatarUpload from '@/components/profile/AvatarUpload'
import LocationPicker from '@/components/map/LocationPicker'
import PrivacyToggle from '@/components/profile/PrivacyToggle'
import VerificationManager from '@/components/profile/VerificationManager'
import { useNotifications } from '@/contexts/NotificationContext'
import { subscribeToPush, unsubscribeFromPush, getSubscriptionStatus } from '@/lib/push-subscription'
import InstallAppButton from '@/components/InstallAppButton'

const CATEGORIES = ['Oilaviy', 'Biznes', 'Mulk', 'Mehnat', 'Soliq', 'Jinoyat', 'Shartnoma', 'Migratsiya']
const LANGUAGES = ["O'zbekcha", "Ruscha", "Inglizcha", "Qoraqalpoqcha", "Tojikcha"]
const RESPONSE_TIMES = ['1 soat ichida', '4 soat ichida', '24 soat ichida', '3 kun ichida']
export default function SettingsPage() {
  const params = useSearchParams()
  const router = useRouter()
  const isWelcome = params.get('welcome') === '1'
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [showWelcome, setShowWelcome] = useState(isWelcome)
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    city: '',
    bio: '',
    avatar_url: null as string | null,
  })

  // Yurist uchun qo'shimcha state
  const [lawyerForm, setLawyerForm] = useState({
    specialization: [] as string[],
    experience_years: '',
    hourly_rate: '',
    description: '',
    languages: ['O\'zbekcha'] as string[],
    response_time: '24 soat ichida',
    // Yangi maydonlar — Faza 1.3
    workplace: '',
    job_title: '',
    education_university: '',
    education_year: '',
    diploma_url: '',
    certificates: [] as string[],
    license_number: '',
    license_authority: '',
    license_valid_until: '',
    social_telegram: '',
    social_linkedin: '',
    website: '',
    public_phone: '',
    // Xarita — ofis joylashuvi
    latitude: '',
    longitude: '',
    office_address: '',
    office_name: '',
    office_hours: '',
    office_photos: [] as string[],
  })
  const [lawyerSaved, setLawyerSaved] = useState(false)

  // ── Profil maydonlari ko'rinishi (public/private) ──
  const [visibility, setVisibility] = useState<Record<string, boolean>>({
    phone: false, experience_years: true, hourly_rate: true,
    specialization: true, languages: true, education: true,
    license: true, description: true, workplace: true,
    location: false, social: true,
  })
  // Bitta maydonni o'zgartirib, darrov saqlash
  const toggleVisibility = async (key: string, next: boolean) => {
    const updated = { ...visibility, [key]: next }
    setVisibility(updated)
    try {
      await fetch('/api/user/visibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility: updated }),
      })
    } catch {}
  }
  const [lawyerSaving, setLawyerSaving] = useState(false)
  useEffect(() => {
    fetchUser()
  }, [])
  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (data.user) {
        setUser(data.user)
        // Profil ma'lumotlarini yuklash
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()
        if (profile) {
          setForm({
            full_name: profile.full_name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            city: profile.city || '',
            bio: profile.bio || '',
            avatar_url: profile.avatar_url || null,
          })
        }

        // Yurist bo'lsa — qo'shimcha profil
        if (data.user.role === 'lawyer') {
          const { data: lp } = await supabase.rpc('get_lawyer_profile', {
            p_user_id: data.user.id,
          })
          if (lp && lp[0]) {
            setLawyerForm({
              specialization: lp[0].specialization || [],
              experience_years: lp[0].experience_years?.toString() || '',
              hourly_rate: lp[0].hourly_rate?.toString() || '',
              description: lp[0].description || '',
              languages: lp[0].languages || ['O\'zbekcha'],
              response_time: lp[0].response_time || '24 soat ichida',
              workplace: lp[0].workplace || '',
              job_title: lp[0].job_title || '',
              education_university: lp[0].education_university || '',
              education_year: lp[0].education_year?.toString() || '',
              diploma_url: lp[0].diploma_url || '',
              certificates: lp[0].certificates || [],
              license_number: lp[0].license_number || '',
              license_authority: lp[0].license_authority || '',
              license_valid_until: lp[0].license_valid_until || '',
              social_telegram: lp[0].social_telegram || '',
              social_linkedin: lp[0].social_linkedin || '',
              website: lp[0].website || '',
              public_phone: lp[0].public_phone || '',
              latitude: lp[0].latitude?.toString() || '',
              longitude: lp[0].longitude?.toString() || '',
              office_address: lp[0].office_address || '',
              office_name: lp[0].office_name || '',
              office_hours: lp[0].office_hours || '',
              office_photos: lp[0].office_photos || [],
            })
          }
          // Visibility sozlamalarini yuklash
          try {
            const visRes = await fetch('/api/user/visibility')
            const visData = await visRes.json()
            if (visData.visibility) setVisibility(visData.visibility)
          } catch {}
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Yurist profilini saqlash
  const handleSaveLawyer = async (e: React.FormEvent) => {
    e.preventDefault()
    setLawyerSaving(true); setLawyerSaved(false); setError('')
    try {
      const res = await fetch('/api/user/lawyer-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          specialization: lawyerForm.specialization,
          experience_years: lawyerForm.experience_years ? parseInt(lawyerForm.experience_years) : null,
          hourly_rate: lawyerForm.hourly_rate ? parseFloat(lawyerForm.hourly_rate) : null,
          description: lawyerForm.description || null,
          languages: lawyerForm.languages,
          response_time: lawyerForm.response_time,
          // Yangi maydonlar
          workplace: lawyerForm.workplace || null,
          job_title: lawyerForm.job_title || null,
          education_university: lawyerForm.education_university || null,
          education_year: lawyerForm.education_year ? parseInt(lawyerForm.education_year) : null,
          diploma_url: lawyerForm.diploma_url || null,
          certificates: lawyerForm.certificates.length > 0 ? lawyerForm.certificates : null,
          license_number: lawyerForm.license_number || null,
          license_authority: lawyerForm.license_authority || null,
          license_valid_until: lawyerForm.license_valid_until || null,
          social_telegram: lawyerForm.social_telegram || null,
          social_linkedin: lawyerForm.social_linkedin || null,
          website: lawyerForm.website || null,
          public_phone: lawyerForm.public_phone || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Saqlashda xatolik")
      } else {
        setLawyerSaved(true)
        setTimeout(() => setLawyerSaved(false), 3000)
        // Yurist profilni tahrirladi — PWA o'rnatishni taklif qilamiz
        import('@/lib/triggerInstall').then(m => m.maybeOfferInstall()).catch(() => {})
      }
    } catch {
      setError("Tarmoq xatosi")
    } finally {
      setLawyerSaving(false)
    }
  }

  // Ixtisoslikni toggle qilish
  const toggleSpec = (spec: string) => {
    setLawyerForm(f => ({
      ...f,
      specialization: f.specialization.includes(spec)
        ? f.specialization.filter(s => s !== spec)
        : [...f.specialization, spec]
    }))
  }

  // Til erkin kiritish (istalgan tilni yozish mumkin)
  const [langInput, setLangInput] = useState('')
  const addLanguage = (raw: string) => {
    const lang = raw.trim()
    if (!lang) return
    setLawyerForm(f => {
      if (f.languages.some(l => l.toLowerCase() === lang.toLowerCase())) return f
      return { ...f, languages: [...f.languages, lang] }
    })
    setLangInput('')
  }
  const removeLanguage = (lang: string) => {
    setLawyerForm(f => ({ ...f, languages: f.languages.filter(l => l !== lang) }))
  }
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Saqlashda xatolik")
      } else {
        setSaved(true)
        setShowWelcome(false)
        // 🔄 Layout/sidebar ma'lumotlarini yangilash
        router.refresh()
        // Local user state'ni ham yangilash
        setUser((u: any) => ({ ...u, full_name: form.full_name }))
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (err) {
      setError("Tarmoq xatosi")
    } finally {
      setSaving(false)
    }
  }
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
        <div style={{ width: 24, height: 24, border: '3px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }
  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* Welcome banner */}
      {showWelcome && (
        <div style={{
          background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
          borderRadius: 16, padding: '20px 24px', marginBottom: 24,
          display: 'flex', alignItems: 'flex-start', gap: 16,
          animation: 'fadeIn 0.5s ease',
        }}>
          <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles size={22} color="#fbbf24" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, color: '#fff', fontSize: 15, marginBottom: 4 }}>
              Xush kelibsiz, {user?.full_name?.split(' ')[0]}! 🎉
            </p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
              Profilingizni to'ldiring — mijozlar va yuristlar sizni tezroq topsin.
              Emailingizni qo'shing, parolni keyinchalik tiklay olasiz.
            </p>
          </div>
          <button onClick={() => setShowWelcome(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 4, flexShrink: 0 }}>
            <X size={16} />
          </button>
        </div>
      )}
      {/* Email eslatmasi */}
      {!form.email && !showWelcome && (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <AlertCircle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#92400e', marginBottom: 2 }}>Email qo'shing</p>
            <p style={{ fontSize: 12, color: '#b45309' }}>Parolni unutgan holda tiklash uchun email kerak bo'ladi.</p>
          </div>
        </div>
      )}
      {/* Profil shakli */}
      <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '0.5px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 52, height: 52, background: 'linear-gradient(135deg,#0f172a,#4338ca)', color: '#fff', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
            {user?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 16 }}>{user?.full_name}</p>
            <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
              @{user?.username} · {user?.role === 'lawyer' ? 'Yurist' : 'Mijoz'}
            </p>
          </div>
        </div>
        <form onSubmit={handleSave} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Avatar upload */}
          {user?.id && (
            <AvatarUpload
              currentAvatarUrl={form.avatar_url}
              userName={form.full_name || user.username || 'U'}
              userId={user.id}
              onUploadSuccess={(newUrl) => {
                setForm(f => ({ ...f, avatar_url: newUrl }))
                router.refresh()
              }}
            />
          )}

          {/* To'liq ism */}
          <div>
            <label style={labelStyle}>
              <User size={13} /> To'liq ism
            </label>
            <input
              value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              style={inputStyle}
              placeholder="Ism Familiya"
            />
          </div>
          {/* Email */}
          <div>
            <label style={labelStyle}>
              <Mail size={13} /> Email
              <span style={{ marginLeft: 6, fontSize: 10, background: '#fef3c7', color: '#d97706', padding: '1px 6px', borderRadius: 4, fontWeight: 700 }}>
                Parol tiklash uchun
              </span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              style={inputStyle}
              placeholder="email@example.com"
            />
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>
              Ixtiyoriy — faqat parol tiklash uchun ishlatiladi
            </p>
          </div>
          {/* Telefon */}
          <div>
            <label style={labelStyle}>
              <Phone size={13} /> Telefon
            </label>
            <input
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              style={inputStyle}
              placeholder="+998 90 123 45 67"
            />
          </div>
          {/* Shahar */}
          <div>
            <label style={labelStyle}>
              <MapPin size={13} /> Shahar
            </label>
            <input
              value={form.city}
              onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
              style={inputStyle}
              placeholder="Toshkent, Samarqand..."
            />
          </div>
          {/* Bio */}
          <div>
            <label style={labelStyle}>
              <FileText size={13} /> Bio
            </label>
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              style={{ ...inputStyle, minHeight: 90, resize: 'vertical' as const }}
              placeholder={user?.role === 'lawyer' ? "Tajriba, ixtisoslik, muvaffaqiyatlar..." : "O'zingiz haqida qisqacha..."}
              rows={3}
            />
          </div>
          {error && (
            <div style={{ padding: 12, borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b' }}>
              {error}
            </div>
          )}
          {saved && (
            <div style={{ padding: 12, borderRadius: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: 13, color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle2 size={16} color="#16a34a" /> Saqlandi!
            </div>
          )}
          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '12px 20px', background: '#0f172a', color: '#fff', border: 'none',
              borderRadius: 11, fontSize: 14, fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(15,23,42,0.2)',
              opacity: saving ? 0.7 : 1,
            }}>
            {saving ? 'Saqlanmoqda...' : <><Save size={15} /> Saqlash</>}
          </button>
        </form>
      </div>

      {/* ════════════════════════════════════ */}
      {/* YURIST UCHUN MAXSUS BO'LIM            */}
      {/* ════════════════════════════════════ */}
      {user?.role === 'lawyer' && (
        <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 18, boxShadow: '0 4px 24px rgba(0,0,0,0.04)', overflow: 'hidden', marginTop: 20 }}>

          {/* Header */}
          <div style={{ padding: '20px 24px', borderBottom: '0.5px solid #f1f5f9', background: 'linear-gradient(135deg, #faf5ff, #ede9fe)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 200 }}>
              <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#7c3aed,#4338ca)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Briefcase size={20} color="#fff" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>Yurist ma'lumotlari</p>
                  <span style={{ fontSize: 9, fontWeight: 700, background: '#4338ca', color: '#fff', padding: '2px 7px', borderRadius: 4 }}>FAQAT SIZ</span>
                </div>
                <p style={{ fontSize: 12, color: '#6d28d9' }}>Mijozlar sizni topishi uchun to'ldiring</p>
              </div>
            </div>
            {/* Public profil tugmasi */}
            {user?.username && (
              <a href={`/yurist/${user.username}`} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', background: '#fff',
                  color: '#7c3aed', border: '1px solid #ddd6fe',
                  borderRadius: 10, fontSize: 12, fontWeight: 600, textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}>
                🔗 Mening profilim
              </a>
            )}
          </div>

          <form onSubmit={handleSaveLawyer} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Ixtisoslik */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>
                  <Award size={13} /> Ixtisoslik
                  <span style={{ marginLeft: 4, fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
                    ({lawyerForm.specialization.length} tanlandi)
                  </span>
                </label>
                <PrivacyToggle isPublic={visibility.specialization} onChange={v => toggleVisibility('specialization', v)} size="sm" />
              </div>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {CATEGORIES.map(cat => {
                  const active = lawyerForm.specialization.includes(cat)
                  return (
                    <button type="button" key={cat} onClick={() => toggleSpec(cat)}
                      style={{
                        padding: '7px 14px', borderRadius: 100,
                        border: active ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
                        background: active ? '#0f172a' : '#fff',
                        color: active ? '#fff' : '#475569',
                        fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                        transition: 'all 150ms', fontFamily: 'inherit',
                      }}>
                      {active ? '✓ ' : ''}{cat}
                    </button>
                  )
                })}
              </div>
              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
                Bir nechta soha tanlashingiz mumkin
              </p>
            </div>

            {/* Tajriba + Narx (yonma-yon) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>
                    <Clock size={13} /> Tajriba
                  </label>
                  <PrivacyToggle isPublic={visibility.experience_years} onChange={v => toggleVisibility('experience_years', v)} size="sm" />
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={lawyerForm.experience_years}
                    onChange={e => setLawyerForm(f => ({ ...f, experience_years: e.target.value }))}
                    style={{ ...inputStyle, paddingRight: 48 }}
                    placeholder="0"
                  />
                  <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                    yil
                  </span>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>
                    <DollarSign size={13} /> Soatlik narx
                  </label>
                  <PrivacyToggle isPublic={visibility.hourly_rate} onChange={v => toggleVisibility('hourly_rate', v)} size="sm" />
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    min="0"
                    value={lawyerForm.hourly_rate}
                    onChange={e => setLawyerForm(f => ({ ...f, hourly_rate: e.target.value }))}
                    style={{ ...inputStyle, paddingRight: 60 }}
                    placeholder="100000"
                  />
                  <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>
                    so'm
                  </span>
                </div>
              </div>
            </div>

            {/* Tillar */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>
                  <Languages size={13} /> Bilish tillari
                </label>
                <PrivacyToggle isPublic={visibility.languages} onChange={v => toggleVisibility('languages', v)} size="sm" />
              </div>

              {/* Tanlangan tillar (chiplar) */}
              {lawyerForm.languages.length > 0 && (
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 8 }}>
                  {lawyerForm.languages.map(lang => (
                    <span key={lang} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '7px 10px 7px 14px', borderRadius: 100,
                      background: '#f1f5f9', border: '1px solid #e2e8f0',
                      color: '#0f172a', fontSize: 12.5, fontWeight: 600,
                    }}>
                      {lang}
                      <button type="button" onClick={() => removeLanguage(lang)}
                        style={{ display: 'flex', background: 'none', border: 'none', cursor: 'pointer', padding: 2, borderRadius: 4 }}>
                        <X size={13} color="#94a3b8" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Erkin kiritish maydoni */}
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={langInput}
                  onChange={e => setLangInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') { e.preventDefault(); addLanguage(langInput) }
                  }}
                  placeholder="Tilni yozing (masalan: Arabcha) va qo'shing"
                  maxLength={40}
                  style={{
                    flex: 1, padding: '10px 14px', fontSize: 13,
                    border: '1px solid #e2e8f0', borderRadius: 10, outline: 'none',
                    fontFamily: 'inherit', boxSizing: 'border-box',
                  }}
                />
                <button type="button" onClick={() => addLanguage(langInput)}
                  disabled={!langInput.trim()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5, padding: '0 16px',
                    background: langInput.trim() ? '#0f172a' : '#cbd5e1', color: '#fff',
                    border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600,
                    cursor: langInput.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit',
                  }}>
                  <Plus size={15} /> Qo'shish
                </button>
              </div>

              {/* Mashhur tillar — tez qo'shish (ixtiyoriy taklif) */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                {["O'zbekcha", "Ruscha", "Inglizcha", "Qoraqalpoqcha", "Tojikcha", "Qozoqcha", "Turkcha", "Arabcha"]
                  .filter(l => !lawyerForm.languages.some(x => x.toLowerCase() === l.toLowerCase()))
                  .map(lang => (
                    <button type="button" key={lang} onClick={() => addLanguage(lang)}
                      style={{
                        padding: '5px 11px', borderRadius: 100, border: '1px dashed #cbd5e1',
                        background: '#fff', color: '#64748b', fontSize: 11.5, fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}>
                      + {lang}
                    </button>
                  ))}
              </div>
            </div>

            {/* Javob berish vaqti */}
            <div>
              <label style={labelStyle}>
                <Clock size={13} /> Javob berish vaqti
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 7 }}>
                {RESPONSE_TIMES.map(t => {
                  const active = lawyerForm.response_time === t
                  return (
                    <button type="button" key={t} onClick={() => setLawyerForm(f => ({ ...f, response_time: t }))}
                      style={{
                        padding: '9px 12px', borderRadius: 10,
                        border: active ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
                        background: active ? '#f8fafc' : '#fff',
                        color: active ? '#0f172a' : '#475569',
                        fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                        transition: 'all 150ms', textAlign: 'left',
                        fontFamily: 'inherit',
                      }}>
                      {active ? '◉ ' : '○ '}{t}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Professional tavsif */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>
                  <FileText size={13} /> Professional tavsif
                  <span style={{ marginLeft: 4, fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
                    ({lawyerForm.description.length}/500)
                  </span>
                </label>
                <PrivacyToggle isPublic={visibility.description} onChange={v => toggleVisibility('description', v)} size="sm" />
              </div>
              <textarea
                value={lawyerForm.description}
                onChange={e => setLawyerForm(f => ({ ...f, description: e.target.value.slice(0, 500) }))}
                style={{ ...inputStyle, minHeight: 100, resize: 'vertical' as const }}
                placeholder="Tajribangiz, ko'rsatgan xizmatlaringiz, muvaffaqiyatli ishlaringiz haqida yozing..."
                rows={4}
              />
              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>
                Mijozlar profil sahifangizda buni ko'radi
              </p>
            </div>

            {/* ════════════════════════════ */}
            {/* 🏢 ISH JOYI                  */}
            {/* ════════════════════════════ */}
            <details style={detailsStyle}>
              <summary style={summaryStyle}>
                <span style={summaryLeftStyle}>
                  <span style={summaryIconStyle}>🏢</span>
                  <span>
                    <p style={summaryTitleStyle}>Ish joyi</p>
                    <p style={summarySubStyle}>Qayerda ishlaysiz</p>
                  </span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }} onClick={e => e.preventDefault()}>
                  <PrivacyToggle isPublic={visibility.workplace} onChange={v => toggleVisibility('workplace', v)} size="sm" />
                  <span style={summaryChevron}>▼</span>
                </span>
              </summary>
              <div style={detailsBodyStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={miniLabelStyle}>Tashkilot nomi</label>
                    <input value={lawyerForm.workplace}
                      onChange={e => setLawyerForm(f => ({ ...f, workplace: e.target.value }))}
                      placeholder='"Karimov va sheriklari"'
                      style={inputStyle} />
                  </div>
                  <div>
                    <label style={miniLabelStyle}>Lavozim</label>
                    <input value={lawyerForm.job_title}
                      onChange={e => setLawyerForm(f => ({ ...f, job_title: e.target.value }))}
                      placeholder="Advokat, yurist, maslahatchi"
                      style={inputStyle} />
                  </div>
                </div>
              </div>
            </details>

            {/* ════════════════════════════ */}
            {/* 🎓 TA'LIM                    */}
            {/* ════════════════════════════ */}
            <details style={detailsStyle}>
              <summary style={summaryStyle}>
                <span style={summaryLeftStyle}>
                  <span style={summaryIconStyle}>🎓</span>
                  <span>
                    <p style={summaryTitleStyle}>Ta'lim va sertifikatlar</p>
                    <p style={summarySubStyle}>Diplom, universitet, qo'shimcha kurslar</p>
                  </span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }} onClick={e => e.preventDefault()}>
                  <PrivacyToggle isPublic={visibility.education} onChange={v => toggleVisibility('education', v)} size="sm" />
                  <span style={summaryChevron}>▼</span>
                </span>
              </summary>
              <div style={detailsBodyStyle}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 12 }}>
                  <div>
                    <label style={miniLabelStyle}>Universitet</label>
                    <input value={lawyerForm.education_university}
                      onChange={e => setLawyerForm(f => ({ ...f, education_university: e.target.value }))}
                      placeholder="Toshkent Davlat Yuridik Universiteti"
                      style={inputStyle} />
                  </div>
                  <div>
                    <label style={miniLabelStyle}>Tugatgan yil</label>
                    <input type="number" min="1960" max={new Date().getFullYear()}
                      value={lawyerForm.education_year}
                      onChange={e => setLawyerForm(f => ({ ...f, education_year: e.target.value }))}
                      placeholder="2018"
                      style={inputStyle} />
                  </div>
                </div>

                {/* Sertifikatlar — pill format */}
                <div>
                  <label style={miniLabelStyle}>
                    Qo'shimcha sertifikatlar
                    <span style={{ marginLeft: 4, fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>
                      ({lawyerForm.certificates.length}/3)
                    </span>
                  </label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                    {lawyerForm.certificates.map((c, i) => (
                      <span key={i} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        background: '#eef2ff', color: '#4338ca',
                        padding: '5px 10px', borderRadius: 100,
                        fontSize: 12, fontWeight: 600,
                      }}>
                        {c}
                        <button type="button"
                          onClick={() => setLawyerForm(f => ({ ...f, certificates: f.certificates.filter((_, idx) => idx !== i) }))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4338ca', padding: 0, display: 'flex' }}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  {lawyerForm.certificates.length < 3 && (
                    <input
                      placeholder='Sertifikat nomini yozib Enter bosing'
                      style={inputStyle}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const val = (e.target as HTMLInputElement).value.trim()
                          if (val && !lawyerForm.certificates.includes(val)) {
                            setLawyerForm(f => ({ ...f, certificates: [...f.certificates, val] }))
                            ;(e.target as HTMLInputElement).value = ''
                          }
                        }
                      }} />
                  )}
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>
                    Masalan: "Korporativ huquq sertifikat", "Mehnat huquqi kursi"
                  </p>
                </div>
              </div>
            </details>

            {/* ════════════════════════════ */}
            {/* ⚖️ LITSENZIYA (ixtiyoriy)     */}
            {/* ════════════════════════════ */}
            <details style={detailsStyle}>
              <summary style={summaryStyle}>
                <span style={summaryLeftStyle}>
                  <span style={summaryIconStyle}>⚖️</span>
                  <span>
                    <p style={summaryTitleStyle}>Advokatlik litsenziyasi</p>
                    <p style={summarySubStyle}>Ixtiyoriy — litsenziyasi bor advokatlar uchun</p>
                  </span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }} onClick={e => e.preventDefault()}>
                  <PrivacyToggle isPublic={visibility.license} onChange={v => toggleVisibility('license', v)} size="sm" />
                  <span style={summaryChevron}>▼</span>
                </span>
              </summary>
              <div style={detailsBodyStyle}>
                <div style={{
                  padding: '10px 13px', background: '#fef3c7', border: '1px solid #fde68a',
                  borderRadius: 9, marginBottom: 12, fontSize: 11.5, color: '#78350f', lineHeight: 1.55,
                }}>
                  💡 Litsenziyani kiritsangiz, profilda "Litsenziyalangan advokat" badge ko'rinadi
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <div>
                    <label style={miniLabelStyle}>Litsenziya raqami</label>
                    <input value={lawyerForm.license_number}
                      onChange={e => setLawyerForm(f => ({ ...f, license_number: e.target.value }))}
                      placeholder="№ 12345"
                      style={inputStyle} />
                  </div>
                  <div>
                    <label style={miniLabelStyle}>Amal qilish muddati</label>
                    <input type="date"
                      value={lawyerForm.license_valid_until}
                      onChange={e => setLawyerForm(f => ({ ...f, license_valid_until: e.target.value }))}
                      style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label style={miniLabelStyle}>Beruvchi organ</label>
                  <input value={lawyerForm.license_authority}
                    onChange={e => setLawyerForm(f => ({ ...f, license_authority: e.target.value }))}
                    placeholder="O'zbekiston Respublikasi Adliya vazirligi"
                    style={inputStyle} />
                </div>
              </div>
            </details>

            {/* ════════════════════════════ */}
            {/* 🌐 IJTIMOIY TARMOQLAR        */}
            {/* ════════════════════════════ */}
            <details style={detailsStyle}>
              <summary style={summaryStyle}>
                <span style={summaryLeftStyle}>
                  <span style={summaryIconStyle}>🌐</span>
                  <span>
                    <p style={summaryTitleStyle}>Aloqa va ijtimoiy tarmoqlar</p>
                    <p style={summarySubStyle}>Telegram, LinkedIn, veb-sayt</p>
                  </span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }} onClick={e => e.preventDefault()}>
                  <PrivacyToggle isPublic={visibility.social} onChange={v => toggleVisibility('social', v)} size="sm" />
                  <span style={summaryChevron}>▼</span>
                </span>
              </summary>
              <div style={detailsBodyStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                      <label style={{ ...miniLabelStyle, marginBottom: 0 }}>Umumiy telefon</label>
                      <PrivacyToggle isPublic={visibility.phone} onChange={v => toggleVisibility('phone', v)} size="sm" />
                    </div>
                    <input type="tel" value={lawyerForm.public_phone}
                      onChange={e => setLawyerForm(f => ({ ...f, public_phone: e.target.value }))}
                      placeholder="+998 90 123 45 67"
                      style={inputStyle} />
                    <p style={{ fontSize: 10.5, color: '#94a3b8', marginTop: 3 }}>
                      "Ochiq" bo'lsa, mijozlar bu raqamni ko'radi va to'g'ridan qo'ng'iroq qila oladi
                    </p>
                  </div>

                  <div>
                    <label style={miniLabelStyle}>✈️ Telegram</label>
                    <input value={lawyerForm.social_telegram}
                      onChange={e => setLawyerForm(f => ({ ...f, social_telegram: e.target.value.replace('@', '') }))}
                      placeholder="username (@ belgisisiz)"
                      style={inputStyle} />
                  </div>

                  <div>
                    <label style={miniLabelStyle}>💼 LinkedIn URL</label>
                    <input type="url" value={lawyerForm.social_linkedin}
                      onChange={e => setLawyerForm(f => ({ ...f, social_linkedin: e.target.value }))}
                      placeholder="https://linkedin.com/in/..."
                      style={inputStyle} />
                  </div>

                  <div>
                    <label style={miniLabelStyle}>🌐 Veb-sayt</label>
                    <input type="url" value={lawyerForm.website}
                      onChange={e => setLawyerForm(f => ({ ...f, website: e.target.value }))}
                      placeholder="https://..."
                      style={inputStyle} />
                  </div>
                </div>
              </div>
            </details>

            {/* Saved xabar */}
            {lawyerSaved && (
              <div style={{ padding: 12, borderRadius: 10, background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: 13, color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} color="#16a34a" /> Yurist ma'lumotlari saqlandi!
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={lawyerSaving}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '12px 20px', background: 'linear-gradient(135deg,#7c3aed,#4338ca)', color: '#fff', border: 'none',
                borderRadius: 11, fontSize: 14, fontWeight: 700,
                cursor: lawyerSaving ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(124,58,237,0.25)',
                opacity: lawyerSaving ? 0.7 : 1,
              }}>
              {lawyerSaving ? 'Saqlanmoqda...' : <><Save size={15} /> Yurist ma'lumotlarini saqlash</>}
            </button>
          </form>
        </div>
      )}

      {/* ════════════════════════════════════════ */}
      {/* OFIS JOYLASHUVI — XARITA (faqat yurist)   */}
      {/* ════════════════════════════════════════ */}
      {user?.role === 'lawyer' && (
        <div style={{
          background: '#fff', borderRadius: 18, padding: 28, marginTop: 20,
          border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 11, background: '#fef2f2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MapPin size={19} color="#dc2626" />
              </div>
              <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>Ofis joylashuvi</p>
            </div>
            <PrivacyToggle isPublic={visibility.location} onChange={v => toggleVisibility('location', v)} size="sm" />
          </div>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 18, marginLeft: 48 }}>
            Mijozlar sizni xaritadan topishi uchun ofisingiz joyini belgilang. "Ochiq" bo'lsa xaritada va profilda ko'rinadi.
          </p>
          <LocationPicker
            userId={user.id}
            initialLat={lawyerForm.latitude ? parseFloat(lawyerForm.latitude) : null}
            initialLng={lawyerForm.longitude ? parseFloat(lawyerForm.longitude) : null}
            initialAddress={lawyerForm.office_address || null}
            initialName={lawyerForm.office_name || null}
            initialHours={lawyerForm.office_hours || null}
            initialPhotos={lawyerForm.office_photos || null}
          />
        </div>
      )}

      {/* ════════════════════════════════════════ */}
      {/* HUJJATLAR VA VERIFIKATSIYA (yurist)      */}
      {/* ════════════════════════════════════════ */}
      {user?.role === 'lawyer' && (
        <div style={{
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18,
          padding: 24, marginBottom: 20,
        }}>
          <VerificationManager defaultName={form.full_name} />
        </div>
      )}

      {/* ════════════════════════════════════════ */}
      {/* BILDIRISHNOMA SOZLAMALARI                */}
      {/* ════════════════════════════════════════ */}
      <NotificationSettings userId={user?.id} />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
// ────────────────────────────────────────
// BILDIRISHNOMA SOZLAMALARI - sub komponent
// ────────────────────────────────────────
function NotificationSettings({ userId }: { userId?: string }) {
  const { soundEnabled, setSoundEnabled, totalUnread } = useNotifications()
  const [pushStatus, setPushStatus] = useState<{
    isSubscribed: boolean
    permission: NotificationPermission | 'unsupported'
  }>({ isSubscribed: false, permission: 'default' })
  const [pushLoading, setPushLoading] = useState(false)
  const [pushError, setPushError] = useState('')

  // Joriy holatni yuklash
  useEffect(() => {
    if (typeof window === 'undefined') return
    getSubscriptionStatus().then(setPushStatus)
  }, [])

  const handlePushToggle = async () => {
    if (!userId) return
    setPushLoading(true)
    setPushError('')

    if (pushStatus.isSubscribed) {
      // Unsubscribe
      const res = await unsubscribeFromPush(userId)
      if (!res.success) {
        setPushError(res.error || 'Xato')
      }
    } else {
      // Subscribe
      const res = await subscribeToPush(userId)
      if (!res.success) {
        setPushError(res.error || 'Xato')
      }
    }

    const newStatus = await getSubscriptionStatus()
    setPushStatus(newStatus)
    setPushLoading(false)
  }

  const supported = pushStatus.permission !== 'unsupported'
  const denied = pushStatus.permission === 'denied'

  return (
    <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 16, marginBottom: 16, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '18px 22px',
        background: 'linear-gradient(135deg, #fafafa, #fff)',
        borderBottom: '0.5px solid #e2e8f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34,
            background: '#0f172a', borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bell size={16} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.2px' }}>
              Bildirishnomalar
            </h2>
            <p style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 1 }}>
              Yangi xabarlar haqida xabardor bo'lish
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '6px 0' }}>

        {/* ─── Push notification (yangi) ─── */}
        <div style={{ padding: '14px 22px', borderBottom: '0.5px solid #f1f5f9' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <Smartphone size={14} color={pushStatus.isSubscribed ? '#0f172a' : '#94a3b8'} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                  Telefon bildirishnomasi
                </span>
                {pushStatus.isSubscribed && (
                  <span style={{
                    fontSize: 9, fontWeight: 700,
                    background: '#dcfce7', color: '#166534',
                    padding: '2px 6px', borderRadius: 4,
                    letterSpacing: '0.3px',
                  }}>
                    YOQILGAN
                  </span>
                )}
              </div>
              <p style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.5 }}>
                Sayt yopiq bo'lsa ham yangi xabarlar telefonga keladi
              </p>
            </div>

            {/* Toggle */}
            <button
              type="button"
              onClick={handlePushToggle}
              disabled={!supported || denied || pushLoading || !userId}
              style={{
                width: 44, height: 26,
                background: pushStatus.isSubscribed ? '#0f172a' : '#cbd5e1',
                border: 'none', borderRadius: 100,
                cursor: (!supported || denied || pushLoading) ? 'not-allowed' : 'pointer',
                position: 'relative',
                transition: 'background 200ms',
                flexShrink: 0,
                opacity: (!supported || denied) ? 0.4 : 1,
              }}>
              <div style={{
                position: 'absolute',
                top: 3, left: pushStatus.isSubscribed ? 21 : 3,
                width: 20, height: 20,
                background: '#fff', borderRadius: '50%',
                transition: 'left 200ms',
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {pushLoading && <Loader2 size={11} color="#0f172a" style={{ animation: 'spin 1s linear infinite' }} />}
              </div>
            </button>
          </div>

          {/* Status xabarlar */}
          {!supported && (
            <div style={{
              marginTop: 10, padding: '8px 11px',
              background: '#fafafa', borderRadius: 8,
              fontSize: 11, color: '#64748b', lineHeight: 1.5,
            }}>
              Brauzeringiz push notification'larni qo'llab-quvvatlamaydi. Chrome yoki Safari (iOS 16.4+) ishlatib ko'ring.
            </div>
          )}
          {denied && (
            <div style={{
              marginTop: 10, padding: '8px 11px',
              background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
              fontSize: 11, color: '#991b1b', lineHeight: 1.5,
            }}>
              Bildirishnoma rad etilgan. Brauzer sozlamalaridan ruxsat bering: <strong>🔒 → Bildirishnomalar → Ruxsat</strong>
            </div>
          )}
          {pushError && (
            <div style={{
              marginTop: 10, padding: '8px 11px',
              background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
              fontSize: 11, color: '#991b1b',
            }}>
              {pushError}
            </div>
          )}
          {pushStatus.isSubscribed && (
            <div style={{
              marginTop: 10, padding: '8px 11px',
              background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8,
              display: 'flex', alignItems: 'center', gap: 7,
              fontSize: 11, color: '#166534',
            }}>
              <CheckCircle2 size={12} />
              <span>Bu qurilmada bildirishnomalar yoqilgan</span>
            </div>
          )}
        </div>

        {/* ─── Ilovani o'rnatish (PWA) ─── */}
        <InstallAppButton />

        {/* ─── Ovoz signali ─── */}
        <div style={{ padding: '14px 22px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                {soundEnabled ? <Volume2 size={14} color="#0f172a" /> : <VolumeX size={14} color="#94a3b8" />}
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                  Ovoz signali
                </span>
              </div>
              <p style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.5 }}>
                Sayt ochiq bo'lganda yangi xabar kelishi bilan ovoz
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{
                width: 44, height: 26,
                background: soundEnabled ? '#0f172a' : '#cbd5e1',
                border: 'none', borderRadius: 100,
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 200ms',
                flexShrink: 0,
              }}>
              <div style={{
                position: 'absolute',
                top: 3, left: soundEnabled ? 21 : 3,
                width: 20, height: 20,
                background: '#fff', borderRadius: '50%',
                transition: 'left 200ms',
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              }} />
            </button>
          </div>

          {/* Stats */}
          {totalUnread > 0 && (
            <div style={{
              marginTop: 14, padding: '10px 13px',
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', gap: 9,
            }}>
              <div style={{
                width: 26, height: 26,
                background: '#ef4444', borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MessageCircle size={13} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12.5, fontWeight: 700, color: '#991b1b' }}>
                  {totalUnread} ta o'qilmagan xabar
                </p>
                <p style={{ fontSize: 11, color: '#b91c1c', marginTop: 1 }}>
                  Suhbatlar bo'limiga kiring va javob bering
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 7
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', fontSize: 14,
  background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
  color: '#0f172a', outline: 'none', fontFamily: 'inherit'
}
const miniLabelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b',
  marginBottom: 5, textTransform: 'uppercase' as const, letterSpacing: '0.4px',
}
const detailsStyle: React.CSSProperties = {
  background: '#fafafa',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  overflow: 'hidden',
}
const summaryStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '14px 16px',
  cursor: 'pointer',
  listStyle: 'none',
  userSelect: 'none' as const,
}
const summaryLeftStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 12,
}
const summaryIconStyle: React.CSSProperties = {
  fontSize: 20,
}
const summaryTitleStyle: React.CSSProperties = {
  fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 1,
}
const summarySubStyle: React.CSSProperties = {
  fontSize: 11, color: '#94a3b8',
}
const summaryChevron: React.CSSProperties = {
  fontSize: 10, color: '#94a3b8',
}
const detailsBodyStyle: React.CSSProperties = {
  padding: '14px 16px 18px',
  borderTop: '1px solid #e2e8f0',
  background: '#fff',
}
