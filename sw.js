const CACHE = 'cache-and-update';
// https://serviceworke.rs/strategy-cache-and-update_service-worker_doc.html

function precache() {
	return caches.open(CACHE).then((cache) => {
		cache.addAll([
			'./images/contact/white-github.svg',
			'./images/contact/white-twitter.svg',
			'./images/contact/white-linkedin.svg',
			/*'./images/big-island-buses/logo.png',
			'./images/latch-on/logo.png',
			'./images/mbta-energy/logo.png',
			'./images/oml-contracting/logo.svg',
			'./images/ubc-farm/logo.png',
			'./images/unity-polygon/logo.png',*/
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
		cache.match(request).then(match => match || Promise.reject('no-match'))
	);
}

function update(request) {
	return caches.open(CACHE).then(cache =>
		fetch(request).then(response => cache.put(request, response))
	);
}

self.addEventListener('install', (e) => {
	console.log('The service worker is being installed');
	e.waitUntil(precache());
});

self.addEventListener('fetch', (e) => {
	console.log('The service worker is serving the asset.');
	e.respondWith(fromCache(e.request));
	e.waitUntil(update(e.request));
});
