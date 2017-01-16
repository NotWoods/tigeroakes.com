const CACHE = 'v2';

function precache() {
	return caches.open(CACHE).then((cache) => {
		cache.addAll([
			'./images/contact/white-github.svg',
			'./images/contact/white-twitter.svg',
			'./images/contact/white-linkedin.svg',
			'./images/big-island-buses/logo.png',
			'./images/latch-on/logo.png',
			'./images/mbta-energy/logo.png',
			'./images/oml-contracting/logo.svg',
			'./images/ubc-farm/logo.png',
			'./images/unity-polygon/logo.png',
			'./images/bit-ball/logo.png',
			'./images/pass-the-bomb/logo.svg',
			'./images/profile-4x.jpg',
			'./projects/big-island-buses/',
		]);
		return cache.addAll([
			'./',
			'./projects/',
			'./resume/',
			'./contact/',
		]);
	});
}

function downloadAndSave(request) {
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
			const networkResponse = downloadAndSave(request);

			if (response) return response;
			else networkResponse;
		}));
}

self.addEventListener('install', (e) => {
	console.log('The service worker is being installed');
	e.waitUntil(precache());
});

self.addEventListener('fetch', e => e.respondWith(fromCacheAndUpdate(e.request)));
