# AI Agent Instructions for cs-learning

## Design Context

### Users
Self-taught developers with infra/cloud background (ex-AWS Cloud Support, SAA-C03 certified), studying mathematics at UNAM. Works full-time with 5-hour commutes Tue-Thu (5:45am-8:30/9pm), home office other days. Studies during early mornings and commute time. Needs quick, engaging study sessions that fit around a demanding schedule.

### Brand Personality
Approachable, Helpful, Clear — friendly without being childish, technically credible without being intimidating. Think "Duolingo for engineers who work at AWS".

### Aesthetic Direction
Playful + Engaging — gamified learning with celebrations, progress tracking, and delights. Not corporate, not academic-dreary. Should feel like a modern learning tool (Duolingo, Brilliant, Khan Academy) but tailored for engineers.

References: Duolingo's streak mechanics, Brilliant's clean math visualizations, Notion's helpful UI patterns.

Anti-references: Corporate learning management systems (LMS), academic portals, dull enterprise dashboards.

Theme: Both light and dark mode (already implemented). Colors should feel energetic but not chaotic — the track colors (indigo, amber, blue, red, emerald) provide a good foundation.

### Design Principles
1. **Mobile-first** — 5-hour commute means mobile study sessions; components must work at 375px width
2. **Offline-first** — spotty commute connectivity; localStorage progress, no backend dependency
3. **Micro-learning friendly** — quick modules for 20-30 min study bursts during commute
4. **Progress visibility** — busy schedule means needing to see "what did I accomplish?" at a glance
5. **Gamified but grounded** — celebrations (confetti!) but tied to real, shippable work (Ergane, FairHire, Metis)
6. **Zero friction** — every click counts when you have limited study time; clear navigation, obvious CTAs
7. **Approachable technicality** — Spanish content with English code; friendly to self-taught learners, not elitist

## Project Context

### Stack
- Vite + React 19 + TypeScript + Tailwind v4 + MDX
- Deploy target: Netlify (SPA redirect)
- State: Zustand + localStorage (offline-first, no backend)
- Content: MDX files in Spanish, code/comments in English

### Code Style
- Prettier: single quotes, no semicolons, 100 char width
- Tailwind v4 via `@tailwindcss/postcss` plugin (not the older `tailwindcss` PostCSS plugin)
- TypeScript strict mode

### Architecture Notes
- MDX files are source of truth, lazily loaded at runtime
- `virtual:mdx-raw` for raw file text (NOT `import.meta.glob` with `?raw` on .mdx files)
- Wiki links: `[[slug]]` → `/roadmap/slug`
- MDX comments: `{/* <!-- comment --> */}` (not bare HTML comments)

### Key Constraints
- All state client-side (localStorage). No backend. Graceful degradation if CLI/MCP fails.
- MDX content stays in Spanish. Code/comments in English.
- No external analytics. No social sharing unless explicitly added.
- Every deliverable must tie to Ergane, FairHire, Metis, or a shippable micro-project.
