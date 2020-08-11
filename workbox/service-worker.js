// @ts-check

import { ExpirationPlugin } from 'workbox-expiration';
import * as googleAnalytics from 'workbox-google-analytics';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';
// @ts-expect-error
import manifest from 'workbox:manifest'

const HOUR = 60 * 60;
const DAY = 24 * HOUR;

/** @type {CacheQueryOptions} */
const ignoreSearch = {
  ignoreSearch: true,
  ignoreMethod: true,
};

/**
 * Checks if the given request is for my site.
 * @param {import('workbox-core').RouteMatchCallbackOptions} url
 */
function localOrigin({ url }) {
  return url.origin === 'https://tigeroakes.com';
}

googleAnalytics.initialize();

precacheAndRoute(manifest);

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
    cacheName: 'images',
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

// List pages
const listPagePaths = new Set([
  '/projects/',
  '/posts/',
  '/talks/',
  '/featured-in/',
]);

/**
 * Checks if the given request is for a list page.
 * (i.e. all projects, all blog posts)
 * @param {import('workbox-core').RouteMatchCallbackOptions} options
 */
function isListPage(options) {
  if (!localOrigin(options)) return false;

  const { url } = options;
  // Index pages are matched
  if (listPagePaths.has(url.pathname)) return true;
  // Tag pages are also matched
  return url.pathname.includes('/tags/');
}

/**
 * Checks if the given request is for a single page or corresponding resource.
 * @param {import('workbox-core').RouteMatchCallbackOptions} options
 */
function isSinglePage(options) {
  if (!localOrigin(options)) return false;
  if (isListPage(options)) return false;

  const { url } = options;
  for (const parent of listPagePaths) {
    if (url.pathname.startsWith(parent)) return true;
  }
  return false;
}

registerRoute(
  isListPage,
  new NetworkFirst({
    matchOptions: ignoreSearch,
  })
);

// Single pages
registerRoute(
  (options) =>
    options.request.destination === 'document' && isSinglePage(options),
  new StaleWhileRevalidate({
    cacheName: 'single',
    matchOptions: ignoreSearch,
  })
);
registerRoute(
  (options) =>
    options.request.destination !== 'document' && isSinglePage(options),
  new CacheFirst({
    cacheName: 'single_resources',
    matchOptions: ignoreSearch,
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 365 * DAY })],
  })
);
