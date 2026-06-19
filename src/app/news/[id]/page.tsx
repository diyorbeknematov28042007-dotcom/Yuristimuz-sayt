'use client'

// ════════════════════════════════════════════════
// BITTA YANGILIK (to'liq matn)
// /src/app/news/[id]/page.tsx
// ════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Scale, ArrowLeft, Eye, Loader2, Newspaper } from 'lucide-react'

type NewsDetail = {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  cover_color: string
  views_count: number
  created_at: string
}

function fmtDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function NewsDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [news, setNews] = useState<NewsDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    fetch(`/api/news/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.news) setNews(d.news)
        else setNotFound(true)
        setLoading(false)
      })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [id])

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '0.5px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/news" style={{ background: '#f1f5f9', border: 'none', borderRadius: 9, padding: 8, display: 'flex', cursor: 'pointer', textDecoration: 'none' }}>
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

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 20px 60px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <Loader2 size={26} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : notFound || !news ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
            <Newspaper size={40} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: 14, marginBottom: 16 }}>Yangilik topilmadi yoki o'chirilgan</p>
            <Link href="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#4338ca', fontWeight: 600, textDecoration: 'none' }}>
              <ArrowLeft size={14} /> Barcha yangiliklar
            </Link>
          </div>
        ) : (
          <article>
            {/* Kategoriya + sana */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: news.cover_color, background: `${news.cover_color}14`, padding: '4px 12px', borderRadius: 7, letterSpacing: '0.3px' }}>
                {news.category}
              </span>
              <span style={{ fontSize: 12.5, color: '#94a3b8' }}>{fmtDate(news.created_at)}</span>
            </div>

            {/* Sarlavha */}
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', lineHeight: 1.3, letterSpacing: '-0.5px', marginBottom: 16 }}>
              {news.title}
            </h1>

            {/* Ko'rishlar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#94a3b8', marginBottom: 24, paddingBottom: 24, borderBottom: '0.5px solid #e2e8f0' }}>
              <Eye size={13} /> {news.views_count} marta o'qilgan
            </div>

            {/* To'liq matn (qatorlar saqlanadi) */}
            <div style={{ fontSize: 15, color: '#1e293b', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {news.content}
            </div>
          </article>
        )}
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
