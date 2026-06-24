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

// Namuna yuristlar (faqat ko'rgazma uchun) — markazdan uzoqda joylashgan
const SAMPLE_LAWYERS = [
  { id: 1, name: 'Diyorbek N.', initial: 'D', spec: 'Fuqarolik huquqi', city: 'Toshkent', rating: 4.9, top: '16%', left: '15%' },
  { id: 2, name: 'Aziz K.', initial: 'A', spec: 'Jinoyat huquqi', city: 'Toshkent', rating: 4.8, top: '24%', left: '82%' },
  { id: 3, name: 'Malika R.', initial: 'M', spec: 'Oilaviy nizolar', city: 'Toshkent', rating: 5.0, top: '78%', left: '76%' },
  { id: 4, name: 'Sardor T.', initial: 'S', spec: 'Biznes huquqi', city: 'Toshkent', rating: 4.7, top: '82%', left: '20%' },
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
        background: '#e8eef0',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        {/* Haqiqiy xarita ko'rinishi — SVG (egri ko'chalar, uylar, parklar, suv) */}
        <svg viewBox="0 0 900 420" preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {/* Asosiy fon — yer rangi */}
          <rect width="900" height="420" fill="#eaeef0" />

          {/* Yam-yashil hududlar (parklar) — tabiiy shakl */}
          <path d="M 50 30 Q 130 20 200 50 Q 220 110 160 140 Q 80 150 45 100 Z" fill="#d2e7d0" />
          <ellipse cx="780" cy="70" rx="70" ry="55" fill="#d2e7d0" />
          <path d="M 700 280 Q 800 270 860 310 Q 870 370 800 390 Q 710 380 690 330 Z" fill="#d2e7d0" />

          {/* Suv (daryo — egri oqim) */}
          <path d="M -20 330 Q 150 295 320 335 Q 500 375 680 330 Q 820 295 920 320 L 920 440 L -20 440 Z" fill="#bcdce9" opacity="0.9" />
          <path d="M -20 330 Q 150 295 320 335 Q 500 375 680 330 Q 820 295 920 320" fill="none" stroke="#a5cee0" strokeWidth="2.5" />

          {/* EGRI asosiy ko'chalar (yo'l ostki qatlam — kengroq, och) */}
          <g stroke="#dfe5e7" strokeWidth="17" fill="none" strokeLinecap="round">
            <path d="M -20 150 Q 250 130 450 160 Q 680 195 920 165" />
            <path d="M 430 -20 Q 410 150 450 280 Q 470 380 440 440" />
          </g>
          {/* EGRI asosiy ko'chalar (oq ust qatlam) */}
          <g stroke="#ffffff" strokeWidth="13" fill="none" strokeLinecap="round">
            <path d="M -20 150 Q 250 130 450 160 Q 680 195 920 165" />
            <path d="M 430 -20 Q 410 150 450 280 Q 470 380 440 440" />
            <path d="M -20 240 Q 200 250 400 235 Q 650 215 920 245" />
            <path d="M 650 -20 Q 670 150 640 300 Q 625 380 660 440" />
          </g>
          {/* Ikkilamchi ko'chalar (ingichka) */}
          <g stroke="#ffffff" strokeWidth="6.5" fill="none" strokeLinecap="round">
            <path d="M -20 70 Q 200 60 400 75 Q 600 88 920 68" />
            <path d="M 200 -20 Q 220 120 195 260 Q 185 360 210 440" />
            <path d="M -20 300 Q 150 305 330 298" />
            <path d="M 760 60 Q 780 180 750 290" />
            <path d="M 100 150 Q 110 250 90 350" />
          </g>

          {/* Kichik uylar (bloklar bo'ylab tarqalgan kichik to'rtburchaklar) */}
          <g fill="#dbe2e5">
            {/* Yuqori-chap mahalla */}
            <rect x="240" y="90" width="26" height="22" rx="3" />
            <rect x="272" y="92" width="22" height="20" rx="3" />
            <rect x="300" y="88" width="28" height="24" rx="3" />
            <rect x="245" y="118" width="24" height="20" rx="3" />
            <rect x="275" y="120" width="26" height="18" rx="3" />
            {/* Markaz-yuqori */}
            <rect x="480" y="95" width="30" height="24" rx="3" />
            <rect x="516" y="98" width="24" height="21" rx="3" />
            <rect x="485" y="125" width="26" height="20" rx="3" />
            {/* O'ng mahalla */}
            <rect x="560" y="100" width="28" height="22" rx="3" />
            <rect x="592" y="102" width="22" height="20" rx="3" />
            <rect x="565" y="128" width="25" height="19" rx="3" />
            {/* Pastki-chap */}
            <rect x="150" y="195" width="28" height="22" rx="3" />
            <rect x="182" y="198" width="24" height="20" rx="3" />
            <rect x="155" y="222" width="26" height="19" rx="3" />
            {/* Pastki-markaz */}
            <rect x="490" y="270" width="28" height="22" rx="3" />
            <rect x="522" y="272" width="24" height="20" rx="3" />
            {/* O'ng-past */}
            <rect x="560" y="255" width="26" height="21" rx="3" />
            <rect x="590" y="258" width="23" height="19" rx="3" />
          </g>
          {/* Yirik binolar (bir nechta kattaroq blok) */}
          <g fill="#d4dce0">
            <rect x="340" y="180" width="55" height="42" rx="4" />
            <rect x="700" y="150" width="48" height="40" rx="4" />
            <rect x="120" y="270" width="50" height="40" rx="4" />
          </g>
        </svg>


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
            <Link href="/auth/signup" style={{ textDecoration: 'none', display: 'block', marginBottom: 9 }}>
              <div style={{ width: '100%', padding: 14, background: '#0f172a', color: '#fff', borderRadius: 12, fontSize: 14, fontWeight: 700 }}>
                Ro'yxatdan o'tish
              </div>
            </Link>
            <Link href="/auth/login" style={{ textDecoration: 'none', display: 'block' }}>
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
