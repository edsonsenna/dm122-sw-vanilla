const cacheName = 'app-shell-v6';
const assetsToCache = [
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
  'https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  'https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'assets/images/pwa-logo.png',
  'assets/icons/',
  'assets/js/material.min.js',
  'assets/css/style.css',
  'assets/js/app.js',
  'favicon.ico',
  'index.html',
  '/',
  'manifest.json'
];

function removeOldCache(key) {
  if (key !== cacheName) {
    console.log(`[ServiceWorker] Removing old cache: ${key}`);
    return caches.delete(key);
  }
}

async function cacheCleanup() {
  const keyList = await caches.keys();
  return Promise.all(keyList.map(removeOldCache));
}

async function cacheStaticAssets() {
  const cache = await caches.open(cacheName);
  return cache.addAll(assetsToCache);
}

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing service worker...', event);
  event.waitUntil(cacheStaticAssets());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating service worker...', event);
  event.waitUntil(cacheCleanup());
  return self.clients.claim();
});

async function networkFirst(request) {
  try {
    return await fetch(request);
  } catch (err) {
    const cache = await caches.open(cacheName);
    return cache.match('offline.html');
  }
}

async function cacheFirst(request) {
    try {
        const cache = await caches.open(cacheName);
        const response = await cache.match(request);
        return response || fetch(request);
    } catch (err) {
        console.log('[ServiceWorkerErr]', err);
    }
  }

self.addEventListener('fetch', (event) => {
  console.log('[ServiceWorker] Fetch event...', event);
  event.respondWith(cacheFirst(event.request));
});
