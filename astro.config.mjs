import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://portix.one',
  integrations: [
    tailwind(),
    icon(),
    sitemap(),
  ],
  devToolbar: { enabled: false },
  server: {
    port: Number(process.env.PORT) || 4321,
  },
});
