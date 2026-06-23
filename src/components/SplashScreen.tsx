// ════════════════════════════════════════════════
// SPLASH SCREEN — orbital (o'yin loading uslubi)
// /src/components/SplashScreen.tsx
// Markaz bo'sh · ikonkalar halqa bo'ylab aylanadi
// Logo "Y" + "uristim" typing · gradient nafas fon
// ════════════════════════════════════════════════

'use client'

import { useState, useEffect, useRef } from 'react'
import { Bot, BadgeCheck, MapPin, MessageCircle, Scale, Search } from 'lucide-react'

const REST = 'uristim'          // "Y" logo + bu typing bo'ladi
const SUBTITLE = 'Xush kelibsiz'
const TYPE_SPEED = 70           // harf orasidagi vaqt (ms)
const ORBIT_RADIUS = 75         // halqa radiusi (px)
const SPIN_DURATION = 9         // to'liq aylanish (soniya)

// Saytdagi imkoniyatlar — ikonkalar
const FEATURES = [Bot, BadgeCheck, MapPin, MessageCircle, Scale, Search]

export default function SplashScreen({ onFinished }: { onFinished?: () => void }) {
  const [typed, setTyped] = useState('')
  const [showLogo, setShowLogo] = useState(false)
  const [shownIcons, setShownIcons] = useState(0)
  const [showSub, setShowSub] = useState(false)
  const [fading, setFading] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const t = timers.current

    // 1. Ikonkalar ketma-ket paydo bo'ladi
    FEATURES.forEach((_, i) => {
      t.push(setTimeout(() => setShownIcons(n => Math.max(n, i + 1)), 300 + i * 130))
    })

    // 2. Logo "Y" paydo bo'ladi
    t.push(setTimeout(() => setShowLogo(true), 1200))

    // 3. "uristim" harfma-harf yoziladi
    let i = 0
    const typeStart = 1550
    const typeNext = () => {
      if (i < REST.length) {
        setTyped(REST.slice(0, i + 1))
        i++
        t.push(setTimeout(typeNext, TYPE_SPEED))
      } else {
        // 4. Subtitle → kutish → fade-out → tugadi
        t.push(setTimeout(() => setShowSub(true), 500))
        t.push(setTimeout(() => setFading(true), 1500))
        t.push(setTimeout(() => onFinished?.(), 2050))
      }
    }
    t.push(setTimeout(typeNext, typeStart))

    return () => { t.forEach(clearTimeout) }
  }, [onFinished])

  const typingDone = typed.length === REST.length

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(140deg, #0f172a 0%, #312e81 55%, #4338ca 100%)',
      opacity: fading ? 0 : 1,
      transition: 'opacity 600ms ease',
      pointerEvents: fading ? 'none' : 'auto',
    }}>
      {/* Nafas oladigan gradient qatlam */}
      <div style={{
        position: 'absolute', inset: '-20%',
        background: 'linear-gradient(140deg, #0f172a, #4338ca)',
        animation: 'splashBreathe 5s ease-in-out infinite',
      }} />
      {/* Markaziy nur */}
      <div style={{
        position: 'absolute', top: '32%', left: '50%',
        width: 300, height: 300, marginLeft: -150, marginTop: -150,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.4), transparent 65%)',
        animation: 'splashGlow 5s ease-in-out infinite',
      }} />

      {/* Markaziy kontent — biroz tepada */}
      <div style={{
        position: 'relative', zIndex: 5,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        transform: 'translateY(-40px)',
      }}>
        {/* Orbital zona (markaz bo'sh) */}
        <div style={{
          position: 'relative', width: 170, height: 170,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 28,
        }}>
          {/* Halqa chizig'i */}
          <div style={{
            position: 'absolute', width: 150, height: 150,
            borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.14)',
          }} />
          {/* Aylanuvchi konteyner */}
          <div style={{
            position: 'absolute', width: 150, height: 150,
            animation: `splashSpin ${SPIN_DURATION}s linear infinite`,
          }}>
            {FEATURES.map((Icon, i) => {
              const ang = (i / FEATURES.length) * Math.PI * 2 - Math.PI / 2
              const x = Math.cos(ang) * ORBIT_RADIUS
              const y = Math.sin(ang) * ORBIT_RADIUS
              return (
                <div key={i} style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: 38, height: 38, margin: '-19px 0 0 -19px',
                  borderRadius: 11,
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transform: `translate(${x}px, ${y}px)`,
                  opacity: shownIcons > i ? 1 : 0,
                  transition: 'opacity 500ms',
                }}>
                  {/* Ikonka tik turishi uchun teskari aylanadi */}
                  <div style={{
                    display: 'flex',
                    animation: `splashSpinReverse ${SPIN_DURATION}s linear infinite`,
                  }}>
                    <Icon size={18} color="#fff" strokeWidth={1.8} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Brend: logo "Y" + typing */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 13,
            background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, fontWeight: 800, color: '#0f172a',
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
            opacity: showLogo ? 1 : 0,
            transform: showLogo ? 'scale(1)' : 'scale(0.5)',
            transition: 'opacity 600ms ease, transform 600ms cubic-bezier(.34,1.56,.64,1)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}>
            Y
          </div>
          <div style={{
            display: 'flex', alignItems: 'center',
            fontSize: 34, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}>
            {typed}
            <span style={{
              display: 'inline-block', width: 3, height: 32, marginLeft: 3,
              background: '#60a5fa', borderRadius: 2,
              animation: 'splashBlink 1s step-end infinite',
              opacity: typingDone ? 0 : 1,
              transition: 'opacity 300ms',
            }} />
          </div>
        </div>

        {/* Subtitle */}
        <div style={{
          marginTop: 14, fontSize: 14, fontWeight: 500,
          color: 'rgba(255,255,255,0.85)',
          opacity: showSub ? 1 : 0,
          transform: showSub ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 500ms ease, transform 500ms ease',
        }}>
          {SUBTITLE}
        </div>
      </div>

      <style>{`
        @keyframes splashBreathe {
          0%, 100% { filter: brightness(0.95); transform: scale(1); }
          50% { filter: brightness(1.2); transform: scale(1.05); }
        }
        @keyframes splashGlow {
          0%, 100% { transform: scale(0.85); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
        @keyframes splashSpin { to { transform: rotate(360deg); } }
        @keyframes splashSpinReverse { to { transform: rotate(-360deg); } }
        @keyframes splashBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  )
}
