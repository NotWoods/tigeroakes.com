// @ts-check

export const HOUR = 60 * 60;
export const DAY = 24 * HOUR;

/** @type {CacheQueryOptions} */
export const ignoreSearch = {
  ignoreSearch: true,
  ignoreMethod: true,
};

/**
 * Checks if the given request is for my site.
 * @param {import('workbox-routing').RouteMatchCallbackOptions} url
 */
export function localOrigin({ url }) {
  return url.origin === 'https://tigeroakes.com' || url.hostname === 'localhost';
}
