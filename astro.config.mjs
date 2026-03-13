// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  // Disable session KV auto-provisioning — we don't use Astro sessions
  session: {
    driver: { entrypoint: 'unstorage/drivers/null' },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});