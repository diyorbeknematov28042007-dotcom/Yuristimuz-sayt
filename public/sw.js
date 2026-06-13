// ════════════════════════════════════════════════
// YURISTIM SERVICE WORKER
// PWA + Push Notifications
// ════════════════════════════════════════════════

const CACHE_NAME = 'yuristim-v1'
const OFFLINE_URL = '/offline.html'

// ─────────────────────────────────────────────
// O'RNATISH (install)
// Asosiy fayllarni cache'ga oladi
// ─────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/offline.html',
        '/icon-192.png',
        '/icon-512.png',
        '/manifest.json',
      ]).catch(() => {
        // Agar fayllar yo'q bo'lsa, skip qilamiz
        return Promise.resolve()
      })
    })
  )
  // Yangi SW darhol faollasin
  self.skipWaiting()
})

// ─────────────────────────────────────────────
// FAOLLASHTIRISH (activate)
// Eski cache'larni tozalaydi
// ─────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    }).then(() => self.clients.claim())
  )
})

// ─────────────────────────────────────────────
// FETCH STRATEGIYA
// Network-first, fallback to cache, fallback to offline
// ─────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Faqat GET so'rovlar uchun
  if (request.method !== 'GET') return

  // API so'rovlarini cache qilmaymiz
  if (request.url.includes('/api/')) return
  if (request.url.includes('supabase.co')) return
  if (request.url.includes('googleapis.com')) return

  // Faqat o'z domain'imizdagi so'rovlar
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // HTML so'rovlar uchun network-first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match(OFFLINE_URL))
    )
    return
  }

  // Boshqa resurslarga network-first, fallback cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Muvaffaqiyatli javobni cache'ga qo'shamiz
        if (response && response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
        }
        return response
      })
      .catch(() => caches.match(request))
  )
})

// ─────────────────────────────────────────────
// PUSH NOTIFICATIONS
// Faza 2.5b da to'liq ishlaydi
// ─────────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return

  let payload = {}
  try {
    payload = event.data.json()
  } catch (e) {
    payload = { title: 'Yuristim', body: event.data.text() }
  }

  const {
    title = 'Yuristim',
    body = 'Yangi xabar',
    icon = '/icon-192.png',
    badge = '/icon-192.png',
    tag = 'yuristim-msg',
    data = {},
  } = payload

  const options = {
    body,
    icon,
    badge,
    tag,
    data,
    requireInteraction: false,
    vibrate: [200, 100, 200],
    lang: 'uz',
    dir: 'ltr',
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// ─────────────────────────────────────────────
// NOTIFICATION CLICK
// Foydalanuvchi bildirishnomani bosganda
// ─────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const url = event.notification.data?.url || '/dashboard/chat'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Agar Yuristim allaqachon ochiq bo'lsa - shu tab'ga o'tish
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url)
          return client.focus()
        }
      }
      // Yo'q bo'lsa - yangi tab ochish
      if (self.clients.openWindow) {
        return self.clients.openWindow(url)
      }
    })
  )
})

// ─────────────────────────────────────────────
// BACKGROUND SYNC (kelajak uchun zaxira)
// ─────────────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-messages') {
    // Faza 2.5b da to'ldiriladi
  }
})
