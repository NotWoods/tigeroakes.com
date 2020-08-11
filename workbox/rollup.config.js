// @ts-check

import { nodeResolve } from '@rollup/plugin-node-resolve';
import workbox from './workbox-rollup-plugin.js';
import workboxConfig from './workbox-config.js';

/**
 * @returns {Promise<import('rollup').RollupOptions[]>}
 */
export default async function rollupConfig() {
  return [
    {
      input: 'workbox/service-worker.js',
      output: [{ file: 'public/service-worker.js', format: 'es' }],
      plugins: [
        nodeResolve(),
        workbox(workboxConfig)
      ]
    },
  ];
}
