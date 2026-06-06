'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Scale, User, Briefcase, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'
import type { UserRole } from '@/lib/types'

function SignupForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [role, setRole] = useState<UserRole>((params.get('role') as UserRole) || 'client')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
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

    const supabase = createClient()

    // Username asosida email yaratamiz (ichki)
    const internalEmail = email || `${username}@yuristim.internal`

    const { error: signUpError } = await supabase.auth.signUp({
      email: internalEmail,
      password,
      options: {
        data: {
          role,
          full_name: fullName,
          username,
        },
        // Email tasdiqni o'chiramiz
        emailRedirectTo: undefined,
      }
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError("Bu username allaqachon band. Boshqa nom tanlang.")
      } else {
        setError("Xatolik yuz berdi. Qayta urinib ko'ring.")
      }
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const passwordStrength = () => {
    if (password.length === 0) return null
    if (password.length < 6) return { label: 'Juda qisqa', color: 'bg-red-400', width: '25%' }
    if (password.length < 8) return { label: 'Zaif', color: 'bg-orange-400', width: '50%' }
    if (password.length < 12) return { label: 'Yaxshi', color: 'bg-yellow-400', width: '75%' }
    return { label: 'Kuchli', color: 'bg-green-500', width: '100%' }
  }

  const strength = passwordStrength()

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
          <Scale size={22} className="text-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Yuristim</h1>
        <p className="text-sm text-slate-500 mt-1">Hisob yarating — bepul</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

        {/* Role tanlash */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button type="button" onClick={() => setRole('client')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              role === 'client'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
              role === 'client' ? 'bg-indigo-100' : 'bg-slate-100'
            }`}>
              <User size={16} className={role === 'client' ? 'text-indigo-600' : 'text-slate-400'} />
            </div>
            <p className={`text-sm font-semibold ${role === 'client' ? 'text-indigo-700' : 'text-slate-700'}`}>
              Mijoz
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Yurist izlayman</p>
          </button>

          <button type="button" onClick={() => setRole('lawyer')}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              role === 'lawyer'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${
              role === 'lawyer' ? 'bg-indigo-100' : 'bg-slate-100'
            }`}>
              <Briefcase size={16} className={role === 'lawyer' ? 'text-indigo-600' : 'text-slate-400'} />
            </div>
            <p className={`text-sm font-semibold ${role === 'lawyer' ? 'text-indigo-700' : 'text-slate-700'}`}>
              Yurist
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Mijoz topmoqchiman</p>
          </button>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* To'liq ism */}
          <div>
            <label className="label">To'liq ism</label>
            <input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="input"
              placeholder="Ism Familiya"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="label">Login (username)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">@</span>
              <input
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                className="input pl-8"
                placeholder="username"
                required
                minLength={3}
              />
            </div>
            <p className="helper-text">Faqat lotin harflari, raqamlar va _ belgisi</p>
          </div>

          {/* Parol */}
          <div>
            <label className="label">Parol</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input pr-10"
                placeholder="Kamida 6 ta belgi"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {strength && (
              <div className="mt-2">
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} transition-all duration-300`}
                    style={{ width: strength.width }} />
                </div>
                <p className="text-xs text-slate-400 mt-1">{strength.label}</p>
              </div>
            )}
          </div>

          {/* Email — ixtiyoriy */}
          <div>
            <label className="label">
              Email
              <span className="text-slate-400 font-normal ml-1">(ixtiyoriy)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input"
              placeholder="email@example.com"
            />
            <p className="helper-text">Parolni tiklash uchun kerak bo'ladi</p>
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
                Yaratilmoqda...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Hisob yaratish <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>

        {/* Features */}
        {role === 'lawyer' && (
          <div className="mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
            <div className="flex flex-col gap-1.5">
              {['14 kun bepul trial', 'Hech qanday karta kerak emas', 'Beta davri — hammasi bepul'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle size={13} className="text-indigo-500 flex-shrink-0" />
                  <span className="text-xs text-indigo-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-sm text-slate-500 mt-5">
          Hisob bormi?{' '}
          <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
            Kirish
          </Link>
        </p>
      </div>

      <p className="text-center text-xs text-slate-400 mt-5">
        Ro'yxatdan o'tish orqali{' '}
        <span className="text-slate-500 font-medium">Foydalanish shartlari</span>
        {' '}ga rozilik bildirasiz
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
          <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  )
}
