# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server at localhost:4321 (binds to 127.0.0.1)
pnpm build      # Build for production
pnpm preview    # Preview production build
```

```bash
pnpm lint       # ESLint on src/ (same as `pnpm eslint src/`)
pnpm prettier --write src/
```

No test scripts are configured in package.json — there is no test runner in this repo.

ESLint uses flat config (`eslint.config.ts`) with `typescript-eslint`, `eslint-plugin-astro` (covers `.astro` files, including its bundled `flat/jsx-a11y-recommended` a11y rules — this requires `eslint-plugin-jsx-a11y` to be installed even though it isn't imported directly in the config), plus `@eslint/markdown` and `@eslint/css` for linting `.md` and `.css` files. CSS is parsed with `tailwind-csstree` (`customSyntax: tailwind4`) so Tailwind at-rules (`@theme`, `@utility`, `@plugin`, `@custom-variant`) are understood; it does not accept `mask*` properties inside `@utility`, which is why icons are plain classes (see Styling). CI (`.github/workflows/ci.yml`) runs `pnpm lint` then `pnpm build` on every PR. A separate nightly workflow (`.github/workflows/nightly.yml`) runs `@astrojs/upgrade` and opens a PR with any Astro updates.

## Architecture

Personal blog and portfolio site built with **Astro 6** and **Tailwind CSS v4**.

**Content:** Blog posts and talks are managed via Astro's content collections in `src/content/`. Schema definitions live in `src/content.config.ts` (root-level, not `src/content/config.ts`).

- Blog (`src/content/blog/`) — filename convention `YYYY-MM-DD-slug.md`. Frontmatter: `title`, `pubDate` (e.g. `2025/02/17 9:20`), `author`, `tags` (array), `imgUrl` (relative path to `src/assets/blog/<date-slug>/`), `description`, `draft` (optional boolean, defaults `false`).
- Talks (`src/content/talks/`) — filename convention `YY-MM-DD-event-name.md`. Frontmatter: `title`, `abstract`, `date`, `link`, `name` (event name), `img` (relative path to `src/assets/talks/`).

Assets for blog posts live in `src/assets/blog/<date-slug>/`; talk assets live in `src/assets/talks/`.

**Layouts:** Two layouts in `src/layouts/`:
- `Default.astro` — standard page layout (nav + footer)
- `BlogPost.astro` — blog layout with sidebar, content area, and recent posts

**Components** are organized by feature domain: `blog/`, `home/`, `talks/`, `layout/`, `generic/`, `errors/`. UI primitives (`Button`, `Card`, `Pill`) come from `@eliancodes/brutal-ui`.

**OG Images:** Generated at build time via `getStaticPaths()`. Two endpoints: `/v1/generate/og/[slug].png` (blog posts — title + description + portrait) and `/v1/generate/og/default.png` (homepage). Both use Satori (HTML→SVG) + `@resvg/resvg-js` (SVG→PNG) at 1200×630px. `@resvg/resvg-js` and `@huggingface/transformers` are excluded from Vite pre-bundling in `astro.config.ts` due to native/WASM modules.

**Styling:** Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config` file — all configuration is CSS-first in `src/styles/global.css`, imported by `Default.astro`), plus `@tailwindcss/typography` for `prose`. The site was migrated from UnoCSS, so `global.css` contains a compatibility layer that keeps the old class names working with UnoCSS's exact values:
- Bare color names (`bg-pink`, `text-green`, `hover:bg-red`, `text-slate`, `text-dark`, …) and the gray/blue shades in use are defined in `@theme` with the Tailwind v3 rgb palette. Prefer these existing names; new shades not listed there will use Tailwind v4's oklch palette.
- UnoCSS-only utilities (`w-prose`, `transition-300`, `transition-color`, `underline-white`) are defined with `@utility`.
- `@custom-variant hover (&:hover)` keeps hover styles on touch devices, as UnoCSS did.
- Icons (`i-uil-*`, `i-logos-*`) are hand-written CSS classes in `@layer components` (URL-encoded SVG as a CSS mask, `1em` default size). They sit in `components` so size utilities like `w-6 h-6` override them. To add an icon, copy its SVG (e.g. from icones.js.org) into a new class following the same pattern. There is no icon safelist: Tailwind scans `.ts` files too, so class names in `src/constants.ts` are picked up.

**Fonts:** Self-hosted in `public/fonts/` (Outfit, Poppins, Righteous, Sanchez, DM Serif Text). Loaded via `LocalFont.astro` using `astro-font`; apply with CSS class selectors (`.outfit`, `.poppins`, etc.).

**Path aliases:** `@components/*`, `@layouts/*`, `@pages/*` (configured in `tsconfig.json`).

**Analytics:** Google Analytics loaded via Partytown (configured in `astro.config.ts`).

**Pages routing:** `src/pages/index.astro` (home), `src/pages/talks.astro`, `src/pages/blog/index.astro` (listing), `src/pages/blog/[slug].astro` (post), `src/pages/blog/tags/` (tag filtering), `src/pages/v1/generate/og/` (OG image endpoints).

**RSS & Sitemap:** Auto-generated at `/feed.xml` (RSS) and `/sitemap-index.xml` (sitemap) from content collections.

**AI Summary:** `BlogAISummary` component has two paths: (1) Chrome built-in `window.Summarizer` API (preferred); (2) fallback `src/workers/webnn-summarizer.worker.ts` using `@huggingface/transformers` with the `Xenova/distilbart-cnn-6-6` model, auto-selecting WebNN → WebGPU → WASM. Text is chunked at 9280 characters. `src/env.d.ts` includes `@types/dom-chromium-ai` for typed access to the Chrome AI APIs.

**RSS feed:** Draft posts are NOT filtered in `src/pages/feed.xml.js` — drafts appear in the feed if `draft: true` is set.

**Site constants:** URLs, social links, and external references are centralized in `src/constants.ts`.
