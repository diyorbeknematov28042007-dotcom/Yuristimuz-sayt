// ════════════════════════════════════════════════
// ADMIN — Yuristni tasdiqlash/rad etish UI
// /src/app/admin/lawyers/[id]/VerifyActions.tsx
// ════════════════════════════════════════════════

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2, AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  lawyerId: string
  isVerified: boolean
  isRejected: boolean
  hasDiploma: boolean
  profileComplete: boolean
}

export default function VerifyActions({
  lawyerId,
  isVerified,
  isRejected,
  hasDiploma,
  profileComplete
}: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const canVerify = hasDiploma && profileComplete

  const handleVerify = async () => {
    if (loading) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/lawyers/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lawyerId }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Xato yuz berdi')
      } else {
        setSuccess('Yurist tasdiqlandi!')
        setTimeout(() => router.refresh(), 1000)
      }
    } catch (err: any) {
      setError('Tarmoqda xato: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (loading) return
    if (rejectReason.trim().length < 10) {
      setError('Sabab kamida 10 ta belgidan iborat bo\'lishi kerak')
      return
    }
    
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/lawyers/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lawyerId, reason: rejectReason.trim() }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Xato yuz berdi')
      } else {
        setSuccess('Yurist rad etildi va xabar yuborildi')
        setShowRejectForm(false)
        setRejectReason('')
        setTimeout(() => router.refresh(), 1000)
      }
    } catch (err: any) {
      setError('Tarmoqda xato: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    if (loading) return
    if (!confirm('Yurist holatini noaniq qaytarishni xohlaysizmi? Bu tasdiqlash/rad etishni bekor qiladi.')) return
    
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/lawyers/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lawyerId }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Xato yuz berdi')
      } else {
        setSuccess('Holat qayta o\'rnatildi')
        setTimeout(() => router.refresh(), 1000)
      }
    } catch (err: any) {
      setError('Tarmoqda xato: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // Profil to'liq emas
  if (!canVerify && !isVerified && !isRejected) {
    return (
      <div style={{
        background: '#fff7ed',
        border: '1px solid #fed7aa',
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
      }}>
        <AlertCircle size={16} color="#ea580c" style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#9a3412', marginBottom: 4 }}>
            Profil to'liq emas
          </div>
          <div style={{ fontSize: 11.5, color: '#9a3412', lineHeight: 1.5 }}>
            Tasdiqlash uchun yurist quyidagilarni to'ldirishi kerak:
            <ul style={{ marginTop: 6, paddingLeft: 18 }}>
              {!hasDiploma && <li>Diplom rasmi yuklash</li>}
              {!profileComplete && <li>Litsenziya raqami va mutaxassislik</li>}
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 14,
      padding: 18,
      marginBottom: 14,
    }}>
      {!showRejectForm ? (
        <>
          <div style={{ marginBottom: 12 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
              Tasdiqlash
            </h2>
            <p style={{ fontSize: 12, color: '#64748b' }}>
              {isVerified 
                ? 'Yurist tasdiqlangan. Holatni o\'zgartirish mumkin.'
                : isRejected
                ? 'Yurist rad etilgan. Qayta tasdiqlash yoki holatni qaytarish mumkin.'
                : 'Diplom va ma\'lumotlarni ko\'rib chiqing, so\'ng tasdiqlang yoki rad eting.'}
            </p>
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
            {/* Tasdiqlash */}
            {!isVerified && (
              <button
                onClick={handleVerify}
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

            {/* Rad etish */}
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

            {/* Reset */}
            {(isVerified || isRejected) && (
              <button
                onClick={handleReset}
                disabled={loading}
                style={{
                  padding: '11px 16px',
                  background: '#fff',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: 'inherit',
                }}>
                <RefreshCw size={13} />
                Holatni qaytarish
              </button>
            )}
          </div>
        </>
      ) : (
        // Reject form
        <>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
            Rad etish sababi
          </h2>
          <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
            Yurist sizning sababingizni o'qiydi va profilini to'g'rilashi mumkin.
          </p>

          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Masalan: Diplom rasmi noaniq, qaytadan yuklang yoki Litsenziya muddati tugagan..."
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
              color: '#0f172a',
              marginBottom: 6,
            }}
          />
          <div style={{
            fontSize: 11,
            color: rejectReason.length < 10 ? '#dc2626' : '#94a3b8',
            marginBottom: 12,
            textAlign: 'right',
          }}>
            {rejectReason.length}/500 belgi {rejectReason.length < 10 && '(kamida 10 ta)'}
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
