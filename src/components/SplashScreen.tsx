// ════════════════════════════════════════════════
// SPLASH SCREEN — typing animatsiya
// /src/components/SplashScreen.tsx
// "Yuristim" yoziladi → "Xush kelibsiz" → fade-out
// Oq fon, #0F172A matn, #3B82F6 kursor, ~70ms
// ════════════════════════════════════════════════

'use client'

import { useState, useEffect, useRef } from 'react'

const WORD = 'Yuristim'
const SUBTITLE = 'Xush kelibsiz'
const TYPE_SPEED = 70        // har harf orasidagi vaqt (ms)
const HOLD_AFTER_TYPE = 600  // yozib bo'lgach kutish
const SUB_DELAY = 250        // subtitle paydo bo'lishidan oldin
const HOLD_BEFORE_EXIT = 900 // chiqishdan oldin kutish
const FADE_DURATION = 500    // fade-out davomiyligi

export default function SplashScreen({ onFinished }: { onFinished?: () => void }) {
  const [typed, setTyped] = useState('')
  const [showSub, setShowSub] = useState(false)
  const [fading, setFading] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    let i = 0
    // Harfma-harf yozish
    const typeNext = () => {
      if (i < WORD.length) {
        setTyped(WORD.slice(0, i + 1))
        i++
        timers.current.push(setTimeout(typeNext, TYPE_SPEED))
      } else {
        // Yozib bo'ldi → subtitle → kutish → fade
        timers.current.push(setTimeout(() => setShowSub(true), HOLD_AFTER_TYPE))
        timers.current.push(setTimeout(() => setFading(true), HOLD_AFTER_TYPE + SUB_DELAY + HOLD_BEFORE_EXIT))
        timers.current.push(setTimeout(() => onFinished?.(), HOLD_AFTER_TYPE + SUB_DELAY + HOLD_BEFORE_EXIT + FADE_DURATION))
      }
    }
    timers.current.push(setTimeout(typeNext, 350)) // boshlanishdan oldin qisqa pauza

    return () => { timers.current.forEach(clearTimeout) }
  }, [onFinished])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      opacity: fading ? 0 : 1,
      transition: `opacity ${FADE_DURATION}ms ease`,
      pointerEvents: fading ? 'none' : 'auto',
    }}>
      {/* Asosiy so'z — typing */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        fontSize: 'clamp(32px, 9vw, 52px)',
        fontWeight: 800,
        color: '#0F172A',
        letterSpacing: '-1px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {typed}
        {/* Kursor — yozib bo'lgach yo'qoladi */}
        <span style={{
          display: 'inline-block',
          width: 3,
          height: '1.05em',
          marginLeft: 4,
          background: '#3B82F6',
          borderRadius: 2,
          animation: 'splashBlink 1s step-end infinite',
          opacity: typed.length === WORD.length ? 0 : 1,
          transition: 'opacity 300ms',
        }} />
      </div>

      {/* Subtitle — fade-in */}
      <div style={{
        fontSize: 'clamp(13px, 4vw, 16px)',
        fontWeight: 500,
        color: '#64748b',
        opacity: showSub ? 1 : 0,
        transform: showSub ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 450ms ease, transform 450ms ease',
        letterSpacing: '0.2px',
      }}>
        {SUBTITLE}
      </div>

      <style>{`
        @keyframes splashBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
