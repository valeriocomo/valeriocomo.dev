import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import UnoCSS from 'unocss/astro';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  // site: 'https://valeriocomo.github.io',
  // base: 'valeriocomo.dev',
  site: isProduction  ? 'https://valeriocomo.github.io' : 'https://localhost:3000/',
  base: isProduction ?  'valeriocomo.dev' : '',
  server: {
    host: "127.0.0.1",
    port: 4321
  },
  trailingSlash: 'ignore',
  integrations: [sitemap(), UnoCSS({ injectReset: true })],
  vite: {
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
  },  
})