// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://mauriciogaraco.github.io',
  base: '/Portfolio',
  integrations: [react()],
  trailingSlash: 'ignore', // opcional
});
