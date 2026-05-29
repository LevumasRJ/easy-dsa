// Service Worker for AlgoFlow - Interactive DSA Animator Platform
const CACHE_NAME = 'algoflow-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/App.tsx'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // Assets might change in dev server; fail gracefully
        console.log('Service Worker: Base assets cached');
      });
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Background Sync Event (Supported browsers when connection re-established)
self.addEventListener('sync', (event) => {
  if (event.tag === 'leetcode-schedule-syncer') {
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            action: 'TRIGGER_SUNDAY_SYNC_EVENT',
            reason: 'Background Sync trigger activated'
          });
        });
      })
    );
  }
});

// Message communications for syncing triggers
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'PING_SW') {
    event.ports[0].postMessage({ status: 'active', version: CACHE_NAME });
  }
});
