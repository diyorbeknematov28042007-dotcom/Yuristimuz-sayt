'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Scale, Mail, KeyRound, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react'

type Step = 'email' | 'code' | 'password' | 'success'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [demoCode, setDemoCode] = useState('') // DEMO MODE

  // STEP 1: Email yuborish
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Xatolik")
        setLoading(false)
        return
      }

      // DEMO MODE: kodni ko'rsatamiz
      if (data.demo_code) setDemoCode(data.demo_code)
      
      setStep('code')
      setLoading(false)
    } catch {
      setError("Tarmoq xatosi")
      setLoading(false)
    }
  }

  // STEP 2: Kod tekshirish
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Kod noto'g'ri")
        setLoading(false)
        return
      }

      setStep('password')
      setLoading(false)
    } catch {
      setError("Tarmoq xatosi")
      setLoading(false)
    }
  }

  // STEP 3: Yangi parol
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== passwordConfirm) {
      setError("Parollar mos kelmaydi")
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Xatolik")
        setLoading(false)
        return
      }

      setStep('success')
      setLoading(false)
      
      setTimeout(() => router.push('/auth/login'), 2500)
    } catch {
      setError("Tarmoq xatosi")
      setLoading(false)
    }
  }

  // Progress indicator
  const stepNum = { email: 1, code: 2, password: 3, success: 3 }[step]

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ width: 52, height: 52, background: '#0f172a', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 14px rgba(15,23,42,0.2)' }}>
          <KeyRound size={22} color="#fff" strokeWidth={2.5} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 6 }}>Parolni tiklash</h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          {step === 'email' && 'Email manzilingizni kiriting'}
          {step === 'code' && 'Emailga yuborilgan 6 raqamli kodni kiriting'}
          {step === 'password' && 'Yangi parolni belgilang'}
          {step === 'success' && 'Parol muvaffaqiyatli o\'zgartirildi!'}
        </p>
      </div>

      {/* Progress bar */}
      {step !== 'success' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '0 8px' }}>
          {[1, 2, 3].map(n => (
            <div key={n} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 8,
                background: n <= stepNum ? '#0f172a' : '#e2e8f0',
                color: n <= stepNum ? '#fff' : '#94a3b8',
                fontSize: 11, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 200ms',
              }}>
                {n < stepNum ? <CheckCircle2 size={14} /> : n}
              </div>
              {n < 3 && (
                <div style={{ flex: 1, height: 2, background: n < stepNum ? '#0f172a' : '#e2e8f0', borderRadius: 100, transition: 'all 200ms' }} />
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 18, border: '0.5px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', padding: 28 }}>

        {/* STEP 1: EMAIL */}
        {step === 'email' && (
          <form onSubmit={handleSendCode} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 36 }}
                  placeholder="email@example.com"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>Profilingizga ulangan email manziliga 6 raqamli kod yuboriladi</p>
            </div>

            {error && <ErrorBox text={error} />}

            <button type="submit" disabled={loading} style={primaryBtn(loading)}>
              {loading ? 'Yuborilmoqda...' : <>Kod yuborish <ArrowRight size={15} /></>}
            </button>

            <Link href="/auth/login" style={backLinkStyle}>
              <ArrowLeft size={14} /> Loginga qaytish
            </Link>
          </form>
        )}

        {/* STEP 2: CODE */}
        {step === 'code' && (
          <form onSubmit={handleVerifyCode} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>6 raqamli kod</label>
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                style={{
                  ...inputStyle,
                  textAlign: 'center',
                  fontSize: 24,
                  letterSpacing: 8,
                  fontWeight: 700,
                  padding: '14px',
                  fontFamily: 'ui-monospace, monospace',
                }}
                placeholder="000000"
                required
                maxLength={6}
                autoFocus
              />
              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 5, textAlign: 'center' }}>
                Kod 15 daqiqa davomida amal qiladi
              </p>
            </div>

            {demoCode && (
              <div style={{ padding: 12, borderRadius: 10, background: '#fef3c7', border: '1px solid #fde68a', fontSize: 12, color: '#92400e' }}>
                <p style={{ fontWeight: 700, marginBottom: 4 }}>⚠️ DEMO MODE</p>
                <p>Email yuborish hali sozlanmagan. Kod: <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 14 }}>{demoCode}</span></p>
              </div>
            )}

            {error && <ErrorBox text={error} />}

            <button type="submit" disabled={loading || code.length !== 6} style={primaryBtn(loading || code.length !== 6)}>
              {loading ? 'Tekshirilmoqda...' : <>Davom etish <ArrowRight size={15} /></>}
            </button>

            <button type="button" onClick={() => setStep('email')} style={backLinkStyle}>
              <ArrowLeft size={14} /> Email ni o'zgartirish
            </button>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === 'password' && (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>Yangi parol</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: 40 }}
                  placeholder="Kamida 6 ta belgi"
                  required
                  minLength={6}
                  autoFocus
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Parolni takrorlang</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                style={{
                  ...inputStyle,
                  borderColor: passwordConfirm.length > 0 ? (password === passwordConfirm ? '#86efac' : '#fca5a5') : '#e2e8f0'
                }}
                placeholder="Yangi parol qaytadan"
                required
              />
            </div>

            {error && <ErrorBox text={error} />}

            <button type="submit" disabled={loading || password !== passwordConfirm || password.length < 6} 
              style={primaryBtn(loading || password !== passwordConfirm || password.length < 6)}>
              {loading ? "O'zgartirilmoqda..." : <>Parolni o'zgartirish <CheckCircle2 size={15} /></>}
            </button>
          </form>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 64, height: 64, background: '#dcfce7', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle2 size={32} color="#16a34a" />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Parol o'zgartirildi!</h3>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 20 }}>
              Yangi parolingiz bilan kirishingiz mumkin
            </p>
            <Link href="/auth/login" style={{ ...primaryBtn(false), textDecoration: 'none', display: 'inline-flex' }}>
              Loginga o'tish <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: 14, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#0f172a', outline: 'none', fontFamily: 'inherit' }
const primaryBtn = (disabled: boolean): React.CSSProperties => ({
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
  padding: '12px 20px', background: '#0f172a', color: '#fff', border: 'none',
  borderRadius: 11, fontSize: 14, fontWeight: 700,
  cursor: disabled ? 'not-allowed' : 'pointer',
  boxShadow: '0 4px 14px rgba(15,23,42,0.25)',
  opacity: disabled ? 0.5 : 1, transition: 'all 200ms',
})
const backLinkStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  fontSize: 13, color: '#64748b', fontWeight: 500, textDecoration: 'none',
  marginTop: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 4,
}

function ErrorBox({ text }: { text: string }) {
  return (
    <div style={{ padding: 12, borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b' }}>
      {text}
    </div>
  )
}
