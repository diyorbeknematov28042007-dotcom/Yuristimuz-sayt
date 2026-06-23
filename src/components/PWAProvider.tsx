'use client'

import { useEffect, useState } from 'react'
import { Download, X, Smartphone, Share, Plus, Check } from 'lucide-react'

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// iOS Safari aniqlash (PWA o'rnatish faqat qo'lda)
function isIOS(): boolean {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent
  const iOSDevice = /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) // iPad iOS13+
  return iOSDevice
}

// Ilova allaqachon o'rnatilgan (standalone) holatda ishlayaptimi?
function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
}

export default function PWAProvider() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [installed, setInstalled] = useState(false)
  // iOS o'rnatish modali
  const [showIOSModal, setShowIOSModal] = useState(false)
  const [isIOSDevice, setIsIOSDevice] = useState(false)

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
      // Tashqi tugma (triggerInstall) uchun global saqlaymiz
      ;(window as any).__yuristimInstallPrompt = e
      // ESLATMA: banner avtomatik vaqt bilan emas, AMAL bilan ko'rsatiladi
      // (e'lon yozish, AI yurist, profil tahrirlash) — pastdagi trigger useEffect
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Ilova allaqachon o'rnatilgan bo'lsa
    window.addEventListener('appinstalled', () => {
      setInstalled(true)
      setShowBanner(false)
      setShowIOSModal(false)
      setInstallPrompt(null)
      ;(window as any).__yuristimInstallPrompt = null
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // ─────────────────────────────────────────
  // iOS: o'rnatish ko'rsatmasini boshqarish
  // (iOS Safari'da beforeinstallprompt yo'q — qo'lda ko'rsatma kerak)
  // ─────────────────────────────────────────
  useEffect(() => {
    const ios = isIOS()
    setIsIOSDevice(ios)

    // QAT'IY LIMIT: ilova allaqachon o'rnatilgan bo'lsa — hech narsa so'ramaymiz
    if (isStandalone()) {
      setInstalled(true)
      return
    }

    // ── AMAL-TRIGGER: qiymatli amaldan keyin taklif ──
    // (mijoz: e'lon yoki AI yurist · yurist: e'lon yoki profil tahrirlash)
    // Bu event tegishli sahifalardan chaqiriladi
    const triggerHandler = () => {
      // Yaqinda yopgan bo'lsa qayta ko'rsatmaymiz (7 kun)
      const lastDismissed = localStorage.getItem('yuristim_install_dismissed')
      const dismissedRecently = lastDismissed &&
        (Date.now() - parseInt(lastDismissed)) < 7 * 24 * 60 * 60 * 1000
      if (dismissedRecently) return

      // Platformaga qarab: iOS → modal, Android → banner
      if (ios) {
        setShowIOSModal(true)
      } else if ((window as any).__yuristimInstallPrompt) {
        setShowBanner(true)
      }
    }

    // ── MAJBURIY OCHISH: sozlamalardagi "Ilovani o'rnatish" tugmasi ──
    // (limitni tekshirmaydi — foydalanuvchi o'zi bosgan)
    const forceOpenHandler = () => {
      if (ios) {
        setShowIOSModal(true)
      } else if ((window as any).__yuristimInstallPrompt) {
        setShowBanner(true)
      }
    }

    window.addEventListener('yuristim:trigger-install', triggerHandler)
    window.addEventListener('yuristim:show-install', forceOpenHandler)
    return () => {
      window.removeEventListener('yuristim:trigger-install', triggerHandler)
      window.removeEventListener('yuristim:show-install', forceOpenHandler)
    }
  }, [])

  // iOS modalni yopish
  const handleIOSDismiss = () => {
    setShowIOSModal(false)
    localStorage.setItem('yuristim_install_dismissed', String(Date.now()))
  }

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
    localStorage.setItem('yuristim_install_dismissed', String(Date.now()))
  }

  // ─────────────────────────────────────────
  // iOS o'rnatish modali (Android banner'dan alohida)
  // ─────────────────────────────────────────
  if (showIOSModal && isIOSDevice && !installed) {
    return (
      <div
        onClick={handleIOSDismiss}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(15,23,42,0.5)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          zIndex: 10000,
          display: 'flex', alignItems: 'flex-end',
          animation: 'pwaFadeIn 0.3s ease',
        }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            background: '#fff',
            borderRadius: '24px 24px 0 0',
            padding: '26px 22px calc(26px + env(safe-area-inset-bottom))',
            animation: 'pwaSlideUp 0.4s cubic-bezier(.32,.72,0,1)',
          }}>
          {/* Tutqich */}
          <div style={{ width: 38, height: 4, background: '#cbd5e1', borderRadius: 2, margin: '0 auto 18px' }} />

          {/* Logo */}
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, #0f172a, #4338ca)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
            boxShadow: '0 8px 24px rgba(67,56,202,0.3)',
          }}>
            <Smartphone size={26} color="#fff" />
          </div>

          <p style={{ fontSize: 19, fontWeight: 800, color: '#0f172a', textAlign: 'center', marginBottom: 5, letterSpacing: '-0.3px' }}>
            Yuristim'ni o'rnating
          </p>
          <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 1.5, marginBottom: 14 }}>
            Ilovani bosh ekraningizga qo'shing — tezroq oching va xabarlarni o'tkazib yubormang
          </p>

          {/* Marketing eslatma */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 9,
            padding: '11px 13px', background: '#eff6ff', borderRadius: 11,
            marginBottom: 20, border: '1px solid #dbeafe',
          }}>
            <Smartphone size={16} color="#2563eb" style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: '#1e40af', lineHeight: 1.45, margin: 0 }}>
              Mobil ilovamiz ustida ishlamoqdamiz. U tayyor bo'lguncha web ilovani bosh ekraningizdan xuddi oddiy ilovadek ishlatishingiz mumkin.
            </p>
          </div>

          {/* Qadamlar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 13, background: '#f8fafc', borderRadius: 13, marginBottom: 9 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>1</div>
            <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.4, flex: 1, margin: 0 }}>
              Pastdagi <b style={{ color: '#0f172a' }}>Ulashish</b> tugmasini bosing
            </p>
            <Share size={22} color="#2563eb" style={{ flexShrink: 0 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 13, background: '#f8fafc', borderRadius: 13, marginBottom: 9 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>2</div>
            <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.4, flex: 1, margin: 0 }}>
              <b style={{ color: '#0f172a' }}>"Bosh ekranga qo'shish"</b> ni tanlang
            </p>
            <Plus size={22} color="#2563eb" style={{ flexShrink: 0 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: 13, background: '#f8fafc', borderRadius: 13, marginBottom: 18 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>3</div>
            <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.4, flex: 1, margin: 0 }}>
              O'ng yuqoridagi <b style={{ color: '#0f172a' }}>"Qo'shish"</b> tugmasini bosing
            </p>
            <Check size={22} color="#2563eb" style={{ flexShrink: 0 }} />
          </div>

          <button
            onClick={handleIOSDismiss}
            style={{
              width: '100%', padding: 14,
              background: '#0f172a', color: '#fff',
              border: 'none', borderRadius: 13,
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
            Tushunarli
          </button>
        </div>

        <style>{`
          @keyframes pwaFadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes pwaSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        `}</style>
      </div>
    )
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
          Mobil ilovamiz tayyorlanmoqda — hozircha web ilovani bosh ekraningizga qo'shing
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
