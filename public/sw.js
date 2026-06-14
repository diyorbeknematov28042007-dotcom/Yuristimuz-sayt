// ════════════════════════════════════════════════
// YURISTIM SERVICE WORKER v2
// Push notifications + offline support
// ════════════════════════════════════════════════

const CACHE_NAME = 'yuristim-v2'
const OFFLINE_URL = '/offline.html'

const PRECACHE_URLS = [
  '/offline.html',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
]

// INSTALL
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('SW: precache xato:', err)
      })
    })
  )
  self.skipWaiting()
})

// ACTIVATE
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    }).then(() => self.clients.claim())
  )
})

// FETCH - har doim Response qaytaradi
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Faqat GET so'rovlar
  if (request.method !== 'GET') return

  // Faqat HTTP(S)
  if (!request.url.startsWith('http')) return

  // Supabase, Google API, va /api/ uchun cache yo'q
  const url = new URL(request.url)
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('googleapis.com') ||
    url.pathname.startsWith('/api/')
  ) {
    return
  }

  // Navigation request (HTML) - network-first, offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request)
          return networkResponse
        } catch (err) {
          const cache = await caches.open(CACHE_NAME)
          const cached = await cache.match(OFFLINE_URL)
          if (cached) return cached
          return new Response(
            '<html><body><h1>Offline</h1><p>Internet aloqasi yo\'q</p></body></html>',
            { status: 503, headers: { 'Content-Type': 'text/html' } }
          )
        }
      })()
    )
    return
  }

  // Boshqa GET (CSS, JS, rasm) - cache-first, network fallback
  event.respondWith(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME)
        const cached = await cache.match(request)
        if (cached) return cached

        const networkResponse = await fetch(request)

        if (
          networkResponse &&
          networkResponse.status === 200 &&
          url.origin === self.location.origin
        ) {
          cache.put(request, networkResponse.clone()).catch(() => {})
        }

        return networkResponse
      } catch (err) {
        return new Response('Resurs yuklanmadi', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' },
        })
      }
    })()
  )
})

// PUSH
self.addEventListener('push', (event) => {
  let data = {
    title: 'Yuristim',
    body: 'Yangi xabar keldi',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'yuristim-msg',
    data: { url: '/dashboard/chat' },
  }

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() }
    } catch (e) {
      data.body = event.data.text() || data.body
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      tag: data.tag,
      data: data.data,
      vibrate: [200, 100, 200],
      requireInteraction: false,
    })
  )
})

// NOTIFICATION CLICK
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = (event.notification.data && event.notification.data.url) || '/dashboard/chat'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsList) => {
      for (const client of clientsList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus()
          if ('navigate' in client) {
            return client.navigate(targetUrl)
          }
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl)
      }
    })
  )
})
