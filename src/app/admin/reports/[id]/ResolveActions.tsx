// ════════════════════════════════════════════════
// ADMIN — Shikoyatga qaror qabul qilish UI
// /src/app/admin/reports/[id]/ResolveActions.tsx
// ════════════════════════════════════════════════

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle2, XCircle, EyeOff, Trash2, AlertTriangle,
  Ban, Loader2, ShieldX
} from 'lucide-react'

interface Props {
  reportId: string
  targetType: string
  targetOwnerBlocked: boolean
}

type ActionType = 'no_action' | 'object_hidden' | 'object_deleted' | 'user_warned' | 'user_blocked' | 'user_blocked_permanent'

export default function ResolveActions({ reportId, targetType, targetOwnerBlocked }: Props) {
  const router = useRouter()
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null)
  const [note, setNote] = useState('')
  const [blockDays, setBlockDays] = useState(7)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Mavjud harakatlar — obyekt turiga qarab
  const actions: { id: ActionType, label: string, desc: string, icon: any, color: string, danger?: boolean }[] = [
    { id: 'no_action', label: 'Asossiz — rad etish', desc: 'Shikoyat asossiz, hech narsa qilinmaydi', icon: XCircle, color: '#64748b' },
  ]

  // Obyekt yashirish/o'chirish (user tipida emas)
  if (targetType !== 'user') {
    actions.push(
      { id: 'object_hidden', label: 'Kontentni yashirish', desc: 'Saytdan yashiriladi, lekin o\'chmaydi', icon: EyeOff, color: '#d97706' },
      { id: 'object_deleted', label: 'Kontentni o\'chirish', desc: 'Butunlay o\'chiriladi (qaytarib bo\'lmaydi)', icon: Trash2, color: '#dc2626', danger: true },
    )
  }

  // Foydalanuvchi choralari
  actions.push(
    { id: 'user_warned', label: 'Ogohlantirish berish', desc: 'Foydalanuvchiga ogohlantirish yuboriladi', icon: AlertTriangle, color: '#d97706' },
    { id: 'user_blocked', label: 'Vaqtinchalik bloklash', desc: 'Belgilangan kunga bloklanadi', icon: Ban, color: '#dc2626', danger: true },
    { id: 'user_blocked_permanent', label: 'Doimiy bloklash', desc: 'Akkaunt butunlay bloklanadi', icon: ShieldX, color: '#dc2626', danger: true },
  )

  const handleResolve = async () => {
    if (!selectedAction || loading) return
    if (selectedAction !== 'no_action' && note.trim().length < 5) {
      setError('Izoh kamida 5 ta belgi bo\'lishi kerak')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/reports/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId,
          action: selectedAction,
          note: note.trim(),
          blockDays: selectedAction === 'user_blocked' ? blockDays : null,
        }),
      })
      const d = await res.json()

      if (!res.ok) {
        setError(d.error || 'Xatolik')
      } else {
        setSuccess('Qaror qabul qilindi!')
        setTimeout(() => router.refresh(), 1000)
      }
    } catch (err: any) {
      setError('Tarmoq xatosi')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 20 }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
        Qaror qabul qilish
      </h2>
      <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
        Shikoyatni ko'rib chiqing va tegishli chorani tanlang
      </p>

      {success && (
        <div style={{
          padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0',
          borderRadius: 10, marginBottom: 14, fontSize: 13, color: '#15803d',
          display: 'flex', alignItems: 'center', gap: 7,
        }}>
          <CheckCircle2 size={15} /> {success}
        </div>
      )}

      {/* Action options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 16 }}>
        {actions.map((action) => {
          const Icon = action.icon
          const isSelected = selectedAction === action.id
          return (
            <label key={action.id} style={{
              display: 'flex', gap: 11, padding: '12px 14px',
              background: isSelected ? (action.danger ? '#fef2f2' : '#eef2ff') : '#f8fafc',
              border: `1px solid ${isSelected ? (action.danger ? '#fecaca' : '#c7d2fe') : '#e2e8f0'}`,
              borderRadius: 10, cursor: 'pointer',
            }}>
              <input
                type="radio"
                name="action"
                checked={isSelected}
                onChange={() => { setSelectedAction(action.id); setError('') }}
                style={{ marginTop: 2, accentColor: action.danger ? '#dc2626' : '#4338ca', flexShrink: 0 }}
              />
              <Icon size={16} color={action.color} style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginBottom: 1 }}>
                  {action.label}
                </div>
                <div style={{ fontSize: 11, color: '#64748b', lineHeight: 1.4 }}>
                  {action.desc}
                </div>
              </div>
            </label>
          )
        })}
      </div>

      {/* Block days (faqat vaqtinchalik blok) */}
      {selectedAction === 'user_blocked' && (
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
            Necha kunga bloklansin?
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            {[3, 7, 14, 30].map((days) => (
              <button key={days} onClick={() => setBlockDays(days)} style={{
                flex: 1, padding: '8px', borderRadius: 8,
                background: blockDays === days ? '#0f172a' : '#fff',
                color: blockDays === days ? '#fff' : '#475569',
                border: `1px solid ${blockDays === days ? '#0f172a' : '#e2e8f0'}`,
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                {days} kun
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Note */}
      {selectedAction && selectedAction !== 'no_action' && (
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
            Izoh / sabab {selectedAction !== 'no_action' && '*'}
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Foydalanuvchi bu izohni ko'radi..."
            rows={3}
            maxLength={500}
            style={{
              width: '100%', padding: '10px 12px', fontSize: 13,
              border: '1px solid #e2e8f0', borderRadius: 10, outline: 'none',
              fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box',
            }}
          />
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

      <button
        onClick={handleResolve}
        disabled={!selectedAction || loading}
        style={{
          width: '100%', padding: '12px',
          background: !selectedAction || loading ? '#cbd5e1' : '#0f172a',
          color: '#fff', border: 'none', borderRadius: 10,
          fontSize: 13, fontWeight: 600,
          cursor: !selectedAction || loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          fontFamily: 'inherit',
        }}>
        {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={14} />}
        Qarorni tasdiqlash
      </button>
    </div>
  )
}
