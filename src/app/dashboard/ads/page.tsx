'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Plus, Scale, User, MapPin, Star, BadgeCheck, MessageCircle, X, ChevronDown, Filter } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CATEGORIES = ['Oilaviy', 'Biznes', 'Mulk', 'Mehnat', 'Soliq', 'Jinoyat', 'Shartnoma', 'Migratsiya']
const CITIES = ['Toshkent', 'Samarqand', 'Buxoro', 'Namangan', 'Andijon', 'Farg\'ona', 'Nukus', 'Qarshi']

export default function AdsPage() {
  const [user, setUser] = useState<any>(null)
  const [tab, setTab] = useState<'lawyer' | 'client'>('lawyer')
  const [ads, setAds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('')

  // Create ad form
  const [form, setForm] = useState({ title: '', description: '', category: '', city: '', budget_min: '', budget_max: '' })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  useEffect(() => {
    const init = async () => {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      setUser(data.user)
      fetchAds(tab, '')
    }
    init()
  }, [])

  const fetchAds = async (role: string, category: string) => {
    setLoading(true)
    const { data } = await supabase.rpc('get_ads', {
      p_role_filter: role,
      p_category: category || null,
      p_limit: 30,
      p_offset: 0
    })
    setAds(data || [])
    setLoading(false)
  }

  const handleTabChange = (t: 'lawyer' | 'client') => {
    setTab(t)
    setCategoryFilter('')
    fetchAds(t, '')
  }

  const handleCategoryFilter = (cat: string) => {
    const newCat = cat === categoryFilter ? '' : cat
    setCategoryFilter(newCat)
    fetchAds(tab, newCat)
  }

  const handleCreateAd = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setCreateError('')

    if (!form.title || !form.description || !form.category) {
      setCreateError("Sarlavha, tavsif va kategoriyani kiriting")
      setCreating(false)
      return
    }

    try {
      const res = await fetch('/api/ads/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          city: form.city || null,
          budget_min: form.budget_min ? parseFloat(form.budget_min) : null,
          budget_max: form.budget_max ? parseFloat(form.budget_max) : null,
        })
      })
      const data = await res.json()
      if (!res.ok) { setCreateError(data.error || "Xatolik"); setCreating(false); return }
      setShowCreate(false)
      setForm({ title: '', description: '', category: '', city: '', budget_min: '', budget_max: '' })
      fetchAds(tab, categoryFilter)
    } catch {
      setCreateError("Tarmoq xatosi")
    }
    setCreating(false)
  }

  const initials = (name: string) => name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>E'lonlar</h1>
        <button onClick={() => setShowCreate(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#0f172a', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(15,23,42,0.2)' }}>
          <Plus size={15} /> E'lon qo'shish
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16, background: '#f1f5f9', borderRadius: 12, padding: 4 }}>
        {[
          { val: 'lawyer', icon: <Scale size={15} />, label: "Yurist e'lonlari" },
          { val: 'client', icon: <User size={15} />, label: "Mijoz e'lonlari" },
        ].map(t => (
          <button key={t.val} onClick={() => handleTabChange(t.val as any)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              padding: '10px', borderRadius: 9, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, transition: 'all 150ms',
              background: tab === t.val ? '#fff' : 'transparent',
              color: tab === t.val ? '#0f172a' : '#64748b',
              boxShadow: tab === t.val ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 4, marginBottom: 20 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => handleCategoryFilter(cat)}
            style={{
              flexShrink: 0, padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 600, transition: 'all 150ms',
              background: categoryFilter === cat ? '#0f172a' : '#f1f5f9',
              color: categoryFilter === cat ? '#fff' : '#475569',
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* E'lonlar ro'yxati */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <div style={{ width: 24, height: 24, border: '3px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : ads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', background: '#fafafa', borderRadius: 16, border: '0.5px solid #e2e8f0' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>E'lonlar yo'q</p>
          <p style={{ fontSize: 12, color: '#94a3b8' }}>Birinchi bo'ling!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ads.map(ad => (
            <div key={ad.id} style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 16, padding: 18, transition: 'all 200ms' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#0f172a'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'}>
              {/* Poster */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: '0.5px solid #f1f5f9' }}>
                <div style={{ width: 36, height: 36, background: ad.poster_role === 'lawyer' ? 'linear-gradient(135deg,#0f172a,#4338ca)' : '#f1f5f9', color: ad.poster_role === 'lawyer' ? '#fff' : '#64748b', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                  {initials(ad.poster_name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{ad.poster_name}</span>
                    {ad.poster_verified && <BadgeCheck size={13} color="#3b82f6" />}
                  </div>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>@{ad.poster_username}</span>
                </div>
                {ad.poster_role === 'lawyer' && ad.poster_rating > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Star size={12} color="#f59e0b" fill="#f59e0b" />
                    <span style={{ fontSize: 12, fontWeight: 700 }}>{parseFloat(ad.poster_rating).toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* E'lon */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>{ad.title}</h3>
                  <span style={{ fontSize: 10, fontWeight: 700, background: '#eef2ff', color: '#4338ca', padding: '3px 8px', borderRadius: 5, flexShrink: 0 }}>{ad.category}</span>
                </div>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>{ad.description}</p>
              </div>

              {/* Meta */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                {ad.city && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#64748b' }}>
                    <MapPin size={11} /> {ad.city}
                  </span>
                )}
                {(ad.budget_min || ad.budget_max) && (
                  <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                    {ad.budget_min ? `${ad.budget_min.toLocaleString()}` : ''}
                    {ad.budget_min && ad.budget_max ? ' – ' : ''}
                    {ad.budget_max ? `${ad.budget_max.toLocaleString()} so'm` : ''}
                  </span>
                )}
                <div style={{ flex: 1 }} />
                {user?.id !== ad.poster_id && (
                  <Link href={`/dashboard/chat?user=${ad.poster_id}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0f172a', color: '#fff', padding: '7px 14px', borderRadius: 9, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
                    <MessageCircle size={13} /> Yozish
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* E'lon yaratish modali */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowCreate(false) }}>
          <div style={{ background: '#fff', borderRadius: '20px 20px 0 0', padding: 24, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', animation: 'slideUp 0.3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Yangi e'lon</h2>
              <button onClick={() => setShowCreate(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer' }}>
                <X size={16} color="#64748b" />
              </button>
            </div>

            <form onSubmit={handleCreateAd} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={lbl}>Sarlavha</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inp} placeholder="Qisqa va aniq sarlavha" required />
              </div>

              <div>
                <label style={lbl}>Kategoriya</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inp} required>
                  <option value="">Tanlang</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={lbl}>Tavsif</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ ...inp, minHeight: 80, resize: 'vertical' }} placeholder={user?.role === 'lawyer' ? "Xizmat tavsifi, tajriba, shartlar..." : "Muammoingizni batafsil yozing..."} rows={3} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={lbl}>Shahar</label>
                  <select value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} style={inp}>
                    <option value="">Tanlang</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Narx (so'm)</label>
                  <input value={form.budget_min} onChange={e => setForm(f => ({ ...f, budget_min: e.target.value }))} style={inp} placeholder="Masalan: 200000" type="number" />
                </div>
              </div>

              {createError && <div style={{ padding: 12, borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', fontSize: 13, color: '#991b1b' }}>{createError}</div>}

              <button type="submit" disabled={creating} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: creating ? 'not-allowed' : 'pointer', opacity: creating ? 0.7 : 1 }}>
                {creating ? 'Joylashtirilmoqda...' : "E'lonni joylashtirish"}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  )
}

const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }
const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', fontSize: 14, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, color: '#0f172a', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }
