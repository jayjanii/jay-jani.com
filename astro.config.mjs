// @ts-check
/**
 * Astro + Cloudflare Workers/Pages (SSR API routes + D1).
 * Tailwind v4 via Vite plugin. Sessions disabled — app uses env + localStorage for admin.
 * @see https://astro.build/config
 */
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  adapter: cloudflare(),
  session: {
    driver: { entrypoint: 'unstorage/drivers/null' },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});