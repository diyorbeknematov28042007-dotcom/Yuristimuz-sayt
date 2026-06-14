// ════════════════════════════════════════════════
// E'LON YOZISH QOIDALARI MODAL
// /src/components/AdTermsModal.tsx
// ════════════════════════════════════════════════

'use client'
import { useState } from 'react'
import { X, AlertTriangle, FileText, Lock, ShieldX, Heart, Scale, Eye, CheckCircle2, Loader2 } from 'lucide-react'

interface Props {
  userId: string
  onAccept: () => void
  onCancel: () => void
}

const RULES = [
  {
    icon: FileText,
    iconColor: '#dc2626',
    title: 'Spam va reklama taqiqlanadi',
    body: 'Faqat huquqiy savol va xizmatlar uchun. Kredit, MLM, investitsiya takliflari joylash mumkin emas.',
  },
  {
    icon: Lock,
    iconColor: '#d97706',
    title: 'Maxfiy ma\'lumotlarni qo\'ymang',
    body: 'Pasport, karta, hujjat raqamlarini ochiq joyda yozmang. Buni xususiy suhbatda yurist bilan muhokama qilasiz.',
  },
  {
    icon: ShieldX,
    iconColor: '#7c3aed',
    title: 'Firibgarlik va aldovga yo\'l yo\'q',
    body: 'Yolg\'on ma\'lumot, soxta hujjat, "100% kafolat" beruvchi takliflar — taqiqlanadi.',
  },
  {
    icon: Heart,
    iconColor: '#0891b2',
    title: 'Hurmat bilan muomala qiling',
    body: 'Haqorat, kamsitish, milliy/diniy nafrat, tahdid — sayt qoidalarini buzadi.',
  },
  {
    icon: Scale,
    iconColor: '#16a34a',
    title: 'Qonuniy mavzularda yozing',
    body: 'Faqat O\'zbekiston qonunchiligi doirasidagi huquqiy savollar va xizmatlar joylash mumkin.',
  },
  {
    icon: Eye,
    iconColor: '#64748b',
    title: 'Qoidalar buzilishi — oqibatlar',
    body: 'Qoidalarga zid e\'lonlar yashirilishi, akkaunt vaqtinchalik bloklanishi mumkin. Takror buzilsa — doimiy blok.',
  },
]

export default function AdTermsModal({ userId, onAccept, onCancel }: Props) {
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAccept = async () => {
    if (!agreed || loading) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/ads/accept-terms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Xato yuz berdi')
        setLoading(false)
        return
      }

      onAccept()
    } catch (err: any) {
      setError('Tarmoqda xato: ' + err.message)
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.7)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        backdropFilter: 'blur(4px)',
      }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        maxWidth: 560,
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 22px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          color: '#fff',
          position: 'relative',
        }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              position: 'absolute',
              top: 14,
              right: 14,
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: 8,
              padding: 6,
              cursor: 'pointer',
              display: 'flex',
            }}>
            <X size={16} color="#fff" />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{
              width: 32, height: 32,
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 9,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <AlertTriangle size={16} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.2px' }}>
                Yuristim platformasida ishlash qoidalari
              </h2>
            </div>
          </div>
          <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.65)', marginTop: 6, marginLeft: 42 }}>
            E'lon yozish uchun avval qoidalarni o'qib chiqing
          </p>
        </div>

        {/* Body - rules list */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '18px 22px' }}>
          {RULES.map((rule, idx) => {
            const Icon = rule.icon
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '12px 0',
                  borderBottom: idx === RULES.length - 1 ? 'none' : '1px solid #f1f5f9',
                }}>
                <div style={{
                  width: 30, height: 30,
                  background: rule.iconColor + '15',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={14} color={rule.iconColor} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#0f172a',
                    marginBottom: 3,
                    letterSpacing: '-0.1px',
                  }}>
                    {rule.title}
                  </h3>
                  <p style={{
                    fontSize: 11.5,
                    color: '#64748b',
                    lineHeight: 1.55,
                  }}>
                    {rule.body}
                  </p>
                </div>
              </div>
            )
          })}

          {/* Info box */}
          <div style={{
            marginTop: 14,
            padding: '10px 12px',
            background: '#eef2ff',
            border: '1px solid #c7d2fe',
            borderRadius: 10,
            fontSize: 11.5,
            color: '#4338ca',
            lineHeight: 1.5,
          }}>
            <strong>📌 Diqqat:</strong> Har bir e'lon avtomatik AI tomonidan tekshiriladi.
            Qoidalarga shubha tug'dirgan e'lonlar admin nazoratiga tushadi.
          </div>
        </div>

        {/* Footer - checkbox + buttons */}
        <div style={{
          borderTop: '1px solid #e2e8f0',
          padding: '14px 22px',
          background: '#fafafa',
        }}>
          {/* Checkbox */}
          <label
            style={{
              display: 'flex',
              gap: 9,
              alignItems: 'flex-start',
              cursor: 'pointer',
              marginBottom: 12,
              userSelect: 'none',
            }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={loading}
              style={{
                width: 16, height: 16,
                marginTop: 1,
                accentColor: '#0f172a',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 12, color: '#0f172a', lineHeight: 1.5, fontWeight: 500 }}>
              Men yuqoridagi qoidalarni o'qib chiqdim, ularga rozi bo'ldim va
              har bir e'londa ularga rioya qilishga va'da beraman.
            </span>
          </label>

          {/* Error */}
          {error && (
            <div style={{
              padding: '8px 11px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 8,
              marginBottom: 10,
              fontSize: 11.5,
              color: '#991b1b',
            }}>
              {error}
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onCancel}
              disabled={loading}
              style={{
                padding: '10px 16px',
                background: '#fff',
                color: '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: 9,
                fontSize: 12,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
              }}>
              Bekor qilish
            </button>
            <button
              onClick={handleAccept}
              disabled={!agreed || loading}
              style={{
                flex: 1,
                padding: '10px 16px',
                background: !agreed || loading ? '#cbd5e1' : '#0f172a',
                color: '#fff',
                border: 'none',
                borderRadius: 9,
                fontSize: 12.5,
                fontWeight: 600,
                cursor: !agreed || loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                fontFamily: 'inherit',
                transition: 'background 200ms',
              }}>
              {loading ? (
                <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <CheckCircle2 size={13} />
              )}
              Roziman va davom etaman
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
