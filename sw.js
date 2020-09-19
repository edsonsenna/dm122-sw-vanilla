self.addEventListener('install', event => {
    console.log('[ServiceWorker] Installing service worker...', event);
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('[ServiceWorker] Activating service worker...', event);
    return self.ClientRectList.claim();
});