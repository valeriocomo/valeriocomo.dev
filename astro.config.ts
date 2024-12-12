import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import UnoCSS from 'unocss/astro';

// export default defineConfig({
//   // used to generate images
//   site:
//     process.env.VERCEL_ENV === 'production'
//       ? 'https://brutal.elian.codes/'
//       : process.env.VERCEL_URL
//       ? `https://${process.env.VERCEL_URL}/`
//       : 'https://localhost:3000/',
//   trailingSlash: 'ignore',
//   integrations: [sitemap(), UnoCSS({ injectReset: true })],
//   vite: {
//     optimizeDeps: {
//       exclude: ['@resvg/resvg-js'],
//     },
//   },
// });

const isProduction = process.env.ENVIRONMENT === 'production';

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