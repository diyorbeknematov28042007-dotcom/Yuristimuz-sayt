'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { SPECIALIZATIONS, LOCATIONS } from '@/lib/types'

export default function NewAdPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    description: '',
    specialization: '',
    location: '',
    price_from: '',
    price_to: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { data: profile } = await supabase
      .from('profiles').select('role').eq('id', user.id).single()

    const { error } = await supabase.from('ads').insert({
      user_id: user.id,
      role: profile?.role,
      title: form.title,
      description: form.description,
      specialization: form.specialization,
      location: form.location || null,
      price_from: form.price_from ? parseInt(form.price_from) : null,
      price_to: form.price_to ? parseInt(form.price_to) : null,
    })

    if (error) { setError(error.message); setLoading(false) }
    else router.push('/dashboard/ads')
  }

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Elon joylash</h1>
        <p className="text-gray-500 text-sm mt-1">Eloningiz barcha foydalanuvchilarga ko'rinadi</p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sarlavha <span className="text-red-500">*</span>
            </label>
            <input value={form.title} onChange={set('title')} className="input"
              placeholder="Masalan: Mehnat nizosi bo'yicha maslahat kerak" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tavsif <span className="text-red-500">*</span>
            </label>
            <textarea value={form.description} onChange={set('description')} className="input min-h-[100px]"
              placeholder="Muammoni batafsil tushuntiring..." required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Soha <span className="text-red-500">*</span>
            </label>
            <select value={form.specialization} onChange={set('specialization')} className="input" required>
              <option value="">Tanlang...</option>
              {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Viloyat</label>
            <select value={form.location} onChange={set('location')} className="input">
              <option value="">Tanlang (ixtiyoriy)</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Narx (dan, $)</label>
              <input type="number" value={form.price_from} onChange={set('price_from')}
                className="input" placeholder="200" min="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Narx (gacha, $)</label>
              <input type="number" value={form.price_to} onChange={set('price_to')}
                className="input" placeholder="500" min="0" />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => router.back()} className="btn-secondary flex-1">
              Bekor qilish
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Joylashtirilmoqda...' : 'Elon joylash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
