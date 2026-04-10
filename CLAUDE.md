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

**Content:** Blog posts and talks are managed via Astro's content collections in `src/content/`.

- Blog (`src/content/blog/`) — filename convention `YYYY-MM-DD-slug.md`. Frontmatter: `title`, `pubDate` (e.g. `2025/02/17 9:20`), `author`, `tags` (array), `imgUrl` (relative path to `src/assets/blog/<date-slug>/`), `description`, `draft` (optional boolean, defaults `false`).
- Talks (`src/content/talks/`) — filename convention `YY-MM-DD-event-name.md`. Frontmatter: `title`, `abstract`, `date`, `link`, `name` (event name), `img` (relative path to `src/assets/talks/`).

Assets for blog posts live in `src/assets/blog/<date-slug>/`; talk assets live in `src/assets/talks/`.

**Layouts:** Two layouts in `src/layouts/`:
- `Default.astro` — standard page layout (nav + footer)
- `BlogPost.astro` — blog layout with sidebar, content area, and recent posts

**Components** are organized by feature domain: `blog/`, `home/`, `talks/`, `layout/`, `generic/`, `errors/`.

**OG Images:** Dynamically generated at `/v1/generate/og/[slug].png` using Satori + `@resvg/resvg-js`. Blog post assets live in `src/assets/blog/<date-slug>/`.

**Styling:** UnoCSS with `presetWind` (Tailwind), `presetIcons` (Iconify — logos + uil collections), and `presetTypography`. Global styles in `src/styles/global.css`.

**Path aliases:** `@components/*`, `@layouts/*`, `@pages/*` (configured in `tsconfig.json`).

**Analytics:** Google Analytics loaded via Partytown (configured in `astro.config.ts`).

**RSS:** Auto-generated at `/feed.xml` from blog content collection.

**AI Summary:** Blog posts include a `BlogAISummary` component that uses the Chrome built-in Summarizer API (`window.Summarizer`) to generate TL;DRs client-side. It gracefully degrades to a hint for non-Chrome browsers.

**Site constants:** URLs, social links, and external references are centralized in `src/constants.ts`.
