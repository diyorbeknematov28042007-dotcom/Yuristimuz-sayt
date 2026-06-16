// ════════════════════════════════════════════════
// Leaflet CDN yuklash hook'i
// /src/lib/useLeaflet.ts
// npm paketsiz — Leaflet'ni CDN orqali yuklaydi
// ════════════════════════════════════════════════

'use client'
import { useEffect, useState } from 'react'

declare global {
  interface Window { L?: any }
}

let leafletPromise: Promise<any> | null = null

function loadLeaflet(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject('SSR')
  if (window.L) return Promise.resolve(window.L)
  if (leafletPromise) return leafletPromise

  leafletPromise = new Promise((resolve, reject) => {
    // CSS
    if (!document.querySelector('link[data-leaflet]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      link.setAttribute('data-leaflet', 'true')
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
      link.crossOrigin = ''
      document.head.appendChild(link)
    }
    // JS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
    script.crossOrigin = ''
    script.onload = () => resolve(window.L)
    script.onerror = () => reject('Leaflet yuklanmadi')
    document.head.appendChild(script)
  })
  return leafletPromise
}

export function useLeaflet() {
  const [L, setL] = useState<any>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let mounted = true
    loadLeaflet()
      .then((lib) => { if (mounted) setL(lib) })
      .catch(() => { if (mounted) setError(true) })
    return () => { mounted = false }
  }, [])

  return { L, loaded: !!L, error }
}
