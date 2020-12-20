import { getManifest } from 'workbox-build';

/**
 * Import build time constants with Rollup.
 *
 * @param {import('workbox-build').GetManifestConfig & { moduleId: string }} options
 * @returns {import('rollup').Plugin}
 */
export default function workboxPlugin({ moduleId, ...options }) {
  /** @type {Promise<{count: number, manifestEntries: Array<import('workbox-build').ManifestEntry>, size: number, warnings: Array<string>}>} */
  const manifestPromise = getManifest(options);
  const modId = `workbox:${moduleId}`;
  return {
    name: 'workbox',
    resolveId(id) {
      if (id !== modId) return null;
      return id;
    },
    async load(id) {
      if (id !== modId) return null;

      const { manifestEntries, warnings } = await manifestPromise;
      warnings.forEach((warning) => this.warn(warning));
      return `export default ${JSON.stringify(manifestEntries)}`;
    },
  };
}
