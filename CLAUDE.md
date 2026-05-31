# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A static CS/AI learning roadmap site built with Vite + React + TypeScript + Tailwind v4 + MDX. Courses are authored as MDX files with YAML frontmatter, lazily loaded at runtime, and searchable via MiniSearch. Progress is persisted in localStorage via Zustand. NotebookLM summaries can be synced into MDX files at build time.

## Commands

```bash
npm run dev          # Vite dev server (port 5173)
npm run build        # tsc + vite build (runs convert + sync as prebuild)
npm run lint         # ESLint
npm run convert      # Obsidian vault → MDX conversion
npm run sync         # Sync NotebookLM content into MDX files (requires nlm CLI)
npx tsc --noEmit     # Type-check only
```

Deploy target: Netlify (`netlify.toml` with SPA redirect).

## Architecture

### Content Pipeline

MDX files in `src/content/` are the source of truth. Each has YAML frontmatter with required fields: `title`, `topic`, `difficulty`, `timeEstimate`, `tags`, and optional `studyTool`, `notebooklmModuleId`, `localSourceZip`.

`src/content/index.ts` builds the content registry at import time:
- `import.meta.glob('./**/*.mdx')` provides lazy component loaders
- `import 'virtual:mdx-raw'` provides raw file text via a custom Vite plugin (`mdxRawPlugin` in `vite.config.ts`) that reads `.mdx` files with `fs.readFileSync`, bypassing the MDX transform pipeline. **Do not use `import.meta.glob` with `?raw` on `.mdx` files** — the MDX rollup plugin intercepts those and returns compiled component source instead of raw text.
- A custom `parseFrontmatter()` handles YAML extraction without importing gray-matter at runtime (gray-matter is only used in build scripts)

### MDX Processing (vite.config.ts)

Remark plugins run in order: `remarkFrontmatter` → `remarkMdxFrontmatter` (exports as `frontmatter`) → `remarkGfm` → custom `remarkWikiLinks` (converts `[[Page Name]]` to `/roadmap/slug` links).

MDX files can use `{/* <!-- comment --> */}` syntax for block markers (HTML comments alone break MDX parsing).

### State

- `useProgress` (Zustand + persist middleware): tracks completed items in localStorage key `roadmap-progress`. Supports export/import/reset of snapshots.
- `NotebooklmContext`: React context providing a map of `moduleId → lastSynced` timestamps, built from raw MDX content at init.

### NotebookLM Sync (`scripts/sync-notebooklm.mjs`)

Runs as `prebuild`. Scans MDX files for `notebooklmModuleId` in frontmatter, calls `nlm notebook query` CLI (or an MCP proxy if `NOTEBOOKLM_MCP_ENDPOINT` is set), and upserts content between `{/* <!-- notebooklm-sync-start --> */}` and `{/* <!-- notebooklm-sync-end --> */}` markers. Fails gracefully if `nlm` is not installed.

Env overrides: `NOTEBOOKLM_CLI_TEMPLATE`, `NOTEBOOKLM_DEFAULT_QUESTION`, `NOTEBOOKLM_MCP_ENDPOINT`.

### Obsidian Converter (`scripts/obsidian-to-mdx.js`)

Converts `.md` files from `~/Documents/Gio's Brain OwO/20-Study/` into MDX in `src/content/`. Maps vault subdirectories to topics (`math/`, `systems/`, `ai-ml/`, `mlops/`, `programming/`). Transforms Obsidian syntax: `==highlights==` → `<mark>`, callouts, footnote references. Never overwrites MDX files that contain manual components (`<InteractiveCodeBlock>`, `<NotebookLMModuleCard>`, sync markers) — only updates their frontmatter.

### Curriculum Definition (`src/data/curriculum.ts`)

Master roadmap with topics, course ordering, prerequisites (`requires` field), difficulty levels, and resource links. Used to define the learning dependency graph. Not yet wired into the UI tree — currently the roadmap tree is built dynamically from content frontmatter.

### Dark Mode

`useDarkMode` hook reads `prefers-color-scheme` as default, persists to `localStorage` key `roadmap-dark-mode`, toggles `html.dark` class. Tailwind dark variant classes (`dark:*`) are used throughout components.

### Routing

- `/` — Home with search, filters (topic/difficulty/time/studyTool), roadmap tree, progress backup
- `/roadmap/:slug` — Lazy-loaded MDX content page
- `*` — 404 fallback

## Adding a New Course

1. Create `src/content/my-course.mdx` with the required frontmatter fields
2. It auto-registers via `import.meta.glob` — no manual imports needed
3. Use `<NotebookLMModuleCard>` and `<InteractiveCodeBlock>` components as needed
4. Cross-link with `[[other-course-slug]]` wiki-link syntax

## Code Style

Prettier: single quotes, no semicolons, 100 char width. Tailwind v4 via `@tailwindcss/postcss` plugin (not the older `tailwindcss` PostCSS plugin).

## Learner Goal

**Target**: Native-level English — a well-educated, intelligent, confident speaker. C1-C2 fluency, precise vocabulary, natural rhythm, zero L1 interference. The standard is: could this pass as a highly educated native speaker in a professional or intellectual setting?

This goal applies across tracks: English pronunciation/writing targets native educated speaker. Mandarin targets conversational HSK progression. CS/AI/Math targets practitioner-level understanding, not tourist knowledge.
