import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import UnoCSS from 'unocss/astro';

const GH_URL = 'https://valeriocomo.github.io'
const BASE_URL = 'valeriocomo.dev'

const isProduction = process.env.NODE_ENV === 'production';

const site = isProduction ? GH_URL : 'https://localhost:3000/'
const base = isProduction ? BASE_URL : ''

export default defineConfig({
  site: isProduction ? 'https://valeriocomo.github.io' : 'https://localhost:3000/',
  base: isProduction ? 'valeriocomo.dev' : '',
  build: {
    assetsPrefix: {
      'css': `${site}/${base}`,
      'fallback': `${site}/${base}`
    }
  },
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