const CACHE_NAME = 'ar-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/duck.glb', // Dein Modell hier eintragen!
  'https://aframe.io/releases/1.3.0/aframe.min.js',
  'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js'
];

// Dateien installieren und im Cache speichern
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Anfragen abfangen und aus dem Cache servieren
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});