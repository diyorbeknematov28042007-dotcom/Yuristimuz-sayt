'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Plus, Scale, User, MapPin, Star, BadgeCheck, MessageCircle, Briefcase, Calendar } from 'lucide-react'
import ReportButton from '@/components/ReportButton'
import AdFormModal from '@/components/AdFormModal'
import AdTermsModal from '@/components/AdTermsModal'
import { AD_CATEGORIES, formatPrice, formatAdDate } from '@/lib/ads-constants'

export default function AdsPage() {
  const [user, setUser] = useState<any>(null)
  const [tab, setTab] = useState<'lawyer'|'client'>('lawyer')
  const [ads, setAds] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [catFilter, setCatFilter] = useState('')
  const [showTerms, setShowTerms] = useState(false)
  const [statusInfo, setStatusInfo] = useState<{ riskLevel: string, message: string } | null>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => setUser(d.user))
    fetchAds('lawyer', '')
  }, [])

  const fetchAds = async (role: string, cat: string) => {
    setLoading(true)
    const { data } = await supabase.rpc('get_ads', { p_role_filter: role, p_category: cat || null, p_limit: 30, p_offset: 0 })
    setAds(data || [])
    setLoading(false)
  }

  const switchTab = (t: 'lawyer'|'client') => { setTab(t); setCatFilter(''); fetchAds(t, '') }
  const toggleCat = (c: string) => { const nc = c === catFilter ? '' : c; setCatFilter(nc); fetchAds(tab, nc) }

  // E'lon muvaffaqiyatli yaratildi
  const handleAdSuccess = (d: any) => {
    setShowCreate(false)
    if (d.riskLevel && d.message) {
      setStatusInfo({ riskLevel: d.riskLevel, message: d.message })
      setTimeout(() => setStatusInfo(null), 12000)
    }
    fetchAds(tab, catFilter)
  }

  const ini = (n: string) => n?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || 'U'

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px' }}>E'lonlar</h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link href="/dashboard/my-ads"
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', color: '#475569', border: '0.5px solid #e2e8f0', padding: '9px 14px', borderRadius: 10, fontSize: 12.5, fontWeight: 600, textDecoration: 'none', transition: 'all 150ms' }}>
            <Briefcase size={13} /> Mening e'lonlarim
          </Link>
          <button onClick={() => setShowCreate(true)}
            style={{ display:'flex', alignItems:'center', gap:7, background:'#0f172a', color:'#fff', border:'none', padding:'10px 18px', borderRadius:11, fontSize:13.5, fontWeight:700, cursor:'pointer', boxShadow:'0 2px 8px rgba(15,23,42,0.2)' }}>
            <Plus size={15} /> Yangi
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, background:'#f1f5f9', borderRadius:13, padding:4, marginBottom:16 }}>
        {([['lawyer', <Scale size={14}/>, "Yurist e'lonlari"], ['client', <User size={14}/>, "Mijoz e'lonlari"]] as const).map(([val, icon, label]) => (
          <button key={val} onClick={() => switchTab(val)}
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:7, padding:'10px', borderRadius:10, border:'none', cursor:'pointer', fontSize:13, fontWeight:600, transition:'all 150ms',
              background: tab === val ? '#fff' : 'transparent',
              color: tab === val ? '#0f172a' : '#64748b',
              boxShadow: tab === val ? '0 1px 6px rgba(0,0,0,0.07)' : 'none' }}>
            {icon}{label}
          </button>
        ))}
      </div>

      {/* Category filter chips */}
      <div style={{ display:'flex', gap:7, overflowX:'auto', paddingBottom:4, marginBottom:20, scrollbarWidth:'none' }}>
        {AD_CATEGORIES.map(c => (
          <button key={c} onClick={() => toggleCat(c)}
            style={{ flexShrink:0, padding:'6px 14px', borderRadius:100, border:`1px solid ${catFilter===c?'#0f172a':'#e2e8f0'}`, cursor:'pointer', fontSize:12, fontWeight:600, transition:'all 150ms',
              background: catFilter===c ? '#0f172a' : '#fff', color: catFilter===c ? '#fff' : '#475569' }}>
            {c}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {[1,2,3].map(i => <div key={i} style={{ height:130, background:'#f8fafc', borderRadius:16, animation:'pulse 1.5s ease infinite' }} />)}
        </div>
      ) : ads.length === 0 ? (
        <div style={{ textAlign:'center', padding:'56px 20px', background:'#fafafa', borderRadius:18, border:'0.5px solid #f1f5f9' }}>
          <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
          <p style={{ fontSize:14, fontWeight:600, color:'#64748b', marginBottom:4 }}>E'lonlar yo'q</p>
          <p style={{ fontSize:12, color:'#94a3b8' }}>Birinchi e'lonni siz joylang!</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {ads.map(ad => (
            <div key={ad.id} style={{ background:'#fff', border:'0.5px solid #e2e8f0', borderRadius:18, padding:18, transition:'all 200ms' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='#0f172a'; el.style.boxShadow='0 4px 16px rgba(0,0,0,0.06)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor='#e2e8f0'; el.style.boxShadow='none' }}>

              {/* Poster info */}
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, paddingBottom:12, borderBottom:'0.5px solid #f8fafc' }}>
                <div style={{ width:36, height:36, background: ad.poster_role==='lawyer' ? 'linear-gradient(135deg,#0f172a,#4338ca)' : '#f1f5f9', color: ad.poster_role==='lawyer' ? '#fff' : '#64748b', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:12, flexShrink:0 }}>
                  {ini(ad.poster_name)}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <span style={{ fontSize:13.5, fontWeight:700, color:'#0f172a' }}>{ad.poster_name}</span>
                    {ad.poster_verified && <BadgeCheck size={13} color="#3b82f6" />}
                  </div>
                  <span style={{ fontSize:11, color:'#94a3b8' }}>@{ad.poster_username}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  {ad.poster_role==='lawyer' && parseFloat(ad.poster_rating)>0 && (
                    <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                      <Star size={11} color="#f59e0b" fill="#f59e0b" />
                      <span style={{ fontSize:12, fontWeight:700, color:'#0f172a' }}>{parseFloat(ad.poster_rating).toFixed(1)}</span>
                    </div>
                  )}
                  <span style={{ fontSize:10, fontWeight:700, background:'#eef2ff', color:'#4338ca', padding:'3px 9px', borderRadius:5 }}>{ad.category}</span>
                </div>
              </div>

              {/* Ad content */}
              <h3 style={{ fontSize:15, fontWeight:700, color:'#0f172a', marginBottom:6, lineHeight:1.3 }}>{ad.title}</h3>
              <p style={{ fontSize:13, color:'#475569', lineHeight:1.65, marginBottom:12 }}>{ad.description}</p>

              {/* Footer */}
              <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                {ad.city && <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'#94a3b8' }}><MapPin size={11}/>{ad.city}</span>}

                {/* Narx — yashil ramka ichida (audit A1) */}
                {(ad.budget_min || ad.budget_max) && (
                  <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'#15803d', fontWeight:700, background:'#f0fdf4', border:'1px solid #bbf7d0', padding:'4px 10px', borderRadius:8 }}>
                    {ad.budget_min ? `${formatPrice(ad.budget_min)}` : ''}
                    {ad.budget_min && ad.budget_max ? ' – ' : ''}
                    {ad.budget_max ? `${formatPrice(ad.budget_max)}` : ''} so'm
                    {ad.is_negotiable ? ' dan' : ''}
                  </span>
                )}

                {/* Sana (audit A4) */}
                {ad.created_at && (
                  <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11.5, color:'#94a3b8' }}>
                    <Calendar size={11}/>{formatAdDate(ad.created_at)}
                  </span>
                )}

                <div style={{ flex:1 }} />
                {user?.id !== ad.poster_id && (
                  <>
                    {/* Shikoyat — qizil tugma (audit A2) */}
                    <ReportButton targetType="ad" targetId={ad.id} variant="danger-button" size={13} />
                    {/* Suhbatni boshlash (audit A3) */}
                    <Link href={`/dashboard/chat?user=${ad.poster_id}`}
                      style={{ display:'flex', alignItems:'center', gap:6, background:'#0f172a', color:'#fff', padding:'8px 16px', borderRadius:10, fontSize:12.5, fontWeight:600, textDecoration:'none' }}>
                      <MessageCircle size={13}/> Suhbatni boshlash
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* E'lon yaratish modali (umumiy komponent) */}
      {showCreate && (
        <AdFormModal
          userRole={user?.role}
          onClose={() => setShowCreate(false)}
          onSuccess={handleAdSuccess}
          onNeedsTerms={() => { setShowCreate(false); setShowTerms(true) }}
        />
      )}

      {/* Etika qoidalari modali */}
      {showTerms && (
        <AdTermsModal
          onCancel={() => setShowTerms(false)}
          onAccept={() => { setShowTerms(false); setShowCreate(true) }}
        />
      )}

      {/* Status banner (AI moderatsiya natijasi) */}
      {statusInfo && (
        <div style={{ position:'fixed', bottom:20, left:'50%', transform:'translateX(-50%)', zIndex:200, maxWidth:480, width:'calc(100% - 32px)', padding:'14px 18px', borderRadius:14, fontSize:13, lineHeight:1.5, boxShadow:'0 10px 40px rgba(0,0,0,0.2)',
          background: statusInfo.riskLevel === 'high' ? '#fef2f2' : statusInfo.riskLevel === 'medium' ? '#fffbeb' : '#f0fdf4',
          border: `1px solid ${statusInfo.riskLevel === 'high' ? '#fecaca' : statusInfo.riskLevel === 'medium' ? '#fde68a' : '#bbf7d0'}`,
          color: statusInfo.riskLevel === 'high' ? '#991b1b' : statusInfo.riskLevel === 'medium' ? '#92400e' : '#15803d' }}>
          {statusInfo.message}
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
      `}</style>
    </div>
  )
}
