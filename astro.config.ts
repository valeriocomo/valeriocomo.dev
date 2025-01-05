import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import UnoCSS from 'unocss/astro';

import partytown from '@astrojs/partytown';

const BASE_URL = 'https://valeriocomo.dev'

const isProduction = process.env.NODE_ENV === 'production';

const site = isProduction ? BASE_URL : 'http://localhost:3000/'
const base = ''
//https://daniel.es/blog/the-ultimate-astro-google-analytics-guide/
export default defineConfig({
  site,
  base,
  server: {
    host: "127.0.0.1",
    port: 4321
  },
  trailingSlash: 'ignore',
  integrations: [
    sitemap(),
    UnoCSS({ injectReset: true }),
    partytown({ config: { forward: ["dataLayer.push"] } })
  ],
  vite: {
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
  },
})