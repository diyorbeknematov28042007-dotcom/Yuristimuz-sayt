// ════════════════════════════════════════════════
// SHIKOYAT TUGMASI + MODAL
// /src/components/ReportButton.tsx
// ════════════════════════════════════════════════

'use client'
import { useState } from 'react'
import { Flag, X, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react'

interface Props {
  targetType: 'ad' | 'review' | 'user' | 'message'
  targetId: string
  // Ko'rinish varianti
  variant?: 'icon' | 'text' | 'menu-item'
  size?: number
}

const REASONS = [
  { id: 'spam', label: 'Spam yoki reklama', desc: 'Reklama, takroriy yoki keraksiz kontent' },
  { id: 'fraud', label: 'Firibgarlik', desc: 'Aldash, soxta takliflar, yolg\'on kafolat' },
  { id: 'harassment', label: 'Haqorat yoki tahdid', desc: 'Kamsitish, dag\'al so\'zlar, tahdid' },
  { id: 'misinformation', label: 'Yolg\'on ma\'lumot', desc: 'Noto\'g\'ri yoki chalg\'ituvchi ma\'lumot' },
  { id: 'private_info', label: 'Maxfiy ma\'lumot', desc: 'Shaxsiy ma\'lumotlar oshkor qilingan' },
  { id: 'inappropriate', label: 'Nomaqbul kontent', desc: 'Axloqqa zid yoki nojo\'ya mazmun' },
  { id: 'copyright', label: 'Mualliflik huquqi', desc: 'Birovning kontenti ruxsatsiz ishlatilgan' },
  { id: 'other', label: 'Boshqa sabab', desc: 'Yuqoridagilarga to\'g\'ri kelmaydi' },
]

export default function ReportButton({ targetType, targetId, variant = 'icon', size = 16 }: Props) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = async () => {
    if (!reason || loading) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/reports/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, targetId, reason, details: details.trim() || null }),
      })
      const d = await res.json()

      if (!res.ok) {
        setError(d.error || 'Xatolik yuz berdi')
        setLoading(false)
        return
      }

      setDone(true)
      setTimeout(() => {
        setOpen(false)
        setDone(false)
        setReason('')
        setDetails('')
      }, 2500)
    } catch (err: any) {
      setError('Tarmoq xatosi')
      setLoading(false)
    }
  }

  return (
    <>
      {/* Trigger */}
      {variant === 'icon' && (
        <button
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); setOpen(true) }}
          title="Shikoyat qilish"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 6,
            color: '#94a3b8',
            display: 'flex',
            borderRadius: 6,
          }}>
          <Flag size={size} />
        </button>
      )}
      {variant === 'text' && (
        <button
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); setOpen(true) }}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            color: '#94a3b8',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 12,
            fontWeight: 500,
            fontFamily: 'inherit',
          }}>
          <Flag size={size} /> Shikoyat
        </button>
      )}
      {variant === 'menu-item' && (
        <button
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); setOpen(true) }}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '10px 14px',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            fontWeight: 500,
            fontFamily: 'inherit',
            width: '100%',
            textAlign: 'left',
          }}>
          <Flag size={size} /> Shikoyat qilish
        </button>
      )}

      {/* Modal */}
      {open && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget && !loading) setOpen(false) }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.6)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backdropFilter: 'blur(4px)',
          }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            maxWidth: 440,
            width: '100%',
            maxHeight: '88vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {done ? (
              // Success
              <div style={{ padding: 40, textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56,
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <CheckCircle2 size={28} color="#16a34a" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                  Shikoyatingiz qabul qilindi
                </h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>
                  Admin tez orada ko'rib chiqadi. E'tiboringiz uchun rahmat.
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{
                  padding: '18px 20px',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32,
                      background: '#fef2f2',
                      borderRadius: 9,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Flag size={16} color="#dc2626" />
                    </div>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                      Shikoyat qilish
                    </h2>
                  </div>
                  <button onClick={() => setOpen(false)} disabled={loading} style={{
                    background: '#f1f5f9', border: 'none', borderRadius: 8,
                    padding: 6, cursor: 'pointer', display: 'flex',
                  }}>
                    <X size={16} />
                  </button>
                </div>

                {/* Body */}
                <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
                  <p style={{ fontSize: 12.5, color: '#64748b', marginBottom: 14, lineHeight: 1.5 }}>
                    Sabab tanlang. Sizning shikoyatingiz maxfiy saqlanadi.
                  </p>

                  {/* Reasons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                    {REASONS.map((r) => (
                      <label
                        key={r.id}
                        style={{
                          display: 'flex',
                          gap: 10,
                          padding: '10px 12px',
                          background: reason === r.id ? '#eef2ff' : '#f8fafc',
                          border: `1px solid ${reason === r.id ? '#c7d2fe' : '#e2e8f0'}`,
                          borderRadius: 10,
                          cursor: 'pointer',
                        }}>
                        <input
                          type="radio"
                          name="reason"
                          checked={reason === r.id}
                          onChange={() => setReason(r.id)}
                          style={{ marginTop: 2, accentColor: '#4338ca', flexShrink: 0 }}
                        />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 1 }}>
                            {r.label}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>
                            {r.desc}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Details (optional) */}
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                      Qo'shimcha izoh (ixtiyoriy)
                    </label>
                    <textarea
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="Batafsil yozishingiz mumkin..."
                      rows={3}
                      maxLength={500}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: 13,
                        border: '1px solid #e2e8f0',
                        borderRadius: 10,
                        outline: 'none',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {error && (
                    <div style={{
                      marginTop: 12,
                      padding: '8px 12px',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: 8,
                      fontSize: 12,
                      color: '#991b1b',
                    }}>
                      {error}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div style={{
                  borderTop: '1px solid #e2e8f0',
                  padding: '14px 20px',
                  display: 'flex',
                  gap: 8,
                }}>
                  <button onClick={() => setOpen(false)} disabled={loading} style={{
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
                  <button onClick={submit} disabled={!reason || loading} style={{
                    flex: 1,
                    padding: '11px 16px',
                    background: !reason || loading ? '#cbd5e1' : '#dc2626',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: !reason || loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 7,
                    fontFamily: 'inherit',
                  }}>
                    {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Flag size={14} />}
                    Yuborish
                  </button>
                </div>
              </>
            )}
          </div>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </>
  )
}
