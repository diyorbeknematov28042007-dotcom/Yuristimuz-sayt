// ════════════════════════════════════════════════
// Sahifa o'tish progress bar (yuqorida ingichka chiziq)
// /src/components/RouteProgress.tsx
// YouTube/GitHub uslubi — sahifa o'tganda tepada chiziq yuradi
// Tashqi paket kerak emas (sof React)
// ════════════════════════════════════════════════

'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function RouteProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // Sahifa (URL) o'zgarganda progress bar to'liq bo'lib yo'qoladi
  useEffect(() => {
    // Avvalgi taymerlarni tozalaymiz
    timers.current.forEach(clearTimeout)
    timers.current = []

    // To'ldirib, yo'qotamiz (yangi sahifa yuklandi)
    setProgress(100)
    const t1 = setTimeout(() => setVisible(false), 250)
    const t2 = setTimeout(() => setProgress(0), 500)
    timers.current.push(t1, t2)

    return () => {
      timers.current.forEach(clearTimeout)
    }
  }, [pathname, searchParams])

  // Havola bosilganda progress boshlanadi
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a')
      if (!target) return
      const href = target.getAttribute('href')
      // Faqat ichki sahifa havolalari uchun
      if (!href || !href.startsWith('/') || href.startsWith('//')) return
      // Yangi tabda ochilsa yoki maxsus tugma bilan bosilsa — o'tkazib yuboramiz
      if (target.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return
      // Joriy sahifaning o'ziga bosilsa — progress kerak emas
      const current = pathname + (searchParams.toString() ? `?${searchParams}` : '')
      if (href === current || href === pathname) return

      startProgress()
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams])

  const startProgress = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setVisible(true)
    setProgress(15)
    // Asta-sekin 90% gacha to'ladi (real yuklanish kutilmoqda)
    const steps = [
      [200, 35],
      [450, 55],
      [800, 70],
      [1400, 82],
      [2200, 90],
    ] as const
    steps.forEach(([delay, val]) => {
      const t = setTimeout(() => setProgress(val), delay)
      timers.current.push(t)
    })
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        height: 3,
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #7c3aed, #4338ca)',
        boxShadow: '0 0 8px rgba(67,56,202,0.5)',
        zIndex: 99999,
        opacity: visible ? 1 : 0,
        transition: progress === 100
          ? 'width 200ms ease, opacity 250ms ease 150ms'
          : 'width 400ms ease, opacity 150ms ease',
        pointerEvents: 'none',
      }}
    />
  )
}
