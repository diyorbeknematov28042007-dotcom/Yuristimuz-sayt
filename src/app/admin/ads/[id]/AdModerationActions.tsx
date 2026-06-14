// ════════════════════════════════════════════════
// ADMIN — Tasdiq/Rad UI
// /src/app/admin/ads/[id]/AdModerationActions.tsx
// ════════════════════════════════════════════════

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export default function AdModerationActions({
  adId,
  currentStatus,
}: {
  adId: string
  currentStatus: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isApproved = currentStatus === 'open'
  const isRejected = currentStatus === 'rejected' || currentStatus === 'auto_rejected'

  const handleApprove = async () => {
    if (loading) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/ads/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Xato')
      } else {
        setSuccess('E\'lon tasdiqlandi!')
        setTimeout(() => router.refresh(), 800)
      }
    } catch (err: any) {
      setError('Tarmoqda xato')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (loading) return
    if (rejectReason.trim().length < 10) {
      setError('Sabab kamida 10 ta belgi bo\'lishi kerak')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/ads/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adId, reason: rejectReason.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Xato')
      } else {
        setSuccess('E\'lon rad etildi')
        setShowRejectForm(false)
        setTimeout(() => router.refresh(), 800)
      }
    } catch (err: any) {
      setError('Tarmoqda xato')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 14,
      padding: 18,
    }}>
      {!showRejectForm ? (
        <>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
            Moderatsiya
          </h2>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
            {isApproved ? 'E\'lon tasdiqlangan. Holatni o\'zgartirish mumkin.' :
             isRejected ? 'E\'lon rad etilgan. Qayta tasdiqlash mumkin.' :
             'E\'lonni tekshirib ko\'ring va qaror qabul qiling.'}
          </p>

          {error && (
            <div style={{
              padding: '8px 12px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 8,
              marginBottom: 10,
              fontSize: 12,
              color: '#991b1b',
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              padding: '8px 12px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 8,
              marginBottom: 10,
              fontSize: 12,
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <CheckCircle2 size={13} />
              {success}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {!isApproved && (
              <button
                onClick={handleApprove}
                disabled={loading}
                style={{
                  flex: '1 1 auto',
                  minWidth: 140,
                  padding: '11px 16px',
                  background: '#16a34a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: loading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  fontFamily: 'inherit',
                }}>
                {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={14} />}
                Tasdiqlash
              </button>
            )}

            {!isRejected && (
              <button
                onClick={() => setShowRejectForm(true)}
                disabled={loading}
                style={{
                  flex: '1 1 auto',
                  minWidth: 140,
                  padding: '11px 16px',
                  background: '#fff',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 7,
                  fontFamily: 'inherit',
                }}>
                <XCircle size={14} />
                Rad etish
              </button>
            )}
          </div>
        </>
      ) : (
        <>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
            Rad etish sababi
          </h2>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
            Muallif sababingizni o'qiydi va profilini tuzatishi mumkin.
          </p>

          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Masalan: Spam, reklama yoki Maxfiy ma'lumotlar yozilgan..."
            rows={4}
            maxLength={500}
            style={{
              width: '100%',
              padding: '11px 13px',
              fontSize: 13,
              border: '1px solid #e2e8f0',
              borderRadius: 10,
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              marginBottom: 6,
            }}
          />
          <div style={{
            fontSize: 11,
            color: rejectReason.length < 10 ? '#dc2626' : '#94a3b8',
            marginBottom: 12,
            textAlign: 'right',
          }}>
            {rejectReason.length}/500 {rejectReason.length < 10 && '(kamida 10 ta)'}
          </div>

          {error && (
            <div style={{
              padding: '8px 12px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 8,
              marginBottom: 10,
              fontSize: 12,
              color: '#991b1b',
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleReject}
              disabled={loading || rejectReason.trim().length < 10}
              style={{
                flex: 1,
                padding: '11px 16px',
                background: rejectReason.trim().length < 10 ? '#cbd5e1' : '#dc2626',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                cursor: (loading || rejectReason.trim().length < 10) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                fontFamily: 'inherit',
              }}>
              {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <XCircle size={14} />}
              Rad etishni tasdiqlash
            </button>
            <button
              onClick={() => { setShowRejectForm(false); setRejectReason(''); setError('') }}
              disabled={loading}
              style={{
                padding: '11px 16px',
                background: '#fff',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
              Bekor
            </button>
          </div>
        </>
      )}
    </div>
  )
}
