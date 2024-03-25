// @ts-check
import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import AstroPWA from '@vite-pwa/astro';
import expressiveCode from 'astro-expressive-code';
import { defineConfig, sharpImageService } from 'astro/config';
import { pluginDataLang } from 'expressive-code-plugin-data-lang';
import rehypeKatex from 'rehype-katex';
import remarkBehead from 'remark-behead';
import remarkMath from 'remark-math';
import { exclude as reactFiles } from './tsconfig.json';

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
    // React is used for Fluent UI blogposts so we need to instruct Astro to ignore some files
    preact({ exclude: reactFiles }),
    react({ include: reactFiles }),
    // Using tailwind, with base styles in global.css
    tailwind({ applyBaseStyles: false }),
    expressiveCode({
      themes: ['dark-plus', 'light-plus'],
      styleOverrides: {
        borderRadius: '0',
        codeFontFamily: 'var(--font-family-mono)',
        uiFontFamily: 'var(--font-family-sans)',
        frames: {
          frameBoxShadowCssValue: 'var(--shadow-md)',
          editorTabsMarginInlineStart: '0.5rem',
        },
      },
      plugins: [pluginDataLang()],
    }),
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
    remarkPlugins: [
      remarkMath, // Interpret LaTeX math
      [remarkBehead, { minDepth: 3 }], // Convert markdown headings to match site structure
    ],
    rehypePlugins: [
      [rehypeKatex, { output: 'mathml' }], // Render LaTeX math as MathML
    ],
  },
  vite: {
    ssr: {
      noExternal: ['@fluentui/react-icons'],
    },
  },
});
