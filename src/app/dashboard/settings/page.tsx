'use client'
import { supabase } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  User, Mail, Phone, MapPin, FileText,
  CheckCircle2, X, Sparkles, Save, AlertCircle,
  Briefcase, Award, Clock, Languages, DollarSign
} from 'lucide-react'

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
  })

  // Yurist uchun qo'shimcha state
  const [lawyerForm, setLawyerForm] = useState({
    specialization: [] as string[],
    experience_years: '',
    hourly_rate: '',
    description: '',
    languages: ['O\'zbekcha'] as string[],
    response_time: '24 soat ichida',
  })
  const [lawyerSaved, setLawyerSaved] = useState(false)
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
            })
          }
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
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Saqlashda xatolik")
      } else {
        setLawyerSaved(true)
        setTimeout(() => setLawyerSaved(false), 3000)
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

  const toggleLang = (lang: string) => {
    setLawyerForm(f => ({
      ...f,
      languages: f.languages.includes(lang)
        ? f.languages.filter(l => l !== lang)
        : [...f.languages, lang]
    }))
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
          <div style={{ padding: '20px 24px', borderBottom: '0.5px solid #f1f5f9', background: 'linear-gradient(135deg, #faf5ff, #ede9fe)', display: 'flex', alignItems: 'center', gap: 14 }}>
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

          <form onSubmit={handleSaveLawyer} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Ixtisoslik */}
            <div>
              <label style={labelStyle}>
                <Award size={13} /> Ixtisoslik
                <span style={{ marginLeft: 4, fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
                  ({lawyerForm.specialization.length} tanlandi)
                </span>
              </label>
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
                <label style={labelStyle}>
                  <Clock size={13} /> Tajriba
                </label>
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
                <label style={labelStyle}>
                  <DollarSign size={13} /> Soatlik narx
                </label>
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
              <label style={labelStyle}>
                <Languages size={13} /> Bilish tillari
              </label>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {LANGUAGES.map(lang => {
                  const active = lawyerForm.languages.includes(lang)
                  return (
                    <button type="button" key={lang} onClick={() => toggleLang(lang)}
                      style={{
                        padding: '7px 14px', borderRadius: 100,
                        border: active ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
                        background: active ? '#f1f5f9' : '#fff',
                        color: active ? '#0f172a' : '#475569',
                        fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                        transition: 'all 150ms', fontFamily: 'inherit',
                      }}>
                      {active ? '✓ ' : ''}{lang}
                    </button>
                  )
                })}
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
              <label style={labelStyle}>
                <FileText size={13} /> Professional tavsif
                <span style={{ marginLeft: 4, fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>
                  ({lawyerForm.description.length}/500)
                </span>
              </label>
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
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
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
