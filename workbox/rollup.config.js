// @ts-check

import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import workbox from './lib/workbox-rollup-plugin.js';

const globDirectory = 'public/';

/**
 * @returns {Promise<import('rollup').RollupOptions>}
 */
export default async function rollupConfig({ configDebug }) {
  const mode = configDebug ? 'development' : 'production';
  return {
    input: 'workbox/src/service-worker.js',
    output: [
      { file: 'public/service-worker.js', format: 'iife', sourcemap: true },
    ],
    plugins: [
      replace({
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      nodeResolve(),
      workbox({
        globDirectory,
        globPatterns: [
          'offline.html',
          'css/**/*.css',
          'js/**/*.js',
          // Home page
          'profile_*_{80,160}x0_*.jpg',
          'contact/**/*.{jpg,svg}',
          // Projects page
          'projects/*/logo.svg',
          'projects/*/logo_*_128x0_*.png',
          // Blog & Talks
          'posts/*/banner.{png,jpg,svg}',
          'talks/*/slide.{png,jpg,svg}',
          // Fonts
          'font/**/*.woff2',
        ],
        // Hugo already includes a hash on processed images: img_hash_hash_WxH_resize_quality_box.jpg
        // Hugo also has a hash on CSS and JS: file.hash.css
        dontCacheBustURLsMatching: /[a-z]+(?:_[a-z]+_[a-z0-9]+_[a-z0-9]+\.(?:png|jpg)|\.[a-f0-9]+\.(?:css|js))$/,
        moduleId: 'static',
      }),
      workbox({
        globDirectory,
        globPatterns: [
          // Home page
          'index.html',
          // Featured projects
          'projects/{mozilla-firefox,google,yelp,big-island-buses}/**/*.{html,jpg,svg,png}',
          'posts/{react-to-compose-dictionary, maskable-icons}/**/*.{html,jpg,svg,png,gif}',
          // Projects page
          'projects/index.html',
          // Blog & Talks
          '{posts,talks,featured-in}/index.html',
          'tags/**/*.html',
          // Resume
          'resume/index.html',
        ],
        moduleId: 'preload',
      }),
      mode === 'production' ? terser() : undefined,
    ],
  };
}
