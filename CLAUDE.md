# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server at localhost:4321
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

**Content:** Blog posts and talks are managed via Astro's content collections in `src/content/`. Blog frontmatter schema: `title`, `pubDate`, `author`, `tags`, `imgUrl`, `description`.

**Layouts:** Two layouts in `src/layouts/`:
- `Default.astro` — standard page layout (nav + footer)
- `BlogPost.astro` — blog layout with sidebar, content area, and recent posts

**Components** are organized by feature domain: `blog/`, `home/`, `talks/`, `layout/`, `generic/`, `errors/`.

**OG Images:** Dynamically generated at `/v1/generate/og/[slug].png` using Satori + `@resvg/resvg-js`. Blog post assets live in `src/assets/blog/<date-slug>/`.

**Styling:** UnoCSS with `presetWind` (Tailwind), `presetIcons` (Iconify — logos + uil collections), and `presetTypography`. Global styles in `src/styles/global.css`.

**Path aliases:** `@components/*`, `@layouts/*`, `@pages/*` (configured in `tsconfig.json`).

**Analytics:** Google Analytics loaded via Partytown (configured in `astro.config.ts`).

**RSS:** Auto-generated at `/feed.xml` from blog content collection.
