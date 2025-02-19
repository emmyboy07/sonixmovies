const CACHE_NAME = "sonix-movies-cache-v1"
const OFFLINE_URL = "/offline.html"

const urlsToCache = ["/", OFFLINE_URL, "/manifest.json", "/icon-192x192.png", "/icon-512x512.png", "/favicon.ico"]

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
    }),
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  // Handle API requests differently
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: "Currently offline" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        })
      }),
    )
    return
  }

  // Handle image requests
  if (event.request.destination === "image") {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request)
            .then((response) => {
              const responseClone = response.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone)
              })
              return response
            })
            .catch(() => {
              return caches.match("/placeholder.svg")
            })
        )
      }),
    )
    return
  }

  // Handle navigation requests
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL)
      }),
    )
    return
  }

  // Default fetch handler
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
          return response
        })
      )
    }),
  )
})

// Handle push notifications
self.addEventListener("push", (event) => {
  const data = event.data.json()
  const options = {
    body: data.message,
    icon: "/icon-192x192.png",
    badge: "/icon-192x192.png",
  }

  event.waitUntil(self.registration.showNotification("Sonix Movies", options))
})

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow("/"))
})

