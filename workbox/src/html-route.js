// @ts-check

import { ExpirationPlugin } from 'workbox-expiration';
import { Route } from 'workbox-routing';
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import { DAY, ignoreSearch, localOrigin } from './consts';

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
 * @param {import('workbox-routing').RouteMatchCallbackOptions} options
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
 * @param {import('workbox-routing').RouteMatchCallbackOptions} options
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

export const listRoute = new Route(
  isListPage,
  new NetworkFirst({
    matchOptions: ignoreSearch,
  })
);

// Single pages
export const singleRoute = new Route(
  (options) =>
    options.request.destination === 'document' && isSinglePage(options),
  new StaleWhileRevalidate({
    cacheName: 'single',
    matchOptions: ignoreSearch,
  })
);
export const singleResourcesRoute = new Route(
  (options) =>
    options.request.destination !== 'document' && isSinglePage(options),
  new CacheFirst({
    cacheName: 'single_resources',
    matchOptions: ignoreSearch,
    plugins: [new ExpirationPlugin({ maxAgeSeconds: 365 * DAY })],
  })
);
