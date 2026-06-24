// ════════════════════════════════════════════════
// Landing xarita preview — haqiqiy xaritaga MOS
// /src/components/landing/LandingMap.tsx
// O'rtada "siz" nuqtasi + atrofda namuna yuristlar
// Har qanday funksiya bosilsa → ro'yxatdan o'tish modali
// ════════════════════════════════════════════════

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Navigation, Star, BadgeCheck, X, Crosshair } from 'lucide-react'

// Namuna yuristlar (faqat ko'rgazma uchun)
const SAMPLE_LAWYERS = [
  { id: 1, name: 'Diyorbek N.', initial: 'D', spec: 'Fuqarolik huquqi', city: 'Toshkent', rating: 4.9, top: '24%', left: '30%' },
  { id: 2, name: 'Aziz K.', initial: 'A', spec: 'Jinoyat huquqi', city: 'Toshkent', rating: 4.8, top: '52%', left: '64%' },
  { id: 3, name: 'Malika R.', initial: 'M', spec: 'Oilaviy nizolar', city: 'Toshkent', rating: 5.0, top: '38%', left: '52%' },
  { id: 4, name: 'Sardor T.', initial: 'S', spec: 'Biznes huquqi', city: 'Toshkent', rating: 4.7, top: '66%', left: '34%' },
]

export default function LandingMap() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<typeof SAMPLE_LAWYERS[0] | null>(null)

  const openModal = (lawyer?: typeof SAMPLE_LAWYERS[0]) => {
    if (lawyer) setSelected(lawyer)
    setModalOpen(true)
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Xarita maydoni */}
      <div style={{
        position: 'relative', height: 420, borderRadius: 18, overflow: 'hidden',
        border: '1px solid #e2e8f0',
        background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 60%, #ede9fe 100%)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        {/* Xarita to'ri (grid) — xarita hissi uchun */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }} />
        {/* Nozik "yo'llar" */}
        <div style={{ position: 'absolute', top: '45%', left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.5)' }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '48%', width: 3, background: 'rgba(255,255,255,0.5)' }} />

        {/* O'RTADA — "SIZ" nuqtasi */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 5 }}>
          {/* Pulslanuvchi halqa */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 60, height: 60, borderRadius: '50%', background: 'rgba(37,99,235,0.2)',
            animation: 'landingPulse 2s ease-in-out infinite',
          }} />
          <div style={{
            position: 'relative', width: 22, height: 22, borderRadius: '50%',
            background: '#2563eb', border: '3px solid #fff',
            boxShadow: '0 2px 8px rgba(37,99,235,0.4)',
          }} />
          <div style={{
            position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)',
            background: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 700,
            padding: '3px 9px', borderRadius: 6, whiteSpace: 'nowrap',
          }}>
            Siz
          </div>
        </div>

        {/* Atrofdagi yurist pinlari */}
        {SAMPLE_LAWYERS.map(l => (
          <button
            key={l.id}
            onClick={() => openModal(l)}
            style={{
              position: 'absolute', top: l.top, left: l.left,
              width: 38, height: 38, background: '#0f172a',
              borderRadius: '50% 50% 50% 0',
              transform: 'translate(-50%, -100%) rotate(-45deg)',
              border: 'none', cursor: 'pointer', zIndex: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            }}>
            <span style={{ transform: 'rotate(45deg)', color: '#fff', fontSize: 14, fontWeight: 700 }}>
              {l.initial}
            </span>
          </button>
        ))}

        {/* Recenter tugma (bezak) */}
        <div style={{
          position: 'absolute', bottom: 16, right: 16,
          width: 40, height: 40, background: '#fff', borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer',
        }} onClick={() => openModal()}>
          <Crosshair size={18} color="#0f172a" />
        </div>

        {/* Yuristlar soni badge */}
        <div style={{
          position: 'absolute', top: 16, left: 16,
          padding: '8px 14px', background: '#fff', borderRadius: 999,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)', fontSize: 12.5, fontWeight: 700, color: '#0f172a',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <MapPin size={13} color="#0f172a" />
          Yoningizda {SAMPLE_LAWYERS.length} ta yurist
        </div>
      </div>

      {/* Pastdagi yurist kartochkalari (gorizontal) */}
      <div style={{ display: 'flex', gap: 12, marginTop: 16, overflowX: 'auto', paddingBottom: 4 }}>
        {SAMPLE_LAWYERS.map(l => (
          <button
            key={l.id}
            onClick={() => openModal(l)}
            style={{
              flex: '0 0 auto', width: 200, textAlign: 'left',
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14,
              padding: 14, cursor: 'pointer', fontFamily: 'inherit',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#0f172a,#4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                {l.initial}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a' }}>{l.name}</span>
                  <BadgeCheck size={13} color="#16a34a" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
                  <Star size={11} fill="#fbbf24" color="#fbbf24" />
                  <span style={{ fontSize: 11.5, color: '#64748b', fontWeight: 600 }}>{l.rating}</span>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 11.5, color: '#64748b', marginBottom: 10 }}>{l.spec} · {l.city}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ flex: 1, padding: '7px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 11.5, fontWeight: 600, color: '#0f172a', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <Navigation size={11} /> Yo'nalish
              </span>
              <span style={{ flex: 1, padding: '7px', borderRadius: 8, background: '#0f172a', color: '#fff', fontSize: 11.5, fontWeight: 600, textAlign: 'center' }}>
                Bog'lanish
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Ro'yxatdan o'tish modali */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)',
            backdropFilter: 'blur(4px)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            animation: 'landingFadeIn 0.25s ease',
          }}>
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 22, padding: '28px 24px',
              maxWidth: 380, width: '100%', textAlign: 'center', position: 'relative',
            }}>
            <button
              onClick={() => setModalOpen(false)}
              style={{ position: 'absolute', top: 16, right: 16, width: 30, height: 30, background: '#f1f5f9', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} color="#64748b" />
            </button>

            {selected && (
              <div style={{ width: 60, height: 60, borderRadius: 17, background: 'linear-gradient(135deg,#0f172a,#4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 28, fontWeight: 800, margin: '0 auto 14px' }}>
                {selected.initial}
              </div>
            )}
            <h3 style={{ fontSize: 19, fontWeight: 800, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.3px' }}>
              {selected ? `${selected.name} bilan bog'lanish` : "Davom etish uchun ro'yxatdan o'ting"}
            </h3>
            <p style={{ fontSize: 13.5, color: '#64748b', lineHeight: 1.5, marginBottom: 22 }}>
              Yuristlar bilan bog'lanish, yo'nalish olish va boshqa imkoniyatlar uchun hisobingizga kiring. Bu atigi 1 daqiqa.
            </p>
            <Link href="/register" style={{ textDecoration: 'none', display: 'block', marginBottom: 9 }}>
              <div style={{ width: '100%', padding: 14, background: '#0f172a', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700 }}>
                Ro'yxatdan o'tish
              </div>
            </Link>
            <Link href="/login" style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{ width: '100%', padding: 14, background: '#f1f5f9', color: '#475569', borderRadius: 12, fontSize: 14, fontWeight: 700 }}>
                Hisobim bor — kirish
              </div>
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @keyframes landingPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.2; }
        }
        @keyframes landingFadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  )
}
