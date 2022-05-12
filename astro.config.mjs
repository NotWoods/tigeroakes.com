import preact from '@astrojs/preact';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: process.env.DEPLOY_PRIME_URL || 'https://tigeroakes.com',
  publicDir: './static',
  trailingSlash: 'always',
  integrations: [preact(), tailwind({ config: { applyBaseStyles: false } })],
  build: {
    format: 'file',
  },
  markdown: {
    drafts: process.env.NETLIFY_CONTEXT === 'deploy-preview',
  },
});
