// @ts-check
import { localOrigin } from './consts';

const listPagePaths = new Set([
  '/projects/',
  '/posts/',
  '/talks/',
  '/featured-in/',
]);
const taxonomyTermsPagePaths = new Set(['/tags/', '/categories/']);

/** @type {Set<RequestDestination>} */
export const assetDestinations = new Set([
  'audio',
  'embed',
  'image',
  'video',
  'font',
  'style',
  'script',
]);

/**
 * @param {Set<string>} parentPaths
 * @param {URL} url
 */
function parentPath(parentPaths, url) {
  return (
    !parentPaths.has(url.pathname) &&
    Array.from(parentPaths).some((parent) => url.pathname.startsWith(parent))
  );
}

/**
 * Checks if the given request is for a list page.
 * (i.e. all projects, all blog posts)
 * @param {import('workbox-core').RouteMatchCallbackOptions} options
 */
export function isListPage({ url }) {
  if (!localOrigin(url)) return false;

  // Index pages are matched
  return listPagePaths.has(url.pathname);
}

/**
 * Checks if the given request is for a list page.
 * (i.e. all projects, all blog posts)
 * @param {import('workbox-core').RouteMatchCallbackOptions} options
 */
export function isTaxonomyTermsPage({ url }) {
  if (!localOrigin(url)) return false;

  return taxonomyTermsPagePaths.has(url.pathname);
}

/**
 * Checks if the given request is for a list page.
 * (i.e. all projects, all blog posts)
 * @param {import('workbox-core').RouteMatchCallbackOptions} options
 */
export function isTaxonomyPage({ url }) {
  if (!localOrigin(url)) return false;

  return parentPath(taxonomyTermsPagePaths, url);
}

/**
 * Checks if the given request is for a single page or corresponding resource.
 * @param {import('workbox-core').RouteMatchCallbackOptions} options
 */
export function isSinglePage({ url }) {
  if (!localOrigin(url)) return false;

  return parentPath(listPagePaths, url);
}
