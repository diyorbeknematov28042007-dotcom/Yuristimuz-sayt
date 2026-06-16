// ════════════════════════════════════════════════
// ADMIN — Foydalanuvchi amallari (blok/ogohlantirish)
// /src/app/admin/users/[id]/UserActions.tsx
// ════════════════════════════════════════════════

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Ban, AlertTriangle, Loader2, CheckCircle2, ShieldCheck, ShieldX } from 'lucide-react'

export default function UserActions({ userId, isBlocked }: { userId: string, isBlocked: boolean }) {
  const router = useRouter()
  const [mode, setMode] = useState<'none' | 'block' | 'warn'>('none')
  const [reason, setReason] = useState('')
  const [blockDays, setBlockDays] = useState<number | null>(7)  // null = doimiy
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const doAction = async (endpoint: string, body: any, successMsg: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const d = await res.json()
      if (!res.ok) {
        setError(d.error || 'Xatolik')
      } else {
        setSuccess(successMsg)
        setMode('none')
        setReason('')
        setTimeout(() => router.refresh(), 1000)
      }
    } catch {
      setError('Tarmoq xatosi')
    } finally {
      setLoading(false)
    }
  }

  const handleUnblock = () => {
    if (!confirm('Foydalanuvchini blokdan chiqarmoqchimisiz?')) return
    doAction('/api/admin/users/unblock', { userId }, 'Blokdan chiqarildi')
  }

  const handleBlock = () => {
    if (reason.trim().length < 5) { setError('Sabab kamida 5 ta belgi'); return }
    doAction('/api/admin/users/block', { userId, reason: reason.trim(), blockDays }, 'Bloklandi')
  }

  const handleWarn = () => {
    if (reason.trim().length < 5) { setError('Sabab kamida 5 ta belgi'); return }
    doAction('/api/admin/users/warn', { userId, reason: reason.trim() }, 'Ogohlantirish berildi')
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 18 }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 14 }}>
        Boshqaruv amallari
      </h2>

      {success && (
        <div style={{
          padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0',
          borderRadius: 10, marginBottom: 14, fontSize: 13, color: '#15803d',
          display: 'flex', alignItems: 'center', gap: 7,
        }}>
          <CheckCircle2 size={15} /> {success}
        </div>
      )}

      {error && (
        <div style={{
          padding: '8px 12px', background: '#fef2f2', border: '1px solid #fecaca',
          borderRadius: 8, marginBottom: 12, fontSize: 12, color: '#991b1b',
        }}>
          {error}
        </div>
      )}

      {/* Asosiy holatda — tugmalar */}
      {mode === 'none' && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {isBlocked ? (
            <button onClick={handleUnblock} disabled={loading} style={{
              flex: '1 1 auto', minWidth: 150, padding: '11px 16px',
              background: '#16a34a', color: '#fff', border: 'none', borderRadius: 10,
              fontSize: 13, fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: 'inherit',
            }}>
              {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <ShieldCheck size={14} />}
              Blokdan chiqarish
            </button>
          ) : (
            <button onClick={() => { setMode('block'); setError('') }} style={{
              flex: '1 1 auto', minWidth: 150, padding: '11px 16px',
              background: '#fff', color: '#dc2626', border: '1px solid #fecaca', borderRadius: 10,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: 'inherit',
            }}>
              <Ban size={14} /> Bloklash
            </button>
          )}
          <button onClick={() => { setMode('warn'); setError('') }} style={{
            flex: '1 1 auto', minWidth: 150, padding: '11px 16px',
            background: '#fff', color: '#d97706', border: '1px solid #fed7aa', borderRadius: 10,
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: 'inherit',
          }}>
            <AlertTriangle size={14} /> Ogohlantirish berish
          </button>
        </div>
      )}

      {/* Block form */}
      {mode === 'block' && (
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>
            Foydalanuvchini bloklash
          </h3>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
            Muddat
          </label>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
            {[
              { d: 3, l: '3 kun' }, { d: 7, l: '7 kun' }, { d: 14, l: '14 kun' },
              { d: 30, l: '30 kun' }, { d: null, l: 'Doimiy' },
            ].map((opt) => (
              <button key={opt.l} onClick={() => setBlockDays(opt.d)} style={{
                padding: '7px 13px', borderRadius: 8,
                background: blockDays === opt.d ? '#0f172a' : '#fff',
                color: blockDays === opt.d ? '#fff' : '#475569',
                border: `1px solid ${blockDays === opt.d ? '#0f172a' : '#e2e8f0'}`,
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}>{opt.l}</button>
            ))}
          </div>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Bloklash sababi (foydalanuvchi ko'radi)..."
            rows={3}
            maxLength={500}
            style={{
              width: '100%', padding: '10px 12px', fontSize: 13, border: '1px solid #e2e8f0',
              borderRadius: 10, outline: 'none', fontFamily: 'inherit', resize: 'vertical',
              boxSizing: 'border-box', marginBottom: 12,
            }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleBlock} disabled={loading || reason.trim().length < 5} style={{
              flex: 1, padding: '11px 16px',
              background: reason.trim().length < 5 ? '#cbd5e1' : '#dc2626',
              color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600,
              cursor: loading || reason.trim().length < 5 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: 'inherit',
            }}>
              {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Ban size={14} />}
              {blockDays === null ? 'Doimiy bloklash' : `${blockDays} kunga bloklash`}
            </button>
            <button onClick={() => { setMode('none'); setReason(''); setError('') }} disabled={loading} style={{
              padding: '11px 16px', background: '#fff', color: '#64748b',
              border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>Bekor</button>
          </div>
        </div>
      )}

      {/* Warn form */}
      {mode === 'warn' && (
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 10 }}>
            Ogohlantirish berish
          </h3>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ogohlantirish sababi..."
            rows={3}
            maxLength={500}
            style={{
              width: '100%', padding: '10px 12px', fontSize: 13, border: '1px solid #e2e8f0',
              borderRadius: 10, outline: 'none', fontFamily: 'inherit', resize: 'vertical',
              boxSizing: 'border-box', marginBottom: 12,
            }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleWarn} disabled={loading || reason.trim().length < 5} style={{
              flex: 1, padding: '11px 16px',
              background: reason.trim().length < 5 ? '#cbd5e1' : '#d97706',
              color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600,
              cursor: loading || reason.trim().length < 5 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, fontFamily: 'inherit',
            }}>
              {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <AlertTriangle size={14} />}
              Ogohlantirish yuborish
            </button>
            <button onClick={() => { setMode('none'); setReason(''); setError('') }} disabled={loading} style={{
              padding: '11px 16px', background: '#fff', color: '#64748b',
              border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>Bekor</button>
          </div>
        </div>
      )}
    </div>
  )
}
