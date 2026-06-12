'use client'

import { useState, useEffect } from 'react'
import { Star, MessageSquare, MoreHorizontal, ChevronDown, Loader2, Reply } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import StarRating from './StarRating'

type Review = {
  id: string
  rating: number
  comment: string | null
  lawyer_reply: string | null
  lawyer_reply_at: string | null
  created_at: string
  client_id: string
  client_full_name: string
  client_username: string
  client_avatar_url: string | null
}

type Breakdown = { rating: number; count: number }

type Props = {
  lawyerId: string
  lawyerName: string
  averageRating: number
  totalReviews: number
  // Joriy foydalanuvchi yuristmi (ya'ni sharhlar bo'yicha javob bera oladimi)
  isOwnProfile?: boolean
}

const PAGE_SIZE = 5

export default function ReviewsList({
  lawyerId,
  lawyerName,
  averageRating,
  totalReviews,
  isOwnProfile = false,
}: Props) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [breakdown, setBreakdown] = useState<Breakdown[]>([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)

  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replySaving, setReplySaving] = useState(false)

  useEffect(() => {
    fetchInitial()
  }, [lawyerId])

  const fetchInitial = async () => {
    setLoading(true)
    const [{ data: list }, { data: bd }] = await Promise.all([
      supabase.rpc('get_lawyer_reviews', {
        p_lawyer_id: lawyerId,
        p_limit: PAGE_SIZE,
        p_offset: 0,
      }),
      supabase.rpc('get_rating_breakdown', { p_lawyer_id: lawyerId })
    ])
    setReviews(list || [])
    setBreakdown(bd || [])
    setHasMore((list || []).length === PAGE_SIZE)
    setPage(0)
    setLoading(false)
  }

  const loadMore = async () => {
    const nextPage = page + 1
    const { data } = await supabase.rpc('get_lawyer_reviews', {
      p_lawyer_id: lawyerId,
      p_limit: PAGE_SIZE,
      p_offset: nextPage * PAGE_SIZE,
    })
    setReviews(prev => [...prev, ...(data || [])])
    setHasMore((data || []).length === PAGE_SIZE)
    setPage(nextPage)
  }

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return
    setReplySaving(true)
    try {
      const { error } = await supabase.rpc('reply_to_review', {
        p_lawyer_id: lawyerId,
        p_review_id: reviewId,
        p_reply: replyText.trim(),
      })
      if (!error) {
        // Refresh
        await fetchInitial()
        setReplyingTo(null)
        setReplyText('')
      }
    } finally {
      setReplySaving(false)
    }
  }

  const fmtDate = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
    if (diff === 0) return 'Bugun'
    if (diff === 1) return 'Kecha'
    if (diff < 7) return `${diff} kun oldin`
    if (diff < 30) return `${Math.floor(diff / 7)} hafta oldin`
    if (diff < 365) return `${Math.floor(diff / 30)} oy oldin`
    return d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const ini = (n: string) => n?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U'

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 30 }}>
        <Loader2 size={20} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (totalReviews === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '32px 20px',
        background: '#fafafa', borderRadius: 14,
      }}>
        <MessageSquare size={28} color="#cbd5e1" style={{ marginBottom: 10 }} />
        <p style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>
          Hozircha sharhlar yo'q
        </p>
        <p style={{ fontSize: 11.5, color: '#94a3b8' }}>
          {isOwnProfile ? "Mijozlar suhbatdan keyin baho qoldiradilar"
            : "Birinchi sharh qoldirish imkoniyatini qo'ldan boy bermang"}
        </p>
      </div>
    )
  }

  const maxCount = Math.max(...breakdown.map(b => b.count), 1)
  const visibleReviews = showAll ? reviews : reviews.slice(0, 3)

  return (
    <div>
      {/* ════════════════════════════ */}
      {/* SUMMARY BOX                   */}
      {/* ════════════════════════════ */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16,
        padding: 18, background: '#fafafa', border: '0.5px solid #e2e8f0',
        borderRadius: 14, marginBottom: 18, alignItems: 'center',
      }}>
        {/* Left: average */}
        <div style={{ textAlign: 'center', borderRight: '0.5px solid #e2e8f0', paddingRight: 16 }}>
          <p style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', lineHeight: 1 }}>
            {averageRating.toFixed(1)}
          </p>
          <div style={{ margin: '8px 0' }}>
            <StarRating value={Math.round(averageRating)} readonly size={16} />
          </div>
          <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
            {totalReviews} sharh
          </p>
        </div>

        {/* Right: breakdown bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {breakdown.map(b => (
            <div key={b.rating} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', width: 14 }}>
                {b.rating}
              </span>
              <Star size={10} color="#f59e0b" fill="#f59e0b" />
              <div style={{
                flex: 1, height: 6, background: '#e2e8f0', borderRadius: 100,
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${(b.count / maxCount) * 100}%`,
                  height: '100%',
                  background: '#f59e0b',
                  borderRadius: 100,
                  transition: 'width 300ms',
                }} />
              </div>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, width: 18, textAlign: 'right' }}>
                {b.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════ */}
      {/* REVIEWS LIST                  */}
      {/* ════════════════════════════ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {visibleReviews.map(r => (
          <div key={r.id} style={{
            padding: 16, background: '#fff',
            border: '0.5px solid #e2e8f0', borderRadius: 14,
          }}>
            {/* Header: avatar + name + date + rating */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, marginBottom: 10 }}>
              {r.client_avatar_url ? (
                <img src={r.client_avatar_url} alt={r.client_full_name}
                  style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{
                  width: 36, height: 36,
                  background: 'linear-gradient(135deg, #475569, #1e293b)',
                  color: '#fff', borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 12, flexShrink: 0,
                }}>
                  {ini(r.client_full_name)}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
                    {r.client_full_name}
                  </p>
                  <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0 }}>
                    {fmtDate(r.created_at)}
                  </span>
                </div>
                <div style={{ marginTop: 4 }}>
                  <StarRating value={r.rating} readonly size={13} />
                </div>
              </div>
            </div>

            {/* Comment */}
            {r.comment && (
              <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                {r.comment}
              </p>
            )}

            {/* Lawyer reply */}
            {r.lawyer_reply && (
              <div style={{
                marginTop: 12, padding: '11px 13px',
                background: '#f8fafc', border: '0.5px solid #e2e8f0',
                borderLeft: '3px solid #4338ca',
                borderRadius: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                  <Reply size={11} color="#4338ca" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#4338ca', letterSpacing: '0.3px' }}>
                    YURIST JAVOBI
                  </span>
                  {r.lawyer_reply_at && (
                    <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 'auto' }}>
                      {fmtDate(r.lawyer_reply_at)}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                  {r.lawyer_reply}
                </p>
              </div>
            )}

            {/* Reply button (yurist o'z profilida) */}
            {isOwnProfile && !r.lawyer_reply && (
              <div style={{ marginTop: 10 }}>
                {replyingTo === r.id ? (
                  <div>
                    <textarea
                      value={replyText}
                      onChange={e => setReplyText(e.target.value.slice(0, 500))}
                      placeholder="Sharhga javob yozing..."
                      rows={3}
                      style={{
                        width: '100%', padding: '10px 13px', fontSize: 13,
                        background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
                        outline: 'none', fontFamily: 'inherit',
                        resize: 'vertical' as const,
                        boxSizing: 'border-box' as const,
                      }}
                    />
                    <div style={{ display: 'flex', gap: 6, marginTop: 7 }}>
                      <button
                        onClick={() => { setReplyingTo(null); setReplyText('') }}
                        disabled={replySaving}
                        style={{
                          padding: '7px 14px', background: '#f1f5f9', color: '#475569',
                          border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600,
                          cursor: 'pointer', fontFamily: 'inherit',
                        }}>
                        Bekor
                      </button>
                      <button
                        onClick={() => handleReply(r.id)}
                        disabled={!replyText.trim() || replySaving}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 5,
                          padding: '7px 14px',
                          background: !replyText.trim() || replySaving ? '#94a3b8' : '#4338ca',
                          color: '#fff', border: 'none', borderRadius: 8,
                          fontSize: 12, fontWeight: 600,
                          cursor: !replyText.trim() || replySaving ? 'not-allowed' : 'pointer',
                          fontFamily: 'inherit',
                        }}>
                        {replySaving ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> : <Reply size={11} />}
                        Javob berish
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setReplyingTo(r.id); setReplyText('') }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '6px 12px',
                      background: '#fff', color: '#4338ca',
                      border: '0.5px solid #ddd6fe', borderRadius: 8,
                      fontSize: 11.5, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                    <Reply size={11} /> Javob berish
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Show more / Load more */}
      {reviews.length > 3 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            width: '100%', marginTop: 12, padding: 11,
            background: '#f8fafc', border: '0.5px solid #e2e8f0', borderRadius: 11,
            fontSize: 12.5, fontWeight: 600, color: '#475569',
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
          Yana {reviews.length - 3} ta sharh ko'rish
          <ChevronDown size={13} />
        </button>
      )}

      {showAll && hasMore && (
        <button
          onClick={loadMore}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            width: '100%', marginTop: 12, padding: 11,
            background: '#f8fafc', border: '0.5px solid #e2e8f0', borderRadius: 11,
            fontSize: 12.5, fontWeight: 600, color: '#475569',
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
          Ko'proq yuklash
        </button>
      )}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
