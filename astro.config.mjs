// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react'; // si usas React

export default defineConfig({
  site: 'https://mauriciogaraco.github.io',
  base: '/Portfolio',
  integrations: [
    tailwind({ config: { applyBaseStyles: true } }),
    react(), // si corresponde
  ],
});
