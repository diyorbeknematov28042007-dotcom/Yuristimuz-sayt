'use client'

import { useState, Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Scale, User, Briefcase, Eye, EyeOff, ArrowRight, CheckCircle2, X, Loader2 } from 'lucide-react'

function SignupForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [role, setRole] = useState((params.get('role') as 'client' | 'lawyer') || 'client')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Username real-time check
  const [usernameCheck, setUsernameCheck] = useState<{
    status: 'idle' | 'checking' | 'available' | 'taken'
    suggestions: string[]
  }>({ status: 'idle', suggestions: [] })

  useEffect(() => {
    if (username.length < 3) {
      setUsernameCheck({ status: 'idle', suggestions: [] })
      return
    }
    setUsernameCheck(s => ({ ...s, status: 'checking' }))
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/auth/check-username', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }),
        })
        const data = await res.json()
        setUsernameCheck({
          status: data.available ? 'available' : 'taken',
          suggestions: data.suggestions || [],
        })
      } catch {
        setUsernameCheck({ status: 'idle', suggestions: [] })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [username])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== passwordConfirm) {
      setError("Parollar mos kelmaydi")
      setLoading(false)
      return
    }

    if (usernameCheck.status === 'taken') {
      setError("Bu login band. Boshqa nom tanlang.")
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, full_name: fullName, role }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Xatolik yuz berdi")
        setLoading(false)
        return
      }

      // Profil to'ldirish sahifasiga yo'naltirish
      router.push('/dashboard/settings?welcome=1')
      router.refresh()
    } catch {
      setError("Tarmoq xatosi")
      setLoading(false)
    }
  }

  const strength = (() => {
    if (password.length === 0) return null
    if (password.length < 6) return { label: 'Juda qisqa', color: '#f87171', width: '25%' }
    if (password.length < 8) return { label: 'Zaif', color: '#fb923c', width: '50%' }
    if (password.length < 12) return { label: 'Yaxshi', color: '#facc15', width: '75%' }
    return { label: 'Kuchli', color: '#22c55e', width: '100%' }
  })()

  const passwordsMatch = passwordConfirm.length > 0 && password === passwordConfirm

  return (
    <div style={{ width: '100%', maxWidth: 460 }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ width: 52, height: 52, background: '#0f172a', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 14px rgba(15,23,42,0.2)' }}>
          <Scale size={24} color="#fff" strokeWidth={2.5} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 6 }}>Yuristim</h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>Kim sifatida ro'yxatdan o'tmoqchisiz?</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 18, border: '0.5px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', padding: 24 }}>

        {/* Role tanlash */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
          {[
            { val: 'client', icon: <User size={16} />, title: 'Mijoz', desc: 'Yurist izlayman' },
            { val: 'lawyer', icon: <Briefcase size={16} />, title: 'Yurist', desc: 'Mijoz topmoqchiman' },
          ].map(opt => (
            <button key={opt.val} type="button" onClick={() => setRole(opt.val as any)}
              style={{
                padding: 14, borderRadius: 12, textAlign: 'left', cursor: 'pointer',
                border: role === opt.val ? '2px solid #0f172a' : '1px solid #e2e8f0',
                background: role === opt.val ? '#f8fafc' : '#fff',
                transition: 'all 150ms',
              }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, background: role === opt.val ? '#0f172a' : '#f1f5f9' }}>
                <span style={{ color: role === opt.val ? '#fff' : '#94a3b8' }}>{opt.icon}</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>{opt.title}</p>
              <p style={{ fontSize: 11, color: '#94a3b8' }}>{opt.desc}</p>
            </button>
          ))}
        </div>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* To'liq ism */}
          <div>
            <label style={labelStyle}>To'liq ism</label>
            <input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              style={inputStyle}
              placeholder="Ism Familiya"
              required
            />
          </div>

          {/* Login */}
          <div>
            <label style={labelStyle}>Login</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>@</span>
              <input
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                style={{ ...inputStyle, paddingLeft: 28 }}
                placeholder="username"
                required
                minLength={3}
              />
              {/* Status indikator */}
              <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
                {usernameCheck.status === 'checking' && <Loader2 size={14} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />}
                {usernameCheck.status === 'available' && <CheckCircle2 size={16} color="#22c55e" />}
                {usernameCheck.status === 'taken' && <X size={16} color="#ef4444" />}
              </div>
            </div>
            
            {usernameCheck.status === 'available' && (
              <p style={{ fontSize: 11, color: '#16a34a', marginTop: 4, fontWeight: 500 }}>✓ Bu login mavjud — siz uchun</p>
            )}
            {usernameCheck.status === 'taken' && (
              <div style={{ marginTop: 6 }}>
                <p style={{ fontSize: 11, color: '#dc2626', fontWeight: 500, marginBottom: 6 }}>Bu login band</p>
                {usernameCheck.suggestions.length > 0 && (
                  <div>
                    <p style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Tavsiya:</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {usernameCheck.suggestions.map(s => (
                        <button key={s} type="button" onClick={() => setUsername(s)}
                          style={{ background: '#eef2ff', color: '#4338ca', border: 'none', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                          @{s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            {usernameCheck.status === 'idle' && username.length === 0 && (
              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Lotin harflari, raqamlar, _ va . belgilari</p>
            )}
          </div>

          {/* Parol */}
          <div>
            <label style={labelStyle}>Parol</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: 40 }}
                placeholder="Kamida 6 ta belgi"
                required
                minLength={6}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={eyeBtnStyle}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {strength && (
              <div style={{ marginTop: 8 }}>
                <div style={{ height: 3, background: '#f1f5f9', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: strength.color, width: strength.width, transition: 'all 300ms' }} />
                </div>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{strength.label}</p>
              </div>
            )}
          </div>

          {/* Parolni takrorlash */}
          <div>
            <label style={labelStyle}>Parolni takrorlang</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                style={{ 
                  ...inputStyle, 
                  paddingRight: 40,
                  borderColor: passwordConfirm.length > 0 ? (passwordsMatch ? '#86efac' : '#fca5a5') : '#e2e8f0'
                }}
                placeholder="Bir xil parolni qayta kiriting"
                required
              />
              <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
                {passwordConfirm.length > 0 && passwordsMatch && <CheckCircle2 size={16} color="#22c55e" />}
                {passwordConfirm.length > 0 && !passwordsMatch && <X size={16} color="#ef4444" />}
              </div>
            </div>
            {passwordConfirm.length > 0 && !passwordsMatch && (
              <p style={{ fontSize: 11, color: '#dc2626', marginTop: 4, fontWeight: 500 }}>Parollar mos kelmaydi</p>
            )}
          </div>

          {error && (
            <div style={{ padding: 12, borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || usernameCheck.status === 'taken' || !passwordsMatch}
            style={primaryButtonStyle(loading || usernameCheck.status === 'taken' || !passwordsMatch)}>
            {loading ? 'Yaratilmoqda...' : <>Ro'yxatdan o'tish <ArrowRight size={15} /></>}
          </button>
        </form>

        {role === 'lawyer' && (
          <div style={{ marginTop: 16, padding: 14, background: '#f0fdf4', borderRadius: 11, border: '1px solid #bbf7d0' }}>
            {['14 kun bepul trial', 'Karta kerak emas', 'Beta — hammasi bepul'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 12, color: '#166534', fontWeight: 600 }}>
                <CheckCircle2 size={13} color="#22c55e" />
                {item}
              </div>
            ))}
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 20 }}>
          Hisob bormi?{' '}
          <Link href="/auth/login" style={{ color: '#0f172a', fontWeight: 700, textDecoration: 'none' }}>
            Kirish
          </Link>
        </p>
      </div>

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: 14, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#0f172a', outline: 'none', fontFamily: 'inherit' }
const eyeBtnStyle: React.CSSProperties = { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }
const primaryButtonStyle = (disabled: boolean): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  padding: '12px 20px', background: '#0f172a', color: '#fff', border: 'none',
  borderRadius: 11, fontSize: 14, fontWeight: 700,
  cursor: disabled ? 'not-allowed' : 'pointer',
  boxShadow: '0 4px 14px rgba(15,23,42,0.25)', marginTop: 4,
  opacity: disabled ? 0.5 : 1, transition: 'all 200ms',
})

export default function SignupPage() {
  return (
    <Suspense fallback={<div style={{ width: '100%', maxWidth: 460 }}><div style={{ background: '#fff', borderRadius: 18, padding: 40, textAlign: 'center', border: '0.5px solid #e2e8f0' }}>Yuklanmoqda...</div></div>}>
      <SignupForm />
    </Suspense>
  )
}
