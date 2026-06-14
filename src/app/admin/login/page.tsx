// ════════════════════════════════════════════════
// ADMIN LOGIN SAHIFA
// /src/app/admin/login/page.tsx
// ════════════════════════════════════════════════

'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Lock, User, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [locked, setLocked] = useState(false)
  const [remainingMin, setRemainingMin] = useState(0)
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null)

  // Yashirin yuklash: sahifani avtomatik fokusga olish
  useEffect(() => {
    const input = document.getElementById('username') as HTMLInputElement | null
    input?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Xato yuz berdi')
        if (data.locked) {
          setLocked(true)
          setRemainingMin(data.remainingMin || 15)
        }
        if (typeof data.remainingAttempts === 'number') {
          setRemainingAttempts(data.remainingAttempts)
        }
        setLoading(false)
        return
      }

      // Muvaffaqiyat — admin dashboard'ga
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      setError('Tarmoqda xato: ' + (err.message || 'noma\'lum'))
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '32px 28px 24px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          textAlign: 'center',
        }}>
          <div style={{
            width: 56,
            height: 56,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 14,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
            border: '1px solid rgba(255,255,255,0.15)',
          }}>
            <Shield size={26} color="#fff" />
          </div>
          <h1 style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.3px',
            marginBottom: 4,
          }}>
            Admin Panel
          </h1>
          <p style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.3px',
          }}>
            Yuristim boshqaruv tizimi
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
          {/* Username */}
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="username" style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: '#475569',
              marginBottom: 6,
            }}>
              Foydalanuvchi nomi
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="#94a3b8" style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
              }} />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading || locked}
                placeholder="diyorbek"
                autoComplete="username"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  fontSize: 14,
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: 10,
                  outline: 'none',
                  fontFamily: 'inherit',
                  color: '#0f172a',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#4338ca'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: '#475569',
              marginBottom: 6,
            }}>
              Parol
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#94a3b8" style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
              }} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || locked}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '12px 44px 12px 42px',
                  fontSize: 14,
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: 10,
                  outline: 'none',
                  fontFamily: 'inherit',
                  color: '#0f172a',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#4338ca'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  color: '#94a3b8',
                }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error xabari */}
          {error && (
            <div style={{
              padding: '10px 12px',
              background: locked ? '#fef2f2' : '#fff7ed',
              border: `1px solid ${locked ? '#fecaca' : '#fed7aa'}`,
              borderRadius: 8,
              marginBottom: 16,
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start',
            }}>
              <AlertCircle size={14} color={locked ? '#dc2626' : '#ea580c'} style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ flex: 1, fontSize: 12, color: locked ? '#991b1b' : '#9a3412', lineHeight: 1.5 }}>
                {error}
                {remainingAttempts !== null && remainingAttempts > 0 && !locked && (
                  <div style={{ marginTop: 4, fontSize: 11, color: '#a16207' }}>
                    Qolgan urinishlar: {remainingAttempts}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || locked || !username || !password}
            style={{
              width: '100%',
              padding: '12px',
              background: locked ? '#cbd5e1' : (loading || !username || !password ? '#94a3b8' : '#0f172a'),
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: locked || loading || !username || !password ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              transition: 'background 200ms',
            }}>
            {loading ? (
              <>
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                Tekshirilmoqda...
              </>
            ) : locked ? (
              `Bloklangan (${remainingMin} daqiqa)`
            ) : (
              'Kirish'
            )}
          </button>

          {/* Xavfsizlik haqida */}
          <div style={{
            marginTop: 20,
            padding: '10px 12px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            fontSize: 11,
            color: '#64748b',
            lineHeight: 1.5,
            textAlign: 'center',
          }}>
            🔒 Bu sahifa shaxsiy. Begona kishilar uchun emas.<br/>
            5 ta xato urinishdan keyin IP 15 daqiqaga bloklanadi.
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
