declare module 'workbox-expiration' {
  import {
    CacheDidUpdateCallback,
    CachedResponseWillBeUsedCallback,
    WorkboxPlugin,
  } from 'workbox-core';

  export class ExpirationPlugin implements WorkboxPlugin {
    constructor(config?: ExpirationPluginConfig);
    cacheDidUpdate: CacheDidUpdateCallback;
    cachedResponseWillBeUsed: CachedResponseWillBeUsedCallback;
    deleteCacheAndMetadata(): Promise<void>;
  }

  export interface ExpirationPluginConfig {
    maxAgeSeconds?: number;
    maxEntries?: number;
    purgeOnQuotaError?: boolean;
  }
}

declare module 'workbox:manifest' {
  import { ManifestEntry } from 'workbox-build';

  const manifest: ManifestEntry[];
  export default manifest;
}
