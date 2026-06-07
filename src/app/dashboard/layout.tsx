'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { Search, MapPin, Star, BadgeCheck, ChevronRight, Scale, Briefcase, Clock, Users } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CATEGORIES = ['Hammasi', 'Oilaviy', 'Biznes', 'Mulk', 'Mehnat', 'Soliq', 'Jinoyat', 'Shartnoma', 'Migratsiya']

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [lawyers, setLawyers] = useState<any[]>([])
  const [stats, setStats] = useState({ lawyers: 0, ads: 0 })
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (!search) { setSearchResults([]); return }
    const t = setTimeout(() => handleSearch(), 400)
    return () => clearTimeout(t)
  }, [search])

  const fetchData = async () => {
    const res = await fetch('/api/auth/me')
    const data = await res.json()
    if (data.user) setUser(data.user)

    const { data: lawyerData } = await supabase.rpc('get_lawyers', { p_limit: 6 })
    if (lawyerData) setLawyers(lawyerData)

    const { count: lawyerCount } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'lawyer')
    const { count: adCount } = await supabase.from('ads').select('*', { count: 'exact', head: true }).eq('status', 'open')
    setStats({ lawyers: lawyerCount || 0, ads: adCount || 0 })
    setLoading(false)
  }

  const handleSearch = async () => {
    if (!search || search.length < 2) return
    setSearching(true)
    const query = search.startsWith('@') ? search.slice(1) : search
    const { data } = await supabase.rpc('get_lawyers', { p_limit: 5, p_search: query })
    setSearchResults(data || [])
    setSearching(false)
  }

  const initials = (name: string) => name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>

      {/* Salom va qidiruv */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px', marginBottom: 4 }}>
          Salom, {user?.full_name?.split(' ')[0] || 'Foydalanuvchi'} 👋
        </h1>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
          {user?.role === 'lawyer' ? 'Mijozlaringizga yordam bering' : 'Kerakli yuristni toping'}
        </p>

        {/* Qidiruv */}
        <div style={{ position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 14px 12px 40px', fontSize: 14, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, color: '#0f172a', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            placeholder="@username yoki ism bilan qidiring..."
          />
          {searching && (
            <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, border: '2px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          )}
        </div>

        {/* Qidiruv natijalari */}
        {searchResults.length > 0 && (
          <div style={{ marginTop: 8, background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
            {searchResults.map(l => (
              <Link key={l.id} href={`/dashboard/lawyers/${l.id}`}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', textDecoration: 'none', borderBottom: '0.5px solid #f1f5f9' }}
                onClick={() => { setSearch(''); setSearchResults([]) }}>
                <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#0f172a,#4338ca)', color: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                  {initials(l.full_name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{l.full_name}</span>
                    {l.is_verified && <BadgeCheck size={13} color="#3b82f6" />}
                  </div>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>@{l.username}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Star size={11} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{l.rating?.toFixed(1) || '0.0'}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Statistika */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <div style={{ background: '#0f172a', borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 34, height: 34, background: 'rgba(255,255,255,0.1)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={17} color="#a5b4fc" />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Yuristlar</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>{stats.lawyers}<span style={{ color: '#6366f1' }}>+</span></p>
        </div>
        <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 16, padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 34, height: 34, background: '#fafafa', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={17} color="#64748b" />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Faol e'lonlar</span>
          </div>
          <p style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>{stats.ads}<span style={{ color: '#6366f1' }}>+</span></p>
        </div>
      </div>

      {/* Xarita placeholder */}
      <div style={{ background: '#f8fafc', border: '0.5px solid #e2e8f0', borderRadius: 16, padding: '20px', marginBottom: 24, textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, background: '#eef2ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
          <MapPin size={22} color="#4338ca" />
        </div>
        <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4, fontSize: 15 }}>O'zingizga yaqin advokatni toping</p>
        <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 16 }}>Faza 2 da qo'shiladi — Yandex Maps integratsiyasi</p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eef2ff', color: '#4338ca', fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 8 }}>
          Xarita — Tez kunda
        </div>
      </div>

      {/* Tavsiya etilgan yuristlar */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Tavsiya etilgan yuristlar</h2>
          <Link href="/dashboard/lawyers" style={{ fontSize: 13, color: '#4338ca', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            Hammasi <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
            <div style={{ width: 24, height: 24, border: '3px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : lawyers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fafafa', borderRadius: 16, border: '0.5px solid #e2e8f0' }}>
            <Users size={32} color="#cbd5e1" style={{ marginBottom: 12 }} />
            <p style={{ fontSize: 14, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>Hali yuristlar ro'yxatdan o'tmagan</p>
            <p style={{ fontSize: 12, color: '#94a3b8' }}>Platforma to'ldirilmoqda...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {lawyers.map(l => (
              <Link key={l.id} href={`/dashboard/lawyers/${l.id}`}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, textDecoration: 'none', transition: 'all 200ms' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#0f172a'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'}>
                <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#0f172a,#4338ca)', color: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                  {initials(l.full_name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{l.full_name}</span>
                    {l.is_verified && <BadgeCheck size={14} color="#3b82f6" />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>@{l.username}</span>
                    {l.city && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#94a3b8' }}>
                        <MapPin size={10} /> {l.city}
                      </span>
                    )}
                  </div>
                  {l.specialization?.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 5, flexWrap: 'wrap' }}>
                      {l.specialization.slice(0, 2).map((s: string) => (
                        <span key={s} style={{ fontSize: 10, fontWeight: 600, background: '#f1f5f9', color: '#475569', padding: '2px 7px', borderRadius: 4 }}>{s}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Star size={12} color="#f59e0b" fill="#f59e0b" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{l.rating?.toFixed(1) || '0.0'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#94a3b8' }}>
                    <Clock size={10} /> {l.response_time || '24 soat'}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
