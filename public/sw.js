const CACHE_NAME = 'cannabisos-v1'

// Only cache static assets, not API calls
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/_next/static/',
  '/favicon.ico'
]

// Install event - cache static resources only
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event - never cache API calls
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  
  // Don't cache API calls at all
  if (url.pathname.startsWith('/api/')) {
    return fetch(event.request)
  }
  
  // For static assets, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response
        }

        // Clone the request
        const fetchRequest = event.request.clone()

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Only cache GET requests for static assets
          if (event.request.method === 'GET' && 
              !url.pathname.startsWith('/api/') &&
              !url.search) {
            const responseToCache = response.clone()
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })
              .catch(() => {
                // Ignore cache errors
              })
          }

          return response
        }).catch(() => {
          // Return cached version if available for static assets
          if (!url.pathname.startsWith('/api/')) {
            return caches.match(event.request)
          }
          
          // For API calls, just let it fail
          throw new Error('Network error')
        })
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})