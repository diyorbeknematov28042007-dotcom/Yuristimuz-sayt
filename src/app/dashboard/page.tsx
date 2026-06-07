'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Search, MapPin, Star, BadgeCheck, ChevronRight, Scale, Briefcase, Clock, Users, Sparkles, ArrowRight } from 'lucide-react'

const CATEGORIES = ['Oilaviy', 'Biznes', 'Mulk', 'Mehnat', 'Soliq', 'Jinoyat', 'Shartnoma', 'Migratsiya']

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [lawyers, setLawyers] = useState<any[]>([])
  const [stats, setStats] = useState({ lawyers: 0, ads: 0 })
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [showDrop, setShowDrop] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchData()
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowDrop(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!search) { setSearchResults([]); setShowDrop(false); return }
    setSearching(true)
    const t = setTimeout(async () => {
      const q = search.startsWith('@') ? search.slice(1) : search
      const { data } = await supabase.rpc('get_lawyers', { p_limit: 5, p_search: q })
      setSearchResults(data || [])
      setShowDrop(true)
      setSearching(false)
    }, 400)
    return () => clearTimeout(t)
  }, [search])

  const fetchData = async () => {
    const res = await fetch('/api/auth/me')
    const { user: u } = await res.json()
    if (u) setUser(u)
    const { data: ld } = await supabase.rpc('get_lawyers', { p_limit: 6 })
    if (ld) setLawyers(ld)
    const { count: lc } = await supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'lawyer')
    const { count: ac } = await supabase.from('ads').select('*', { count: 'exact', head: true }).eq('status', 'open')
    setStats({ lawyers: lc || 0, ads: ac || 0 })
    setLoading(false)
  }

  const initials = (n: string) => n?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U'

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>

      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: 2 }}>
          Salom, {user?.full_name?.split(' ')[0] || '...'} 👋
        </h1>
        <p style={{ fontSize: 13, color: '#64748b' }}>
          {user?.role === 'lawyer' ? 'Bugun yangi mijozlar topish vaqti' : 'Huquqiy muammongizni yechaylik'}
        </p>
      </div>

      {/* Search */}
      <div ref={searchRef} style={{ position: 'relative', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '0 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'border-color 150ms' }}>
          <Search size={15} color="#94a3b8" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowDrop(true)}
            style={{ flex: 1, padding: '13px 0', fontSize: 14, background: 'transparent', border: 'none', outline: 'none', color: '#0f172a', fontFamily: 'inherit' }}
            placeholder="@username yoki yurist ismi bilan qidiring..."
          />
          {searching && (
            <div style={{ width: 14, height: 14, border: '2px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
          )}
        </div>

        {showDrop && searchResults.length > 0 && (
          <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', zIndex: 20, overflow: 'hidden' }}>
            {searchResults.map((l, i) => (
              <Link key={l.id} href={`/dashboard/lawyers/${l.id}`}
                onClick={() => { setSearch(''); setShowDrop(false) }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', textDecoration: 'none', borderBottom: i < searchResults.length - 1 ? '0.5px solid #f8fafc' : 'none', transition: 'background 150ms' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f8fafc'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#0f172a,#4338ca)', color: '#fff', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                  {initials(l.full_name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: '#0f172a' }}>{l.full_name}</span>
                    {l.is_verified && <BadgeCheck size={13} color="#3b82f6" />}
                  </div>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>@{l.username}{l.city ? ` · ${l.city}` : ''}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Star size={11} color="#f59e0b" fill="#f59e0b" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{parseFloat(l.rating || 0).toFixed(1)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        <div style={{ background: '#0f172a', borderRadius: 18, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: 'rgba(99,102,241,0.15)', borderRadius: '50%' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 30, height: 30, background: 'rgba(255,255,255,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={15} color="#a5b4fc" />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Yuristlar</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>
            {stats.lawyers}<span style={{ color: '#6366f1' }}>+</span>
          </div>
        </div>

        <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 18, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: 'rgba(99,102,241,0.05)', borderRadius: '50%' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ width: 30, height: 30, background: '#f8fafc', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '0.5px solid #e2e8f0' }}>
              <Briefcase size={15} color="#64748b" />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Faol e'lonlar</span>
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', letterSpacing: '-1px', lineHeight: 1 }}>
            {stats.ads}<span style={{ color: '#6366f1' }}>+</span>
          </div>
        </div>
      </div>

      {/* AI Banner */}
      <Link href="/dashboard/chat" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'linear-gradient(135deg, #1e1b4b, #312e81)', borderRadius: 16, textDecoration: 'none', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, background: 'rgba(99,102,241,0.2)', borderRadius: '50%' }} />
        <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.1)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={20} color="#a5b4fc" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 2 }}>AI Huquqiy Konsultant</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Savolingizga darhol javob oling — bepul</p>
        </div>
        <ArrowRight size={16} color="rgba(255,255,255,0.4)" style={{ flexShrink: 0 }} />
      </Link>

      {/* Map placeholder */}
      <div style={{ background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 18, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ height: 90, background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{ position: 'absolute', width: 6, height: 6, background: '#cbd5e1', borderRadius: '50%', top: `${20 + Math.random() * 60}%`, left: `${5 + i * 8}%`, opacity: 0.5 }} />
          ))}
          <div style={{ zIndex: 1, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.9)', padding: '7px 14px', borderRadius: 10, backdropFilter: 'blur(8px)', border: '0.5px solid #e2e8f0' }}>
            <MapPin size={14} color="#4338ca" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>Xarita — Faza 2 da</span>
          </div>
        </div>
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>Yaqin atrofdagi advokat</p>
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>Yandex Maps integratsiyasi tez kunda</p>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, background: '#eef2ff', color: '#4338ca', padding: '4px 9px', borderRadius: 6 }}>Tez kunda</span>
        </div>
      </div>

      {/* Lawyers */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.2px' }}>Tavsiya etilgan yuristlar</h2>
          <Link href="/dashboard/lawyers" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: '#4338ca', fontWeight: 600, textDecoration: 'none' }}>
            Hammasi <ChevronRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 76, background: '#f8fafc', borderRadius: 14, animation: 'pulse 1.5s ease infinite' }} />
            ))}
          </div>
        ) : lawyers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fafafa', borderRadius: 16, border: '0.5px solid #f1f5f9' }}>
            <Users size={28} color="#e2e8f0" style={{ marginBottom: 10 }} />
            <p style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>Hali yuristlar yo'q</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lawyers.map(l => (
              <Link key={l.id} href={`/dashboard/lawyers/${l.id}`}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 14, textDecoration: 'none', transition: 'all 200ms' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#0f172a'; el.style.transform = 'translateX(2px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#e2e8f0'; el.style.transform = 'translateX(0)' }}>
                <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#0f172a,#4338ca)', color: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                  {initials(l.full_name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{l.full_name}</span>
                    {l.is_verified && <BadgeCheck size={13} color="#3b82f6" />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>@{l.username}</span>
                    {l.city && <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#94a3b8' }}><MapPin size={9} />{l.city}</span>}
                  </div>
                  {l.specialization?.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
                      {l.specialization.slice(0, 2).map((s: string) => (
                        <span key={s} style={{ fontSize: 10, fontWeight: 600, background: '#f1f5f9', color: '#475569', padding: '2px 7px', borderRadius: 4 }}>{s}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Star size={11} color="#f59e0b" fill="#f59e0b" />
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>{parseFloat(l.rating || 0).toFixed(1)}</span>
                  </div>
                  <span style={{ fontSize: 10, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Clock size={9} />{l.response_time || '24 soat'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  )
}
