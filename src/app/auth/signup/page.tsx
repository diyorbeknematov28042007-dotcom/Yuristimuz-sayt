'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '@/lib/types'

export default function SignupPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [role, setRole] = useState<UserRole>((params.get('role') as UserRole) || 'client')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { role, full_name: fullName } }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="card p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ro'yxatdan o'tish</h1>
        <p className="text-gray-500 text-sm mb-6">Bepul hisob yarating</p>

        {/* Role tanlash */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {([
            { value: 'client', label: '👤 Mijoz', desc: 'Yurist izlayapman' },
            { value: 'lawyer', label: '⚖️ Yurist', desc: 'Mijoz topmoqchiman' },
          ] as const).map((r) => (
            <button key={r.value} type="button" onClick={() => setRole(r.value)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                role === r.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
              <div className="font-medium text-sm">{r.label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{r.desc}</div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To'liq ism</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)}
              className="input" placeholder="Ism Familiya" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="input" placeholder="email@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="input" placeholder="Kamida 6 ta belgi" minLength={6} required />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Yaratilmoqda...' : 'Hisob yaratish'}
          </button>
        </form>

        {role === 'lawyer' && (
          <p className="text-xs text-blue-600 bg-blue-50 rounded-lg p-3 mt-4 text-center">
            🎁 14 kun bepul trial — hech qanday karta kerak emas
          </p>
        )}

        <p className="text-center text-sm text-gray-500 mt-4">
          Hisob bormi?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">Kirish</Link>
        </p>
      </div>
    </div>
  )
}
