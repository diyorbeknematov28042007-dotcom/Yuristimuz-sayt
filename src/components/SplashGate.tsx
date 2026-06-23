// ════════════════════════════════════════════════
// SPLASH GATE — splash'ni boshqaradi
// /src/components/SplashGate.tsx
// Sessiyada BIR MARTA ko'rsatadi (sahifalar orasida qayta chiqmaydi)
// ════════════════════════════════════════════════

'use client'

import { useState, useEffect } from 'react'
import SplashScreen from './SplashScreen'

export default function SplashGate() {
  // null = hali aniqlanmadi (SSR mos kelishi uchun)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Faqat brauzerda, sessiyada bir marta
    try {
      const seen = sessionStorage.getItem('yuristim_splash_seen')
      if (!seen) {
        setShow(true)
        // Sahifa skroll qilinmasin splash ko'rinib turganda
        document.body.style.overflow = 'hidden'
      }
    } catch {
      // sessionStorage ishlamasa — splash'ni o'tkazib yuboramiz
    }
  }, [])

  const handleFinish = () => {
    try { sessionStorage.setItem('yuristim_splash_seen', '1') } catch {}
    document.body.style.overflow = ''
    setShow(false)
  }

  if (!show) return null
  return <SplashScreen onFinished={handleFinish} />
}
