const cacheName = 'app-shell-v1';
const assetsToCache = [
    'offline.html'
];

function removeOldCache(key) {
    if(key !== cacheName) {
        console.log(`[ServiceWorker] Removing old cache: ${key}`);
        return caches.delete(key);
    }
}

async function cacheCleanup() {
    const keyList = await caches.key();
    return Promise.all(keyList.map(removeOldCache));
}

async function cacheStaticAssets() {
    const cache = await caches.open(cacheName);
    return cache.addAll(assetsToCache);
}

self.addEventListener('install', event => {
    console.log('[ServiceWorker] Installing service worker...', event);
    event.waitUntil(cacheStaticAssets());
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('[ServiceWorker] Activating service worker...', event);
    event.waitUntil(cacheCleanup());
    return self.clients.claim();
});

async function networkFirst(request) {
    try{
        return await fetch(request);
    } catch(err) {
        const cache = await caches.open(cacheName);
        return cache.match('offline.html');
    }
}

self.addEventListener('fetch', event => {
    console.log('[ServiceWorker] Fetch event...', event);
    event.respondWith(networkFirst(event.request));
})