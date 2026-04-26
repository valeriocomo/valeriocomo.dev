# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server at localhost:4321 (binds to 127.0.0.1)
pnpm build      # Build for production
pnpm preview    # Preview production build
```

No test or lint scripts are configured in package.json. ESLint and Prettier are installed and can be run directly:
```bash
pnpm eslint src/
pnpm prettier --write src/
```

## Architecture

Personal blog and portfolio site built with **Astro 5** and **UnoCSS** (Tailwind-compatible).

**Content:** Blog posts and talks are managed via Astro's content collections in `src/content/`. Schema definitions live in `src/content.config.ts` (Astro 5 root-level location, not `src/content/config.ts`).

- Blog (`src/content/blog/`) — filename convention `YYYY-MM-DD-slug.md`. Frontmatter: `title`, `pubDate` (e.g. `2025/02/17 9:20`), `author`, `tags` (array), `imgUrl` (relative path to `src/assets/blog/<date-slug>/`), `description`, `draft` (optional boolean, defaults `false`).
- Talks (`src/content/talks/`) — filename convention `YY-MM-DD-event-name.md`. Frontmatter: `title`, `abstract`, `date`, `link`, `name` (event name), `img` (relative path to `src/assets/talks/`).

Assets for blog posts live in `src/assets/blog/<date-slug>/`; talk assets live in `src/assets/talks/`.

**Layouts:** Two layouts in `src/layouts/`:
- `Default.astro` — standard page layout (nav + footer)
- `BlogPost.astro` — blog layout with sidebar, content area, and recent posts

**Components** are organized by feature domain: `blog/`, `home/`, `talks/`, `layout/`, `generic/`, `errors/`. UI primitives (`Button`, `Card`, `Pill`) come from `@eliancodes/brutal-ui`.

**OG Images:** Generated at build time via `getStaticPaths()`. Two endpoints: `/v1/generate/og/[slug].png` (blog posts — title + description + portrait) and `/v1/generate/og/default.png` (homepage). Both use Satori (HTML→SVG) + `@resvg/resvg-js` (SVG→PNG) at 1200×630px. `@resvg/resvg-js` and `@huggingface/transformers` are excluded from Vite pre-bundling in `astro.config.ts` due to native/WASM modules.

**Styling:** UnoCSS with `presetWind` (Tailwind), `presetIcons` (Iconify — logos + uil collections), and `presetTypography`. Global styles in `src/styles/global.css`. Icon classes used dynamically (e.g. from the `SOCIALS` array) must be added to the `safelist` in `uno.config.ts` — UnoCSS only generates CSS for statically-scanned classes.

**Fonts:** Self-hosted in `public/fonts/` (Outfit, Poppins, Righteous, Sanchez, DM Serif Text). Loaded via `LocalFont.astro` using `astro-font`; apply with CSS class selectors (`.outfit`, `.poppins`, etc.).

**Path aliases:** `@components/*`, `@layouts/*`, `@pages/*` (configured in `tsconfig.json`).

**Analytics:** Google Analytics loaded via Partytown (configured in `astro.config.ts`).

**Pages routing:** `src/pages/index.astro` (home), `src/pages/talks.astro`, `src/pages/blog/index.astro` (listing), `src/pages/blog/[...slug].astro` (post), `src/pages/blog/tags/` (tag filtering), `src/pages/v1/generate/og/` (OG image endpoints).

**RSS & Sitemap:** Auto-generated at `/feed.xml` (RSS) and `/sitemap-index.xml` (sitemap) from content collections.

**AI Summary:** `BlogAISummary` component has two paths: (1) Chrome built-in `window.Summarizer` API (preferred); (2) fallback `src/workers/webnn-summarizer.worker.ts` using `@huggingface/transformers` with the `Xenova/distilbart-cnn-6-6` model, auto-selecting WebNN → WebGPU → WASM. Text is chunked at 9280 characters. `src/env.d.ts` includes `@types/dom-chromium-ai` for typed access to the Chrome AI APIs.

**RSS feed:** Draft posts are NOT filtered in `src/pages/feed.xml.js` — drafts appear in the feed if `draft: true` is set.

**Site constants:** URLs, social links, and external references are centralized in `src/constants.ts`.
