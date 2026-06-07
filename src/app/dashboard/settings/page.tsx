'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import {
  User, Mail, Phone, MapPin, FileText,
  CheckCircle2, X, Sparkles, Save, AlertCircle
} from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SettingsPage() {
  const params = useSearchParams()
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
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
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
