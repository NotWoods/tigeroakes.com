const CACHE = 'cache-if-missing';
// https://serviceworke.rs/strategy-cache-and-update_service-worker_doc.html

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
		]);
		return cache.addAll([
			'./',
			'./projects/',
			'./resume/',
			'./contact/',
		]);
	});
}

function fromCache(request) {
	return caches.open(CACHE).then(cache =>
		cache.match(request)
			.then(response => response || fetch(request).then((res) => {
				if (res.ok && !res.url.startsWith('data:')) {
					cache.put(request, res.clone());
				}

				return res;
			}))
	);
}

self.addEventListener('install', (e) => {
	console.log('The service worker is being installed');
	e.waitUntil(precache());
});

self.addEventListener('fetch', e => e.respondWith(fromCache(e.request)));
