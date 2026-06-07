'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Scale, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login yoki parol noto'g'ri")
        setLoading(false)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError("Tarmoq xatosi")
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 440 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ width: 52, height: 52, background: '#0f172a', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 14px rgba(15,23,42,0.2)' }}>
          <Scale size={24} color="#fff" strokeWidth={2.5} />
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 6 }}>Yuristim</h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>Hisobingizga kiring</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 18, border: '0.5px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.04)', padding: 28 }}>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Login</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>@</span>
              <input
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                style={{ width: '100%', padding: '10px 14px 10px 28px', fontSize: 14, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#0f172a', outline: 'none', fontFamily: 'inherit' }}
                placeholder="username"
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Parol</label>
              <Link href="/auth/forgot-password" style={{ fontSize: 12, color: '#4338ca', textDecoration: 'none', fontWeight: 600 }}>
                Parolni unutdingizmi?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 40px 10px 14px', fontSize: 14, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#0f172a', outline: 'none', fontFamily: 'inherit' }}
                placeholder="Parolingiz"
                required
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
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
              boxShadow: '0 4px 14px rgba(15,23,42,0.25)', marginTop: 4,
              opacity: loading ? 0.7 : 1,
            }}>
            {loading ? 'Kirilmoqda...' : <>Kirish <ArrowRight size={15} /></>}
          </button>
        </form>

        <div style={{ borderTop: '0.5px solid #f1f5f9', marginTop: 20, paddingTop: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            Hisob yo'qmi?{' '}
            <Link href="/auth/signup" style={{ color: '#0f172a', fontWeight: 700, textDecoration: 'none' }}>
              Bepul ro'yxatdan o'ting
            </Link>
          </p>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: 12, background: '#fafafa', borderRadius: 11, border: '0.5px solid #e2e8f0', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#64748b' }}>
          🎉 Beta versiya — barcha xizmatlar <span style={{ fontWeight: 700, color: '#0f172a' }}>bepul</span>
        </p>
      </div>
    </div>
  )
}
