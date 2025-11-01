// Service Worker for ClickUp Clone PWA
const CACHE_NAME = 'clickup-clone-v1.0.0'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell')
      return cache.addAll(urlsToCache)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  // Skip API requests (always fetch from network)
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response before caching
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
          return response
        })
        .catch(() => {
          // Return cached version if available
          return caches.match(event.request)
        })
    )
    return
  }

  // For other requests, try cache first, then network
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log('[Service Worker] Serving from cache:', event.request.url)
        return response
      }

      return fetch(event.request)
        .then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch((error) => {
          console.error('[Service Worker] Fetch failed:', error)
          // Return a custom offline page if available
          return caches.match('/offline.html')
        })
    })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag)
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData())
  }
})

async function syncData() {
  try {
    // Sync any pending data when back online
    console.log('[Service Worker] Syncing data...')
    // Add your sync logic here
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error)
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event)
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  }

  event.waitUntil(self.registration.showNotification('ClickUp Clone', options))
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event)
  event.notification.close()

  event.waitUntil(clients.openWindow('/'))
})
