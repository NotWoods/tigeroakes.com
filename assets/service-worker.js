// @ts-check

import {
  imageCache,
  offlineFallback,
  pageCache,
  staticResourceCache,
} from 'workbox-recipes';

/**
 * @param {ExtendableEvent} event
 */
function deleteOldCache(event) {
  event.waitUntil(caches.delete('cache-4'));
}

self.addEventListener('activate', deleteOldCache);

pageCache();
staticResourceCache();
imageCache({
  matchCallback({ request }) {
    switch (request.destination) {
      case 'image':
      case 'video':
      case 'audio':
        return true;
      default:
        return false;
    }
  },
});
offlineFallback({ pageFallback: 'offline.html' });
