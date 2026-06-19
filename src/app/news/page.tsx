'use client'

// ════════════════════════════════════════════════
// OMMAVIY YANGILIKLAR RO'YXATI
// /src/app/news/page.tsx
// ════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Scale, ArrowLeft, Newspaper, Eye, Loader2 } from 'lucide-react'

type NewsItem = {
  id: string
  title: string
  excerpt: string
  category: string
  cover_color: string
  views_count: number
  created_at: string
}

function fmtDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/news')
      .then(r => r.json())
      .then(d => { setNews(d.news || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '0.5px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/dashboard" style={{ background: '#f1f5f9', border: 'none', borderRadius: 9, padding: 8, display: 'flex', cursor: 'pointer', textDecoration: 'none' }}>
            <ArrowLeft size={16} color="#475569" />
          </Link>
          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, background: '#0f172a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Scale size={15} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>Yuristim</span>
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 20px 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <Newspaper size={22} color="#4338ca" />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Yangiliklar</h1>
        </div>
        <p style={{ fontSize: 13.5, color: '#64748b', marginBottom: 28 }}>Platforma va huquq sohasidagi so'nggi yangiliklar</p>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <Loader2 size={26} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : news.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
            <Newspaper size={40} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: 14 }}>Hozircha yangiliklar yo'q</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {news.map(n => (
              <Link key={n.id} href={`/news/${n.id}`} style={{ textDecoration: 'none' }}>
                <article style={{
                  background: '#fff', border: '0.5px solid #e2e8f0', borderRadius: 16, overflow: 'hidden',
                  transition: 'all 200ms', cursor: 'pointer', display: 'flex', flexDirection: 'column',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#0f172a'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
                  {/* Rangli yuqori chiziq */}
                  <div style={{ height: 6, background: n.cover_color }} />
                  <div style={{ padding: '18px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: n.cover_color, background: `${n.cover_color}14`, padding: '3px 10px', borderRadius: 6, letterSpacing: '0.3px' }}>
                        {n.category}
                      </span>
                      <span style={{ fontSize: 11.5, color: '#94a3b8' }}>{fmtDate(n.created_at)}</span>
                    </div>
                    <h2 style={{ fontSize: 16.5, fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: 7 }}>{n.title}</h2>
                    {n.excerpt && (
                      <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.6, marginBottom: 12 }}>{n.excerpt}</p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: '#94a3b8' }}>
                      <Eye size={12} /> {n.views_count} marta o'qilgan
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
