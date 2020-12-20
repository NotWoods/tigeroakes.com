// @ts-check

import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import {
  CacheFirst,
  NetworkFirst,
  NetworkOnly,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import preloadManifest from 'workbox:preload';
import staticManifest from 'workbox:static';
import { DAY, ignoreSearch, localOrigin } from './consts.js';
import { assetDestinations, isSinglePage } from './html-route.js';
import { UrlVariationsPlugin } from './url-variants-plugin.js';

const CACHE_NAME = 'cache-4';

async function install() {
  const cache = await caches.open(CACHE_NAME);

  // Extra preloaded resources, not a dependency
  cache
    .addAll(preloadManifest.map((entry) => entry.url))
    .then(() => console.log('Preloading done'));
  // Core resources, dependency
  return await cache.addAll(staticManifest.map((entry) => entry.url));
}

async function activate() {
  const keys = await caches.keys();
  const toRemove = keys.filter((name) => name !== CACHE_NAME);
  return Promise.all(toRemove.map((name) => caches.delete(name)));
}

// @ts-ignore
self.addEventListener('install', (evt) => evt.waitUntil(install()));
// @ts-ignore
self.addEventListener('activate', (evt) => evt.waitUntil(activate()));

// Assets
registerRoute(
  function hashedAsset({ request, url }) {
    switch (request.destination) {
      // All local CSS is hashed
      case 'style':
        return localOrigin(url);
      // All JS in this folder is hashed
      case 'script':
        return localOrigin(url) && url.pathname.startsWith('/js/');
      case 'image': {
        if (!localOrigin(url)) return false;
        const filename = url.pathname.slice(url.pathname.lastIndexOf('/'));
        const matches = filename.match(/_/g);
        // Lots of underscores means the image is hashed.
        return matches != null && matches.length > 4;
      }
      default:
        return false;
    }
  },
  new CacheFirst({
    cacheName: CACHE_NAME,
    plugins: [
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * DAY }),
    ],
    matchOptions: ignoreSearch,
  })
);
registerRoute(
  function notHashedAssets({ request }) {
    return assetDestinations.has(request.destination);
  },
  new StaleWhileRevalidate({
    cacheName: CACHE_NAME,
    plugins: [
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * DAY }),
    ],
    matchOptions: ignoreSearch,
  })
);

registerRoute(
  function insightsJsTic({ url }) {
    return url.hostname === 'getinsights.io' && url.pathname === '/app/tics';
  },
  new NetworkOnly({
    plugins: [
      new BackgroundSyncPlugin('insights-js', {
        maxRetentionTime: 24 * 60, // Retry for max of 24 Hours (specified in minutes)
      }),
    ],
  })
);

registerRoute(
  ({ request }) => request.destination === 'document',
  new NetworkFirst({
    cacheName: CACHE_NAME,
    plugins: [new UrlVariationsPlugin()],
    matchOptions: ignoreSearch,
  })
);

setCatchHandler(async ({ event }) => {
  console.log('catch', event);
  switch (event.request.destination) {
    case 'document':
      const cache = await caches.open(CACHE_NAME);
      return caches.match('/offline.html');
    default:
      return Response.error();
  }
});
