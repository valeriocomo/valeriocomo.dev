import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import UnoCSS from 'unocss/astro';

const GH_URL = 'https://valeriocomo.github.io'
const BASE_URL = 'valeriocomo.dev'

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  // site: 'https://valeriocomo.github.io',
  // base: 'valeriocomo.dev',
  site: isProduction  ? 'https://valeriocomo.github.io' : 'https://localhost:3000/',
  base: isProduction ?  'valeriocomo.dev' : '',
  build: {
    assetsPrefix: {
      'css': `${GH_URL}/${BASE_URL}`,
      'fallback': `${GH_URL}/${BASE_URL}`
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