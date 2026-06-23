// ════════════════════════════════════════════════
// PWA o'rnatish — AMAL asosida taklif qilish
// /src/lib/triggerInstall.ts
// ════════════════════════════════════════════════

declare global {
  interface Window {
    __yuristimInstallPrompt?: any
  }
}

// Ilova allaqachon o'rnatilganmi? (standalone rejimda ishlayaptimi)
export function isAppInstalled(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
}

// ── AMAL-TRIGGER ──
// Qiymatli amaldan keyin chaqiriladi (e'lon yozish, AI yurist, profil tahrirlash).
// PWAProvider o'zi platforma (iOS/Android) va 7-kunlik limitni hisobga oladi.
// O'rnatilgan bo'lsa — hech narsa qilmaydi (qat'iy limit).
//
// Ishlatish: maybeOfferInstall()  — masalan e'lon muvaffaqiyatli yuborilgach
export function maybeOfferInstall() {
  if (typeof window === 'undefined') return
  if (isAppInstalled()) return // qat'iy limit
  window.dispatchEvent(new Event('yuristim:trigger-install'))
}

// ── MAJBURIY OCHISH ──
// Sozlamalardagi "Ilovani o'rnatish" tugmasi uchun (foydalanuvchi o'zi bosadi).
// Limitni tekshirmaydi, lekin o'rnatilgan bo'lsa baribir ko'rsatmaydi.
//
// Android'da to'g'ridan-to'g'ri Chrome oynasini ochishga harakat qiladi.
export async function openInstall(): Promise<'installed' | 'dismissed' | 'ios' | 'unavailable'> {
  if (typeof window === 'undefined') return 'unavailable'
  if (isAppInstalled()) return 'installed'

  // Android/Chrome — saqlangan prompt bor bo'lsa to'g'ridan-to'g'ri
  const prompt = window.__yuristimInstallPrompt
  if (prompt) {
    await prompt.prompt()
    const choice = await prompt.userChoice
    window.__yuristimInstallPrompt = null
    return choice.outcome === 'accepted' ? 'installed' : 'dismissed'
  }

  // iOS yoki prompt yo'q — modal/banner ochamiz
  const ua = window.navigator.userAgent
  const ios = /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  if (ios) {
    window.dispatchEvent(new Event('yuristim:show-install'))
    return 'ios'
  }

  // Desktop yoki qo'llab-quvvatlanmaydi — baribir banner urinib ko'ramiz
  window.dispatchEvent(new Event('yuristim:show-install'))
  return 'unavailable'
}
