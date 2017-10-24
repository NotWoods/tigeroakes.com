const CACHE = 'v2';

function precache() {
  return caches.open(CACHE).then((cache) => {
    cache.addAll([
      './images/contact/white-github.svg',
      './images/contact/white-twitter.svg',
      './images/contact/white-linkedin.svg',
      './images/profile-4x.jpg',
      './images/hero.jpg',
      './images/big-island-buses/logo.png',
      './images/bit-ball/logo.png',
      './images/buses-r-us/logo.png',
      './images/latch-on/logo.png',
      './images/mbta-energy/logo.png',
      './images/oml-contracting/logo.svg',
      './images/pass-the-bomb/logo.svg',
      './images/the-golden-quest/logo.png',
      './images/ubc-farm/logo.png',
      './images/unity-polygon/logo.png',
      './projects/big-island-buses',
      './projects/bit-ball',
      './projects/buses-r-us',
      './projects/latch-on',
      './projects/mbta-energy',
      './projects/oml-contracting',
      './projects/pass-the-bomb',
      './projects/the-golden-quest',
      './projects/ubc-farm',
      './projects/unity-polygon2d-editor',
    ]);
    return cache.addAll([
      './',
      './projects/',
      './resume/',
      './contact/',
    ]);
  });
}

function downloadAndSave(request, cache) {
  return fetch(request).then((response) => {
    if (response.ok && !response.url.startsWith('data:')) {
      cache.put(request, response.clone());
    }

    return response;
  });
}

function fromCacheAndUpdate(request) {
  return caches.open(CACHE)
    .then(cache => cache.match(request).then((response) => {
      const networkResponse = downloadAndSave(request, cache);
      return response || networkResponse;
    }));
}

self.addEventListener('install', (e) => {
  console.log('The service worker is being installed');
  e.waitUntil(
    precache()
      .then(() => console.log('Install complete'))
      .catch(err => console.error(err))
  );
});

self.addEventListener('fetch', e => e.respondWith(fromCacheAndUpdate(e.request)));
