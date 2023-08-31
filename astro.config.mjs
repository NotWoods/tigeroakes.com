import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig, sharpImageService } from 'astro/config';
import AstroPWA from '@vite-pwa/astro';
import rehypeKatex from 'rehype-katex';
import remarkBehead from 'remark-behead';
import remarkMath from 'remark-math';

// https://astro.build/config
export default defineConfig({
  site: 'https://tigeroakes.com',
  publicDir: './static',
  trailingSlash: 'always',
  image: {
    service: sharpImageService(),
  },
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [
    preact(),
    tailwind({ applyBaseStyles: false }),
    mdx(),
    sitemap(),
    AstroPWA({
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
  markdown: {
    drafts: process.env.NETLIFY_CONTEXT === 'deploy-preview',
    shikiConfig: {
      theme: 'dark-plus',
    },
    remarkPlugins: [remarkMath, [remarkBehead, { minDepth: 3 }]],
    rehypePlugins: [[rehypeKatex, { output: 'mathml' }]],
  },
});
