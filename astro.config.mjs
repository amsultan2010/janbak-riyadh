import { defineConfig } from 'astro/config';

// SITE_URL is the public address, used for canonical links, the sitemap and share images.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://janbak-riyadh.vercel.app',
  trailingSlash: 'always',
  // the preview tool hands out a free port when 4321 is taken by another checkout
  server: { port: Number(process.env.PORT) || 4321 },
  devToolbar: { enabled: false },
  vite: { build: { sourcemap: false } },
});
