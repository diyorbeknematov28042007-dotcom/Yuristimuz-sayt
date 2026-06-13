// ════════════════════════════════════════════════
// PUSH SUBSCRIPTION MANAGER
// Brauzer ruxsati va Supabase'ga saqlash
// ════════════════════════════════════════════════

import { supabase } from './supabase'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''

// ─────────────────────────────────────────
// Brauzer push notification'ni qo'llab-quvvatlaydimi?
// ─────────────────────────────────────────
export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

// ─────────────────────────────────────────
// Joriy permission holati
// ─────────────────────────────────────────
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isPushSupported()) return 'unsupported'
  return Notification.permission
}

// ─────────────────────────────────────────
// Base64 URL-safe → ArrayBuffer
// (VAPID public key konvertatsiyasi uchun)
// ─────────────────────────────────────────
function urlBase64ToArrayBuffer(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = atob(base64)
  const buffer = new ArrayBuffer(rawData.length)
  const view = new Uint8Array(buffer)
  for (let i = 0; i < rawData.length; ++i) {
    view[i] = rawData.charCodeAt(i)
  }
  return buffer
}

// ─────────────────────────────────────────
// Push notification'ga obuna bo'lish
// ─────────────────────────────────────────
export async function subscribeToPush(userId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    if (!isPushSupported()) {
      return { success: false, error: 'Brauzer push notification\'larni qo\'llab-quvvatlamaydi' }
    }

    if (!VAPID_PUBLIC_KEY) {
      console.error('VAPID public key sozlanmagan')
      return { success: false, error: 'Server sozlanmagan' }
    }

    // Permission so'rash
    let permission = Notification.permission
    if (permission === 'default') {
      permission = await Notification.requestPermission()
    }

    if (permission !== 'granted') {
      return { success: false, error: 'Ruxsat berilmadi' }
    }

    // Service Worker registratsiyasini olish
    const registration = await navigator.serviceWorker.ready

    // Avvalgi subscription bormi tekshirish
    let subscription = await registration.pushManager.getSubscription()

    if (!subscription) {
      // Yangi subscription yaratish
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToArrayBuffer(VAPID_PUBLIC_KEY),
      })
    }

    // Subscription ma'lumotlarini olish
    const sub = subscription.toJSON()
    const p256dh = sub.keys?.p256dh
    const auth = sub.keys?.auth
    const endpoint = sub.endpoint

    if (!p256dh || !auth || !endpoint) {
      return { success: false, error: 'Subscription ma\'lumotlari to\'liq emas' }
    }

    // Supabase'ga saqlash
    const { error } = await supabase.rpc('upsert_push_subscription', {
      p_user_id: userId,
      p_endpoint: endpoint,
      p_p256dh: p256dh,
      p_auth: auth,
      p_user_agent: navigator.userAgent,
    })

    if (error) {
      console.error('Supabase subscription save error:', error)
      return { success: false, error: 'Saqlashda xato: ' + error.message }
    }

    return { success: true }
  } catch (err: any) {
    console.error('Subscribe error:', err)
    return { success: false, error: err.message || 'Noma\'lum xato' }
  }
}

// ─────────────────────────────────────────
// Push notification'dan obunani bekor qilish
// ─────────────────────────────────────────
export async function unsubscribeFromPush(userId: string): Promise<{
  success: boolean
  error?: string
}> {
  try {
    if (!isPushSupported()) {
      return { success: false, error: 'Qo\'llab-quvvatlanmaydi' }
    }

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()

    if (subscription) {
      const endpoint = subscription.endpoint

      // Brauzer'dan unsubscribe
      await subscription.unsubscribe()

      // Database'dan o'chirish
      await supabase.rpc('delete_push_subscription', {
        p_user_id: userId,
        p_endpoint: endpoint,
      })
    }

    return { success: true }
  } catch (err: any) {
    console.error('Unsubscribe error:', err)
    return { success: false, error: err.message || 'Noma\'lum xato' }
  }
}

// ─────────────────────────────────────────
// Joriy subscription holati
// ─────────────────────────────────────────
export async function getSubscriptionStatus(): Promise<{
  isSubscribed: boolean
  permission: NotificationPermission | 'unsupported'
}> {
  const permission = getNotificationPermission()

  if (permission === 'unsupported') {
    return { isSubscribed: false, permission }
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    return {
      isSubscribed: !!subscription,
      permission,
    }
  } catch {
    return { isSubscribed: false, permission }
  }
}
