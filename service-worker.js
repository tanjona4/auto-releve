// service-worker.js

// Ovay ny version isaky ny fanavaozana
const CACHE_NAME = 'tanjona-cache-v3';

const urlsToCache = [
  '/',
  '/index.html',
  '/faq.html',
  '/article.html',
  '/about.html',
  '/contact.html',
  '/privacy.html',
  '/corps.css',
  '/jirama.jpg',
  '/manifest.json'
];

// INSTALLATION: Cache ny pages sy assets rehetra
self.addEventListener('install', event => {
  console.log('[Service Worker] Installation en cours...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching all files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // mamoha service worker avy hatrany
  );
});

// ACTIVATION: Esory ny cache taloha
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activation en cours...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Suppression cache ancien:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// FETCH: Mamaly avy amin'ny cache aloha, raha tsy misy dia maka amin'ny réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// OPTIONNEL: Notification pour mise à jour
self.addEventListener('message', event => {
  if (event.data === 'update') {
    self.skipWaiting();
  }
});
