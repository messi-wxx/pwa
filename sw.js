importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.1.0/workbox-sw.js");
var cacheStorageKey = 'xxx'
var cacheList = [
	'/'
]
self.addEventListener('install', e => {
	e.waitUntil(
		caches.open(cacheStorageKey)
		.then(cache => cache.addAll(cacheList))
		.then(() => self.skipWaiting())
	)
})
self.addEventListener('fetch', function(event) {
	console.log('Handling fetch event for', event.request.url);

	event.respondWith(
		caches.match(event.request).then(function(response) {
			if (response) {
				console.log('Found response in cache:', response);

				return response;
			}
			console.log('No response found in cache. About to fetch from network...');

			return fetch(event.request).then(function(response) {
				console.log('Response from network is:', response);

				return response;
			}).catch(function(error) {
				console.error('Fetching failed:', error);

				throw error;
			});
		})
	);
});
self.addEventListener('activate', function(e) {
	e.waitUntil(
		//获取所有cache名称
		caches.keys().then(cacheNames => {
			return Promise.all(
				// 获取所有不同于当前版本名称cache下的内容
				cacheNames.filter(cacheNames => {
					return cacheNames !== cacheStorageKey
				}).map(cacheNames => {
					return caches.delete(cacheNames)
				})
			)
		}).then(() => {
			return self.clients.claim()
		})
	)
})

