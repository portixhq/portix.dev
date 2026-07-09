import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://portix.dev',
  integrations: [tailwind(), icon()],
  server: {
    port: Number(process.env.PORT) || 4321,
  },
});
