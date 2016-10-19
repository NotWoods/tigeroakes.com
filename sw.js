const CACHE = 'cache-and-update';

function precache() {
	return caches.open(CACHE).then(cache => cache.addAll([
		'./index.html'
	]));
}

function fromCache(request) {
	return caches.open(CACHE).then(cache =>
		fetch(request).then(response => cache.put(request, response))
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
