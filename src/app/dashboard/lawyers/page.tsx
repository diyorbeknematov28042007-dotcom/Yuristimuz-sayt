'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import {
  Search, MapPin, Star, BadgeCheck, Clock, ChevronDown,
  Filter, X, Users, ArrowRight, Loader2, Briefcase
} from 'lucide-react'

const CATEGORIES = ['Oilaviy', 'Biznes', 'Mulk', 'Mehnat', 'Soliq', 'Jinoyat', 'Shartnoma', 'Migratsiya']
const CITIES = ['Toshkent', 'Samarqand', 'Buxoro', 'Namangan', 'Andijon', "Farg'ona", 'Nukus', 'Qarshi', 'Termiz', 'Jizzax']
const SORT_OPTIONS = [
  { value: 'rating', label: 'Reyting bo\'yicha' },
  { value: 'experience', label: 'Tajriba bo\'yicha' },
  { value: 'price_low', label: 'Arzon birinchi' },
  { value: 'price_high', label: 'Qimmat birinchi' },
  { value: 'newest', label: 'Yangilari' },
]

const PER_PAGE = 12

export default function LawyersPage() {
  const [lawyers, setLawyers] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  // Filters
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [city, setCity] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [showFilters, setShowFilters] = useState(false)

  // Debounced search
  const searchTimeoutRef = useRef<any>(null)

  useEffect(() => {
    fetchLawyers()
  }, [category, city, sortBy, page])

  useEffect(() => {
    // Search debounce
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => {
      setPage(0)
      fetchLawyers()
    }, 400)
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current) }
  }, [search])

  const fetchLawyers = async () => {
    setLoading(true)
    const offset = page * PER_PAGE

    const [{ data: items }, { data: cnt }] = await Promise.all([
      supabase.rpc('search_lawyers', {
        p_search: search || null,
        p_category: category || null,
        p_city: city || null,
        p_sort_by: sortBy,
        p_limit: PER_PAGE,
        p_offset: offset,
      }),
      supabase.rpc('count_lawyers', {
        p_search: search || null,
        p_category: category || null,
        p_city: city || null,
      })
    ])

    setLawyers(items || [])
    setTotal(cnt || 0)
    setLoading(false)
  }

  const resetFilters = () => {
    setSearch(''); setCategory(''); setCity(''); setSortBy('rating'); setPage(0)
  }

  const ini = (n: string) => n?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U'
  const hasFilters = search || category || city
  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px', marginBottom: 4 }}>
          Yuristlar
        </h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          {loading ? 'Yuklanmoqda...' : `Jami ${total} ta yurist topildi`}
        </p>
      </div>

      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '13px 16px 13px 42px',
            fontSize: 14, background: '#fff',
            border: '1px solid #e2e8f0', borderRadius: 14,
            outline: 'none', fontFamily: 'inherit',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'border-color 150ms',
          }}
          onFocus={e => (e.target as HTMLElement).style.borderColor = '#0f172a'}
          onBlur={e => (e.target as HTMLElement).style.borderColor = '#e2e8f0'}
          placeholder="Ism yoki @username bo'yicha qidirish..."
        />
        {search && (
          <button onClick={() => setSearch('')}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: '#f1f5f9', border: 'none', borderRadius: 6, padding: 5, cursor: 'pointer' }}>
            <X size={12} color="#64748b" />
          </button>
        )}
      </div>

      {/* Filter toggle (mobile) */}
      <button onClick={() => setShowFilters(!showFilters)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: '10px 14px', marginBottom: 12,
          background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 12,
          fontSize: 13, fontWeight: 600, color: '#475569', cursor: 'pointer',
          fontFamily: 'inherit',
        }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Filter size={14} /> Filtrlar
          {hasFilters && (
            <span style={{ background: '#0f172a', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10 }}>
              {[search, category, city].filter(Boolean).length}
            </span>
          )}
        </span>
        <ChevronDown size={14} style={{ transform: showFilters ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
      </button>

      {/* Filters panel */}
      {showFilters && (
        <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, padding: 16, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Category chips */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Soha</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => { setCategory(c === category ? '' : c); setPage(0) }}
                  style={{
                    padding: '6px 12px', borderRadius: 100,
                    border: category === c ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
                    background: category === c ? '#0f172a' : '#fff',
                    color: category === c ? '#fff' : '#475569',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'all 150ms',
                  }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* City + Sort */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>Shahar</p>
              <select value={city} onChange={e => { setCity(e.target.value); setPage(0) }}
                style={inputStyle}>
                <option value="">Hammasi</option>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>Tartib</p>
              <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(0) }}
                style={inputStyle}>
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {hasFilters && (
            <button onClick={resetFilters}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px', background: '#fef2f2', color: '#991b1b', border: '0.5px solid #fecaca', borderRadius: 10, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              <X size={13} /> Filtrlarni tozalash
            </button>
          )}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} style={{ height: 130, background: '#f8fafc', borderRadius: 16, animation: 'pulse 1.5s ease infinite' }} />
          ))}
        </div>
      ) : lawyers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '56px 20px', background: '#fafafa', borderRadius: 18, border: '0.5px solid #f1f5f9' }}>
          <Users size={36} color="#cbd5e1" style={{ marginBottom: 14 }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>
            Yurist topilmadi
          </p>
          <p style={{ fontSize: 12.5, color: '#94a3b8', marginBottom: 14 }}>
            {hasFilters ? "Filtrlarni o'zgartirib ko'ring" : "Hozircha hech kim ro'yxatdan o'tmagan"}
          </p>
          {hasFilters && (
            <button onClick={resetFilters}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#0f172a', color: '#fff', padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              <X size={13} /> Filtrlarni tozalash
            </button>
          )}
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {lawyers.map(l => (
              <Link key={l.id} href={`/dashboard/lawyers/${l.id}`}
                style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{
                  background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 16,
                  padding: 18, transition: 'all 200ms', cursor: 'pointer',
                }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#0f172a'; el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#e2e8f0'; el.style.boxShadow = 'none' }}>

                  {/* Top row: avatar + name + rating */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
                    <div style={{
                      width: 50, height: 50,
                      background: 'linear-gradient(135deg,#0f172a,#4338ca)', color: '#fff',
                      borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 16, flexShrink: 0,
                    }}>
                      {ini(l.full_name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{l.full_name}</span>
                        {l.is_verified && <BadgeCheck size={14} color="#3b82f6" />}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5, color: '#94a3b8' }}>
                        <span>@{l.username}</span>
                        {l.city && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <MapPin size={10} /> {l.city}
                          </span>
                        )}
                      </div>
                    </div>
                    {parseFloat(l.rating) > 0 && (
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Star size={13} color="#f59e0b" fill="#f59e0b" />
                          <span style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>
                            {parseFloat(l.rating).toFixed(1)}
                          </span>
                        </div>
                        {l.total_reviews > 0 && (
                          <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>
                            {l.total_reviews} sharh
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Specialization tags */}
                  {l.specialization?.length > 0 && (
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
                      {l.specialization.slice(0, 4).map((s: string) => (
                        <span key={s} style={{
                          fontSize: 10.5, fontWeight: 600,
                          background: '#f1f5f9', color: '#475569',
                          padding: '3px 9px', borderRadius: 5,
                        }}>
                          {s}
                        </span>
                      ))}
                      {l.specialization.length > 4 && (
                        <span style={{ fontSize: 10.5, fontWeight: 600, background: '#f8fafc', color: '#94a3b8', padding: '3px 9px', borderRadius: 5 }}>
                          +{l.specialization.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Bottom row: experience + price + response */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, color: '#64748b', paddingTop: 12, borderTop: '0.5px solid #f8fafc', flexWrap: 'wrap' }}>
                    {l.experience_years > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Briefcase size={11} /> {l.experience_years} yil tajriba
                      </span>
                    )}
                    {l.hourly_rate && (
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>
                        {Number(l.hourly_rate).toLocaleString()} so'm/soat
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} /> {l.response_time}
                    </span>
                    <ArrowRight size={14} color="#94a3b8" style={{ marginLeft: 'auto' }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                style={{
                  padding: '8px 14px',
                  background: page === 0 ? '#f8fafc' : '#fff',
                  border: '0.5px solid #e2e8f0', borderRadius: 9,
                  fontSize: 12.5, fontWeight: 600,
                  color: page === 0 ? '#cbd5e1' : '#475569',
                  cursor: page === 0 ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                }}>
                ← Oldingi
              </button>
              <span style={{ fontSize: 12.5, color: '#64748b', padding: '0 12px', fontWeight: 600 }}>
                {page + 1} / {totalPages}
              </span>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                style={{
                  padding: '8px 14px',
                  background: page >= totalPages - 1 ? '#f8fafc' : '#fff',
                  border: '0.5px solid #e2e8f0', borderRadius: 9,
                  fontSize: 12.5, fontWeight: 600,
                  color: page >= totalPages - 1 ? '#cbd5e1' : '#475569',
                  cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                }}>
                Keyingi →
              </button>
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
      `}</style>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', fontSize: 13.5,
  background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
  color: '#0f172a', cursor: 'pointer',
}
