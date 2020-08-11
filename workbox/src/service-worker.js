// @ts-check

import { ExpirationPlugin } from 'workbox-expiration';
import * as googleAnalytics from 'workbox-google-analytics';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import manifest from 'workbox:manifest';
import { DAY, ignoreSearch } from './consts.js';
import * as htmlRoute from './html-route.js';
import { catchHandler } from './offline-page'

googleAnalytics.initialize();

precacheAndRoute(manifest);
setCatchHandler(catchHandler);

// Google Fonts
registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 365 * DAY }),
    ],
  })
);

// Images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    plugins: [
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * DAY }),
    ],
    matchOptions: ignoreSearch,
  })
);

// CSS
registerRoute(
  ({ request }) => request.destination === 'style',
  new StaleWhileRevalidate({
    plugins: [
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * DAY }),
    ],
    matchOptions: ignoreSearch,
  })
);

Object.values(htmlRoute).forEach((route) => registerRoute(route));
