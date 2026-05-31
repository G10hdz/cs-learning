# Unified Learning Platform — Build Roadmap

Started: 2026-05-02 | Updated: 2026-05-04
Goal: Transform cs-learning into a 5-track, gamified, offline-first learning OS with premium UI.

---

## Current State (all weeks complete)

- [x] Vite + React 19 + TS + Tailwind v4 + MDX pipeline working
- [x] 25 MDX modules across math, systems, ai, mandarin, english directories
- [x] 12 sub-modules enriched with best-of-web resource links (course, book, repo URLs)
- [x] ResourceTable dual schema: legacy + enriched columns
- [x] Components: ResourceTable, CheckpointCallout, DeliverableList (with localStorage progress)
- [x] MiniSearch full-text search, dark mode, progress backup JSON
- [x] `npm run seed` generates placeholder MDX for all phases
- [x] `CONTEXT.md` — fast-load project context for Claude sessions
- [x] `src/tracks/types.ts` — Track, TrackPhase, TrackModule foundation types
- [x] 5 track files: cs-ai.ts, aws-mla.ts, english.ts, mandarin.ts, projects.ts, index.ts
- [x] `src/lib/useUnifiedProgress.ts`, `useGamification.ts`, `achievements.ts`, `useTracker.ts`
- [x] All UI components: TrackSelector, TrackPhaseView, GamificationHeader, StreakBadge, XPProgressBar, DailyQuests, BadgeShelf, RelatedModules, LearningMap, LearningTracker
- [x] Confetti on level-up (canvas-confetti, lazy-loaded)
- [x] `prefers-reduced-motion` respected throughout (CSS + JS)
- [x] Weekly summary export
- [x] ARIA labels on XP/streak live regions
- [x] AuDHD-friendly: Focus mode, progressive disclosure, TTS, touch targets 44px+
- [x] Quick-save to Tracker from content pages
- [x] Quest completion confetti
- [x] Skip-to-content link + focus-visible rings
- [x] `CONTEXT.md` updated with final architecture

---

## Week 7+ — Deploy + Sync (pending)

**Goal:** Get app on tablet + cross-device progress sync.

- [x] LearningTracker component + useTracker store
- [x] Tracker tab in TrackSelector
- [ ] Deploy to Cloudflare Pages or Firebase Hosting
- [ ] npm run sync — populate NLM blocks
- [ ] Firebase Firestore sync (cross-device progress)
- [ ] Fix Vite 8 production build hang (Rolldown issue)
- [ ] Mobile polish pass on tablet


