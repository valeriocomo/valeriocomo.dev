import { readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import type { AstroIntegration } from 'astro';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import partytown from '@astrojs/partytown';

// onnxruntime-web references its .wasm via `new URL(..., import.meta.url)`, so Vite
// copies it into dist/_astro. At runtime @huggingface/transformers points
// `env.backends.onnx.wasm.wasmPaths` at jsDelivr, so the local copy is never loaded,
// and it exceeds the 25 MiB per-file limit of Cloudflare Pages (preview deploys).
const removeOnnxRuntimeWasm = (): AstroIntegration => ({
  name: 'remove-onnxruntime-wasm',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const assetsDir = fileURLToPath(new URL('./_astro/', dir));
      const files = (await readdir(assetsDir)).filter(
        (file) => file.startsWith('ort-wasm-') && file.endsWith('.wasm'),
      );
      await Promise.all(files.map((file) => rm(`${assetsDir}${file}`)));
      for (const file of files) logger.info(`Removed _astro/${file} (served from CDN)`);
    },
  },
});

const BASE_URL = 'https://valeriocomo.dev'

const isProduction = process.env.NODE_ENV === 'production';

const site = isProduction ? BASE_URL : 'http://localhost:4321/'
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
    partytown({ config: { forward: ["dataLayer.push"] } }),
    removeOnnxRuntimeWasm(),
  ],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['@resvg/resvg-js', '@huggingface/transformers'],
    },
  },
})