import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  vite: {
    optimizeDeps: {
      include: ['gsap', 'gsap/Observer', 'gsap/ScrollTrigger', 'lenis', 'three'],
    },
    server: {
      host: true,
      port: 4321,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
      },
      fs: {
        allow: ['/Users/praneetsarkar/.crate44_runtime', '.'],
      },
    },
  },
});
