// @ts-check

import { generateURLVariations } from 'workbox-precaching/utils/generateURLVariations';

/**
 * @typedef {import('workbox-core').WorkboxPlugin} WorkboxPlugin
 */

/**
 * @implements {WorkboxPlugin}
 */
export class UrlVariationsPlugin {
  /**
   *
   * @param {import('workbox-precaching/_types').PrecacheRouteOptions} options
   */
  constructor(options = {}) {
    this.options = options;
  }

  /**
   * @param {import('workbox-core').CachedResponseWillBeUsedCallbackParam} param
   * @return {Promise<Response | undefined>}
   */
  async cachedResponseWillBeUsed(param) {
    const { request, cacheName, cachedResponse, matchOptions } = param;
    if (cachedResponse) return cachedResponse;

    const cache = await caches.open(cacheName);
    for (const url of generateURLVariations(request.url, this.options)) {
      const response = await cache.match(url, matchOptions);
      if (response) return response;
    }
    return undefined;
  }
}
