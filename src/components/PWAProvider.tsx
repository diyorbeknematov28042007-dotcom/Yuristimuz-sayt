'use client'

import { useEffect, useState } from 'react'
import { Download, X, Smartphone } from 'lucide-react'

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAProvider() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [installed, setInstalled] = useState(false)

  // ─────────────────────────────────────────
  // Service Worker registratsiya
  // ─────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    // Production'da to'g'ridan-to'g'ri, dev'da delay
    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })
        console.log('SW registered:', reg.scope)

        // Yangilanish bo'lsa - sahifani qayta yuklash taklif
        reg.addEventListener('updatefound', () => {
          const newSW = reg.installing
          if (newSW) {
            newSW.addEventListener('statechange', () => {
              if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('Yangi versiya mavjud')
              }
            })
          }
        })
      } catch (err) {
        console.error('SW registration failed:', err)
      }
    }

    // Window load bo'lganda registratsiya
    if (document.readyState === 'complete') {
      register()
    } else {
      window.addEventListener('load', register)
      return () => window.removeEventListener('load', register)
    }
  }, [])

  // ─────────────────────────────────────────
  // Install prompt event'ni kuzatish
  // ─────────────────────────────────────────
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as InstallPromptEvent)

      // 30 sekunddan keyin banner ko'rsatamiz (zudlik bilan emas)
      const lastDismissed = localStorage.getItem('yuristim_pwa_dismissed')
      const dismissedRecently = lastDismissed &&
        (Date.now() - parseInt(lastDismissed)) < 7 * 24 * 60 * 60 * 1000 // 7 kun

      if (!dismissedRecently) {
        setTimeout(() => setShowBanner(true), 30000)
      }
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Ilova allaqachon o'rnatilgan bo'lsa
    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setShowBanner(false)
      setInstallPrompt(null)
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // ─────────────────────────────────────────
  // Install tugmasi bosildi
  // ─────────────────────────────────────────
  const handleInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    if (choice.outcome === 'accepted') {
      setShowBanner(false)
    }
    setInstallPrompt(null)
  }

  // ─────────────────────────────────────────
  // Banner'ni yopish
  // ─────────────────────────────────────────
  const handleDismiss = () => {
    setShowBanner(false)
    localStorage.setItem('yuristim_pwa_dismissed', String(Date.now()))
  }

  if (!showBanner || installed || !installPrompt) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 80,  // Mobile bottom nav ustida
      left: 16, right: 16,
      maxWidth: 420, margin: '0 auto',
      background: '#fff',
      border: '0.5px solid #e2e8f0',
      borderRadius: 16,
      boxShadow: '0 12px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
      padding: 16,
      zIndex: 100,
      display: 'flex', alignItems: 'center', gap: 12,
      animation: 'slideUpFade 0.4s cubic-bezier(.4,0,.2,1)',
    }}>
      {/* Icon */}
      <div style={{
        width: 44, height: 44,
        background: 'linear-gradient(135deg, #0f172a, #4338ca)',
        borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Smartphone size={20} color="#fff" />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13.5, fontWeight: 700, color: '#0f172a', marginBottom: 2, letterSpacing: '-0.2px' }}>
          Yuristim'ni o'rnating
        </p>
        <p style={{ fontSize: 11.5, color: '#64748b', lineHeight: 1.4 }}>
          Telefoningizda tezroq oching, xabarlarni o'tkazib yubormang
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
        <button
          onClick={handleInstall}
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '8px 14px',
            background: '#0f172a', color: '#fff',
            border: 'none', borderRadius: 9,
            fontSize: 12, fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
          <Download size={12} /> O'rnatish
        </button>
        <button
          onClick={handleDismiss}
          style={{
            width: 32, height: 32,
            background: '#f1f5f9', border: 'none', borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
          <X size={13} color="#64748b" />
        </button>
      </div>

      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
