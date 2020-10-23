// @ts-check

import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import workbox from './lib/workbox-rollup-plugin.js';
import workboxConfig from './workbox-config.js';

/**
 * @returns {Promise<import('rollup').RollupOptions[]>}
 */
export default async function rollupConfig({ configDebug }) {
  const mode = configDebug ? 'development' : 'production';
  return [
    {
      input: 'workbox/window-async.js',
      output: [
        { file: 'public/js/window-async.js', format: 'es', sourcemap: true },
      ],
      plugins: [nodeResolve(), terser()],
    },
    {
      input: 'workbox/src/service-worker.js',
      output: [
        { file: 'public/service-worker.js', format: 'iife', sourcemap: true },
      ],
      plugins: [
        replace({
          'process.env.NODE_ENV': JSON.stringify(mode),
        }),
        nodeResolve(),
        workbox({ ...workboxConfig, mode }),
        terser(),
      ],
    },
  ];
}
