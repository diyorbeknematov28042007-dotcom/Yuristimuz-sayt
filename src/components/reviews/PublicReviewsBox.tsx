'use client'

import { useState, useEffect } from 'react'
import { Star, Loader2, Info, Reply, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Props = {
  lawyerId: string
  averageRating: number
  totalReviews: number
}

type Review = {
  id: string
  rating: number
  comment: string | null
  lawyer_reply: string | null
  lawyer_reply_at: string | null
  created_at: string
  client_full_name: string
  client_avatar_url: string | null
}

export default function PublicReviewsBox({
  lawyerId,
  averageRating,
  totalReviews,
}: Props) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [breakdown, setBreakdown] = useState<{ rating: number; count: number }[]>([])
  const [ratingDetails, setRatingDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showInfo, setShowInfo] = useState(false)

  useEffect(() => {
    (async () => {
      const [{ data: list }, { data: bd }, { data: details }] = await Promise.all([
        supabase.rpc('get_lawyer_reviews', { p_lawyer_id: lawyerId, p_limit: 5, p_offset: 0 }),
        supabase.rpc('get_rating_breakdown', { p_lawyer_id: lawyerId }),
        supabase.rpc('get_rating_details', { p_lawyer_id: lawyerId }),
      ])
      setReviews(list || [])
      setBreakdown(bd || [])
      setRatingDetails(details?.[0] || null)
      setLoading(false)
    })()
  }, [lawyerId])

  const ini = (n: string) => n?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U'
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short', year: 'numeric' })
  const maxCount = Math.max(...breakdown.map(b => b.count), 1)

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
      <Loader2 size={18} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  }

  return (
    <div>
      {/* SUMMARY */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16,
        padding: 16, background: '#fafafa', border: '0.5px solid #e2e8f0',
        borderRadius: 12, marginBottom: 16, alignItems: 'center',
      }}>
        <div style={{ textAlign: 'center', borderRight: '0.5px solid #e2e8f0', paddingRight: 14 }}>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.8px', lineHeight: 1 }}>
            {averageRating.toFixed(1)}
          </p>
          <div style={{ display: 'flex', gap: 2, justifyContent: 'center', margin: '6px 0' }}>
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} size={13}
                color={s <= Math.round(averageRating) ? '#f59e0b' : '#cbd5e1'}
                fill={s <= Math.round(averageRating) ? '#f59e0b' : 'transparent'} />
            ))}
          </div>
          <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{totalReviews} sharh</p>

          {/* Info tooltip */}
          {ratingDetails && (
            <button onClick={() => setShowInfo(!showInfo)}
              style={{
                marginTop: 8, background: 'none', border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 3,
                fontSize: 10, color: '#64748b', fontWeight: 600,
                fontFamily: 'inherit',
              }}>
              <Info size={10} /> Reyting qanday hisoblanadi?
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {breakdown.map(b => (
            <div key={b.rating} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', width: 12 }}>{b.rating}</span>
              <Star size={9} color="#f59e0b" fill="#f59e0b" />
              <div style={{ flex: 1, height: 5, background: '#e2e8f0', borderRadius: 100, overflow: 'hidden' }}>
                <div style={{
                  width: `${(b.count / maxCount) * 100}%`, height: '100%',
                  background: '#f59e0b', borderRadius: 100, transition: 'width 300ms',
                }} />
              </div>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, width: 16, textAlign: 'right' }}>{b.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BAYESIAN INFO BOX */}
      {showInfo && ratingDetails && (
        <div style={{
          padding: '12px 14px',
          background: '#eff6ff', border: '1px solid #bfdbfe',
          borderRadius: 11, marginBottom: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
            <TrendingUp size={13} color="#1d4ed8" />
            <p style={{ fontSize: 12, fontWeight: 700, color: '#1e3a8a' }}>
              Adolatli reyting tizimi
            </p>
          </div>
          <p style={{ fontSize: 11.5, color: '#1e40af', lineHeight: 1.6, marginBottom: 8 }}>
            Yangi yurist bir nechta sharhdan keyin haqiqiy reytingga yaqinlashadi. Bu adolat va aniqlikni ta'minlash uchun ishlatiladi.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11 }}>
            <div style={{ padding: '7px 9px', background: '#fff', borderRadius: 7, border: '0.5px solid #bfdbfe' }}>
              <p style={{ color: '#64748b', marginBottom: 2 }}>Sof o'rtacha</p>
              <p style={{ fontWeight: 700, color: '#1e3a8a' }}>{parseFloat(ratingDetails.raw_average).toFixed(2)}</p>
            </div>
            <div style={{ padding: '7px 9px', background: '#fff', borderRadius: 7, border: '0.5px solid #bfdbfe' }}>
              <p style={{ color: '#64748b', marginBottom: 2 }}>Platforma o'rtachasi</p>
              <p style={{ fontWeight: 700, color: '#1e3a8a' }}>{parseFloat(ratingDetails.global_average).toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* TOP 5 REVIEWS */}
      {reviews.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reviews.map(r => (
            <div key={r.id} style={{
              padding: 13, background: '#fff',
              border: '0.5px solid #e2e8f0', borderRadius: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                {r.client_avatar_url ? (
                  <img src={r.client_avatar_url} alt={r.client_full_name}
                    style={{ width: 32, height: 32, borderRadius: 9, objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                  <div style={{
                    width: 32, height: 32,
                    background: 'linear-gradient(135deg, #475569, #1e293b)',
                    color: '#fff', borderRadius: 9,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 11, flexShrink: 0,
                  }}>
                    {ini(r.client_full_name)}
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                    <p style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a' }}>{r.client_full_name}</p>
                    <span style={{ fontSize: 10.5, color: '#94a3b8', flexShrink: 0 }}>{fmtDate(r.created_at)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 2, marginTop: 3 }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={11}
                        color={s <= r.rating ? '#f59e0b' : '#cbd5e1'}
                        fill={s <= r.rating ? '#f59e0b' : 'transparent'} />
                    ))}
                  </div>
                </div>
              </div>
              {r.comment && (
                <p style={{ fontSize: 12.5, color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{r.comment}</p>
              )}
              {r.lawyer_reply && (
                <div style={{
                  marginTop: 9, padding: '9px 11px',
                  background: '#f8fafc', borderLeft: '3px solid #4338ca', borderRadius: 9,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                    <Reply size={10} color="#4338ca" />
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#4338ca', letterSpacing: '0.3px' }}>
                      YURIST JAVOBI
                    </p>
                  </div>
                  <p style={{ fontSize: 12, color: '#475569', lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
                    {r.lawyer_reply}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalReviews > 5 && (
        <p style={{ textAlign: 'center', fontSize: 11.5, color: '#94a3b8', marginTop: 12 }}>
          Yana {totalReviews - 5} ta sharhni ko'rish uchun ro'yxatdan o'ting
        </p>
      )}
    </div>
  )
}
