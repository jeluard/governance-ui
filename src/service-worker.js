import { manifest, version } from '@parcel/service-worker';
import { REFERENDA_UPDATES_TAG } from './utils/service-worker';

const ASSETS_CACHE = `assets-version-${version}`;
const ALL_CACHES = [ASSETS_CACHE];

async function install() {
  // Cache all assets
  const cache = await caches.open(ASSETS_CACHE);
  await cache.addAll(manifest);
}

// First entry point, only called once per service worker version
// See https://web.dev/service-worker-lifecycle/
addEventListener('install', (e) => {
  // Use latest version right away, even if some clients are using an older version
  self.skipWaiting();

  e.waitUntil(install());
});

async function activate() {
  // Delete older caches
  const keys = await caches.keys();
  await Promise.all(
    keys.map((key) => !ALL_CACHES.includes(key) && caches.delete(key))
  );
}

self.addEventListener('activate', (e) => {
  e.waitUntil(activate());
  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin == location.origin && manifest.includes(url.pathname)) {
    // Only consider cached assets
    event.respondWith(
      caches.open(ASSETS_CACHE).then((cache) => {
        return cache.match(event.request).then(async (response) => {
          if (response) {
            return response;
          } else {
            // This should never happen
            const responseFromNetwork = await fetch(event.request);
            cache.put(event.request, responseFromNetwork.clone());
            return responseFromNetwork;
          }
        });
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  console.log(
    `Notification clicked ${event.action}`,
    event.notification,
    event.reply
  );
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag === REFERENDA_UPDATES_TAG) {
    const notifyUser = true;
    if (notifyUser) {
      // See https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
      self.registration.showNotification('Vibration Sample', {
        body: 'Buzz! Buzz!',
        actions: [
          {
            action: 'news',
            title: 'News',
            icon: '/assets/icons/icon-192x192.png',
          },
          {
            action: 'no',
            type: 'text',
            title: '👎 No (explain why)',
            placeholder: 'Type your explanation here',
          },
        ],
        icon: '../assets/icons/icon-192x192.png',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        tag: 'vibration-sample',
        requireInteraction: true,
        data: { key: 'value' },
      });
    }
    //event.waitUntil(fetchAndCacheLatestNews());
  }
});
