'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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

    const supabase = createClient()

    // Username dan email yasaymiz
    const internalEmail = username.includes('@')
      ? username
      : `${username}@yuristim.internal`

    const { error } = await supabase.auth.signInWithPassword({
      email: internalEmail,
      password,
    })

    if (error) {
      setError("Login yoki parol noto'g'ri. Qayta urinib ko'ring.")
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
          <Scale size={22} className="text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Yuristim</h1>
        <p className="text-sm text-slate-500 mt-1">Hisobingizga kiring</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Username */}
          <div>
            <label className="label">Login</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">@</span>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="input pl-8"
                placeholder="username yoki email"
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Parol */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0">Parol</label>
              <Link href="/auth/forgot-password"
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                Parolni unutdingizmi?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input pr-10"
                placeholder="Parolingiz"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="alert-error">
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary btn-md w-full mt-2">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Kirilmoqda...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Kirish <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>

        <div className="divider my-5" />

        <p className="text-center text-sm text-slate-500">
          Hisob yo'qmi?{' '}
          <Link href="/auth/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold">
            Bepul ro'yxatdan o'ting
          </Link>
        </p>
      </div>

      {/* Beta note */}
      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
        <p className="text-xs text-slate-500">
          🎉 Beta versiya — barcha xizmatlar <span className="font-semibold text-slate-700">bepul</span>
        </p>
      </div>
    </div>
  )
}
