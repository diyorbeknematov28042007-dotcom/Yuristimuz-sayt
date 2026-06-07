'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Scale, User, Briefcase, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react'

function SignupForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [role, setRole] = useState((params.get('role') as 'client' | 'lawyer') || 'client')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password.length < 6) {
      setError("Parol kamida 6 ta belgidan iborat bo'lishi kerak")
      setLoading(false)
      return
    }

    if (username.length < 3) {
      setError("Login kamida 3 ta belgi bo'lishi kerak")
      setLoading(false)
      return
    }

    const supabase = createClient()

    // Ichki email: real domen ishlatamiz (gmail.com - real domen sifatida qabul qilinadi)
    const internalEmail = `${username}.yuristim@gmail.com`

    const { error: signUpError } = await supabase.auth.signUp({
      email: internalEmail,
      password,
      options: {
        data: {
          role,
          full_name: fullName,
          username,
        },
      }
    })

    if (signUpError) {
      console.error('Signup error:', signUpError)
      if (signUpError.message.includes('already') || signUpError.message.includes('exists')) {
        setError("Bu username allaqachon band. Boshqa nom tanlang.")
      } else if (signUpError.message.includes('Password')) {
        setError("Parol kamida 6 ta belgi bo'lishi kerak")
      } else {
        setError(signUpError.message || "Xatolik yuz berdi. Qayta urinib ko'ring.")
      }
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const strength = (() => {
    if (password.length === 0) return null
    if (password.length < 6) return { label: 'Juda qisqa', color: '#f87171', width: '25%' }
    if (password.length < 8) return { label: 'Zaif', color: '#fb923c', width: '50%' }
    if (password.length < 12) return { label: 'Yaxshi', color: '#facc15', width: '75%' }
    return { label: 'Kuchli', color: '#22c55e', width: '100%' }
  })()

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ width: 52, height: 52, background: '#0f172a', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 14px rgba(15,23,42,0.2)' }}>
          <Scale size={24} color="#fff" strokeWidth={2.5} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 6 }}>Yuristim</h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>Hisob yarating — bepul</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 18, border: '0.5px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', padding: 28 }}>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <button type="button" onClick={() => setRole('client')}
            style={{
              padding: 14, borderRadius: 12, textAlign: 'left', cursor: 'pointer',
              border: role === 'client' ? '2px solid #0f172a' : '1px solid #e2e8f0',
              background: role === 'client' ? '#f8fafc' : '#fff',
              transition: 'all 150ms',
            }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, background: role === 'client' ? '#0f172a' : '#f1f5f9' }}>
              <User size={16} color={role === 'client' ? '#fff' : '#94a3b8'} />
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>Mijoz</p>
            <p style={{ fontSize: 11, color: '#94a3b8' }}>Yurist izlayman</p>
          </button>

          <button type="button" onClick={() => setRole('lawyer')}
            style={{
              padding: 14, borderRadius: 12, textAlign: 'left', cursor: 'pointer',
              border: role === 'lawyer' ? '2px solid #0f172a' : '1px solid #e2e8f0',
              background: role === 'lawyer' ? '#f8fafc' : '#fff',
              transition: 'all 150ms',
            }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, background: role === 'lawyer' ? '#0f172a' : '#f1f5f9' }}>
              <Briefcase size={16} color={role === 'lawyer' ? '#fff' : '#94a3b8'} />
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 2 }}>Yurist</p>
            <p style={{ fontSize: 11, color: '#94a3b8' }}>Mijoz topmoqchiman</p>
          </button>
        </div>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>To'liq ism</label>
            <input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', fontSize: 14, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#0f172a', outline: 'none', fontFamily: 'inherit' }}
              placeholder="Ism Familiya"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Login</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>@</span>
              <input
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                style={{ width: '100%', padding: '10px 14px 10px 28px', fontSize: 14, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#0f172a', outline: 'none', fontFamily: 'inherit' }}
                placeholder="username"
                required
                minLength={3}
              />
            </div>
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Lotin harflari, raqamlar va _ belgisi</p>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Parol</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 40px 10px 14px', fontSize: 14, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#0f172a', outline: 'none', fontFamily: 'inherit' }}
                placeholder="Kamida 6 ta belgi"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
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

          {error && (
            <div style={{ padding: 12, borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '12px 20px', background: '#0f172a', color: '#fff', border: 'none',
              borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(15,23,42,0.25)', marginTop: 8,
              opacity: loading ? 0.7 : 1,
            }}>
            {loading ? 'Yaratilmoqda...' : <>Hisob yaratish <ArrowRight size={15} /></>}
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
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ background: '#fff', borderRadius: 18, padding: 40, textAlign: 'center', border: '0.5px solid #e2e8f0' }}>
          Yuklanmoqda...
        </div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}
