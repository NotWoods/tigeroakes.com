// @ts-check

import manifest from 'workbox:manifest';
import { localOrigin } from './consts';

const listPagePaths = new Set([
  '/projects/',
  '/posts/',
  '/talks/',
  '/featured-in/',
]);

const TOPIC_URL = /^projects\/[\w-]+\/index\.html$/;
const INDEX_LENGTH = 'index.html'.length;
const precachedTopics = new Set(
  manifest
    .filter((entry) => TOPIC_URL.test(entry.url))
    .map((entry) => '/' + entry.url.slice(0, -INDEX_LENGTH))
);
console.log(precachedTopics);

/** @type {Set<RequestDestination>} */
export const assetDestinations = new Set(['audio', 'embed', 'image', 'video']);

/**
 * Checks if the given request is for a list page.
 * (i.e. all projects, all blog posts)
 * @param {import('workbox-routing').RouteMatchCallbackOptions} options
 */
export function isListPage(options) {
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
export function isSinglePage(options) {
  console.log(options.url);
  if (!localOrigin(options)) return false;
  if (isListPage(options)) return false;

  const { url } = options;
  if (precachedTopics.has(url.pathname)) return false;

  for (const parent of listPagePaths) {
    if (url.pathname.startsWith(parent)) {
      console.log('single: true');
      return true;
    }
  }
  console.log('single: false');
  return false;
}
