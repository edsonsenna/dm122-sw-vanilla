'use strict';

if ('serviceWorker' in navigator) {

    const onSuccess = () => console.log('[ServiceWorker] Registered');
    const onFailure = (err) => console.log('[ServiceWorkerErr]', err);
    
    navigator.serviceWorker
        .register('sw.js')
        .then(onSuccess)
        .catch(onFailure);
}