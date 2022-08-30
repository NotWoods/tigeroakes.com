import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import htmlMinify from "@frontendista/astro-html-minify";
import { defineConfig } from 'astro/config';
import { VitePWA } from 'vite-plugin-pwa';

// https://astro.build/config
export default defineConfig({
  site: 'https://tigeroakes.com',
  publicDir: './static',
  trailingSlash: 'always',
  integrations: [
    preact(),
    tailwind({ config: { applyBaseStyles: false } }),
    mdx(),
    sitemap(),
    htmlMinify({
      htmlTerserMinifierOptions: {
        collapseInlineTagWhitespace: false,
        minifyCSS: false,
        minifyJS: false,
        processConditionalComments: false,
        removeTagWhitespace: false,
        removeRedundantAttributes: false,
        removeScriptTypeAttributes: false,
      }
    })
  ],
  markdown: {
    drafts: process.env.NETLIFY_CONTEXT === 'deploy-preview',
    shikiConfig: {
      theme: 'dark-plus',
    },
  },
  vite: {
    plugins: [
      VitePWA({
        mode:
          process.env.NETLIFY_CONTEXT === 'production' ||
          process.env.NETLIFY_CONTEXT === 'branch-deploy'
            ? 'production'
            : 'development',
        srcDir: 'static',
        registerType: 'autoUpdate',
        injectRegister: 'inline',
        includeAssets: ['font/**/*.woff2', 'contact/*'],
        minify: false,
        manifest: false,
        workbox: {
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                networkTimeoutSeconds: 3,
                cacheName: 'pages',
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: ({ request }) =>
                request.destination === 'style' ||
                request.destination === 'script' ||
                request.destination === 'worker',
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'static-resources',
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            {
              urlPattern: ({ request }) =>
                request.destination === 'image' ||
                request.destination === 'video' ||
                request.destination === 'audio',
              handler: 'CacheFirst',
              options: {
                cacheName: 'images',
                cacheableResponse: { statuses: [0, 200] },
                expiration: {
                  maxEntries: 60,
                  maxAgeSeconds: 30 * 24 * 60 * 60,
                },
              },
            },
          ],
        },
      }),
    ],
  },
});
