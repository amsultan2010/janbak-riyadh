import { defineConfig } from 'astro/config';

// SITE_URL is the public address, used for canonical links, the sitemap and share images.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://janbak-riyadh.vercel.app',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  vite: { build: { sourcemap: false } },
});
