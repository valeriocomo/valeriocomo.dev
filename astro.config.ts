import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import UnoCSS from 'unocss/astro';

const BASE_URL = 'https://valeriocomo.dev'

const isProduction = process.env.NODE_ENV === 'production';

const site = isProduction ? BASE_URL : 'http://localhost:3000/'
const base = ''

export default defineConfig({
  site,
  base,
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