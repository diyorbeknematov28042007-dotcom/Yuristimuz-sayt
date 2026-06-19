// ════════════════════════════════════════════════
// SURVEY MODAL — ro'yxatdan keyin bir martalik (ixtiyoriy)
// /src/components/SurveyModal.tsx
// Mijoz: 2 savol (motivatsiya + kasb)
// Yurist: 1 savol (qayerdan eshitgan)
// ════════════════════════════════════════════════

'use client'

import { useState, useEffect } from 'react'
import { Scale, X, ArrowRight, ArrowLeft, Check, Loader2 } from 'lucide-react'

// ── Savol variantlari ──
const MOTIVATIONS = [
  'Aniq huquqiy muammoni hal qilish',
  'Ishonchli yurist qidirish',
  'Maslahat olish',
  "Shunchaki ko'rib chiqyapman",
]

const PROFESSIONS = [
  'Talaba', "O'qituvchi", 'Shifokor', 'Dasturlash / IT',
  'SMM / Marketing', 'Quruvchi', 'Tadbirkor', 'Haydovchi / Taksist',
  'Uy bekasi', 'Davlat xizmatchisi', 'Boshqa',
]

const REFERRALS = [
  { label: 'Instagram', val: 'Instagram' },
  { label: 'Telegram', val: 'Telegram' },
  { label: "Do'st / tanish", val: "Do'st" },
  { label: 'Google qidiruv', val: 'Google' },
  { label: 'Boshqa', val: 'Boshqa' },
]

export default function SurveyModal() {
  const [show, setShow] = useState(false)
  const [role, setRole] = useState<'client' | 'lawyer'>('client')
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  // Javoblar
  const [motivation, setMotivation] = useState('')
  const [profession, setProfession] = useState('')
  const [referral, setReferral] = useState('')

  // Holatni tekshirish — modal chiqishi kerakmi?
  useEffect(() => {
    fetch('/api/user/survey')
      .then(r => r.json())
      .then(d => {
        if (d.should_show) {
          setRole(d.role === 'lawyer' ? 'lawyer' : 'client')
          // Kichik kechikish — dashboard yuklangach chiqsin
          setTimeout(() => setShow(true), 800)
        }
      })
      .catch(() => {})
  }, [])

  const close = () => setShow(false)

  const handleSkip = async () => {
    setShow(false)
    fetch('/api/user/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'skip' }),
    }).catch(() => {})
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch('/api/user/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          motivation: motivation || null,
          profession: profession || null,
          referral: referral || null,
        }),
      })
    } catch {}
    setSaving(false)
    setShow(false)
  }

  if (!show) return null

  // Mijoz uchun 2 qadam, yurist uchun 1 qadam
  const totalSteps = role === 'client' ? 2 : 1
  const canProceed = role === 'client'
    ? (step === 1 ? !!motivation : !!profession)
    : !!referral

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backdropFilter: 'blur(6px)' }}>
      <div style={{
        background: '#fff', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 480,
        padding: '24px 22px 30px', boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
        animation: 'surveyUp 0.35s cubic-bezier(0.16,1,0.3,1)', maxHeight: '85vh', overflowY: 'auto',
      }}>
        {/* Sarlavha */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, background: '#0f172a', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Scale size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>Bir lahza vaqtingiz bormi?</p>
              <p style={{ fontSize: 11.5, color: '#94a3b8' }}>Sizni yaxshiroq tushunishimizga yordam bering</p>
            </div>
          </div>
          <button onClick={handleSkip} style={{ background: '#f1f5f9', border: 'none', borderRadius: 8, padding: 7, cursor: 'pointer', display: 'flex', flexShrink: 0 }}>
            <X size={15} color="#64748b" />
          </button>
        </div>

        {/* Qadam indikatori (faqat mijoz, 2 qadam) */}
        {role === 'client' && (
          <div style={{ display: 'flex', gap: 5, margin: '16px 0 20px' }}>
            {[1, 2].map(s => (
              <div key={s} style={{ flex: 1, height: 3, borderRadius: 3, background: s <= step ? '#0f172a' : '#e2e8f0', transition: 'background 250ms' }} />
            ))}
          </div>
        )}
        {role === 'lawyer' && <div style={{ height: 16 }} />}

        {/* ══ MIJOZ — 1-qadam: motivatsiya ══ */}
        {role === 'client' && step === 1 && (
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 16, lineHeight: 1.4 }}>
              Sizni nima Yuristimga olib keldi?
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {MOTIVATIONS.map(m => (
                <button key={m} onClick={() => setMotivation(m)}
                  style={optStyle(motivation === m)}>
                  <span>{m}</span>
                  {motivation === m && <Check size={16} color="#0f172a" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ MIJOZ — 2-qadam: kasb ══ */}
        {role === 'client' && step === 2 && (
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 16, lineHeight: 1.4 }}>
              Ayni damda qanday faoliyat bilan shug'ullanasiz?
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {PROFESSIONS.map(p => (
                <button key={p} onClick={() => setProfession(p)}
                  style={chipStyle(profession === p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══ YURIST — qayerdan eshitgan ══ */}
        {role === 'lawyer' && (
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0f172a', marginBottom: 16, lineHeight: 1.4 }}>
              Bizni qayerdan eshitdingiz?
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {REFERRALS.map(r => (
                <button key={r.val} onClick={() => setReferral(r.val)}
                  style={optStyle(referral === r.val)}>
                  <span>{r.label}</span>
                  {referral === r.val && <Check size={16} color="#0f172a" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tugmalar */}
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          {role === 'client' && step === 2 && (
            <button onClick={() => setStep(1)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '13px 18px', background: '#fff', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              <ArrowLeft size={15} /> Orqaga
            </button>
          )}

          {/* Mijoz 1-qadam: Keyingi | Mijoz 2-qadam yoki Yurist: Yuborish */}
          {role === 'client' && step === 1 ? (
            <button onClick={() => setStep(2)} disabled={!canProceed}
              style={primaryBtn(canProceed)}>
              Keyingi <ArrowRight size={15} />
            </button>
          ) : (
            <button onClick={handleSave} disabled={!canProceed || saving}
              style={primaryBtn(canProceed && !saving)}>
              {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={15} />}
              Yuborish
            </button>
          )}
        </div>

        {/* Skip havola */}
        <button onClick={handleSkip}
          style={{ display: 'block', margin: '14px auto 0', background: 'none', border: 'none', color: '#94a3b8', fontSize: 12.5, cursor: 'pointer', fontFamily: 'inherit' }}>
          Hozir emas, keyinroq
        </button>
      </div>

      <style>{`
        @keyframes surveyUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 520px) {
          /* Desktopda markazga */
        }
      `}</style>
    </div>
  )
}

// ── Stillar ──
function optStyle(active: boolean): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    width: '100%', padding: '14px 16px', textAlign: 'left',
    background: active ? '#f8fafc' : '#fff',
    border: active ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
    borderRadius: 12, fontSize: 14, fontWeight: 500, color: '#0f172a',
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms',
  }
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    padding: '10px 16px',
    background: active ? '#0f172a' : '#fff',
    color: active ? '#fff' : '#475569',
    border: active ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
    borderRadius: 10, fontSize: 13, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 150ms',
  }
}

function primaryBtn(enabled: boolean): React.CSSProperties {
  return {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
    padding: '13px 18px', background: enabled ? '#0f172a' : '#cbd5e1', color: '#fff',
    border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700,
    cursor: enabled ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'background 150ms',
  }
}
