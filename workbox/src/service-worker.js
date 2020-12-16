// @ts-check

import { ExpirationPlugin } from 'workbox-expiration';
import * as googleAnalytics from 'workbox-google-analytics';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import manifest from 'workbox:manifest';
import { DAY, ignoreSearch } from './consts.js';
import { isSinglePage, assetDestinations } from './html-route.js';
import { catchHandler } from './offline-page';

googleAnalytics.initialize();

precacheAndRoute(manifest, {
  ignoreURLParametersMatching: [/.*/],
});

// Assets
registerRoute(
  ({ request }) => assetDestinations.has(request.destination),
  new CacheFirst({
    cacheName: 'assets-navy',
    plugins: [
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * DAY }),
    ],
    matchOptions: ignoreSearch,
  })
);

registerRoute(
  (options) =>
    options.request.destination === 'document' && isSinglePage(options),
  new StaleWhileRevalidate({
    matchOptions: ignoreSearch,
  })
);

setCatchHandler(catchHandler);
