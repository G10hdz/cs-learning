# Design System: CS-Learning Platform

## 1. Visual Theme & Atmosphere

A vibrant, gallery-airy learning interface with confident asymmetric layouts and fluid spring-physics motion. The atmosphere is energetic yet focused — like a premium coding bootcamp meets Duolingo. Designed for 5-hour commute sessions on mobile (375px) where every pixel must earn its place.

**Density:** 6 (Daily App Balanced) — enough information density for serious study, but breathing room for delights.
**Variance:** 8 (Offset Asymmetric) — avoids template symmetry, creates visual interest through intentional off-center layouts.
**Motion:** 7 (Fluid CSS + Spring Physics) — every interactive element has weight, tactile feedback, and perpetual micro-animations.

## 2. Color Palette & Roles

- **Canvas Base** (#F8FAFC) — Primary background surface, Zinc-50 warmth
- **Pure Surface** (#FFFFFF) — Card and container fill for content modules
- **Charcoal Ink** (#18181B) — Primary text, Zinc-950 depth for maximum readability
- **Muted Steel** (#71717A) — Secondary text, descriptions, metadata
- **Whisper Border** (rgba(113,113,122,0.2)) — Structural dividers, subtle 1px lines
- **Energy Amber** (#F59E0B) — Single accent for CTAs, active states, streak indicators (saturation 76%, under 80% threshold)
- **Success Emerald** (#10B981) — Completion states, positive reinforcement, confetti moments
- **Alert Rose** (#F43F5E) — Error states, destructive actions (freeze burns, reset confirmations)
- **Banned:** No purple/neon glows, no pure black (#000000), no oversaturated accents (saturation >80%)

## 3. Typography Rules

- **Display/Headlines:** Geist — Track-tight (tight tracking), weight-driven hierarchy. Large headlines use `clamp(1.5rem, 5vw, 2.5rem)` for fluid scaling. No massive size jumps, hierarchy through weight (700-900) and color (Charcoal Ink vs Muted Steel).
- **Body:** Satoshi — Relaxed leading (1.6), max 65ch width for comfortable reading during commute sessions. Neutral secondary color for descriptions.
- **Mono:** JetBrains Mono — For code snippets, metadata, timestamps, high-density numbers. Used exclusively in dashboard contexts.
- **Banned:** Inter (generic AI tell), system-ui fallback abuse. No generic serif fonts (Times New Roman, Georgia). If serif needed for editorial content, use only Fraunces or Editorial New.
- **Dashboard Constraint:** Sans-Serif pairings exclusively (Geist + JetBrains Mono) for all learning interfaces.

## 4. Component Stylings

**Buttons:**
- Flat or subtle inset shadows only, absolutely NO outer glows
- Tactile feedback: `active:translate-y-[1px]` for push-down feel
- Primary: Energy Amber fill, Charcoal Ink text
- Secondary: Ghost with Whisper Border, hover:bg-amber/10
- Minimum 44px touch target for mobile commute sessions
- No custom mouse cursors, ever

**Cards (TrackPhaseView modules):**
- Generously rounded corners (1.5rem/border-radius-xl)
- Diffused whisper shadow, not heavy drop shadows
- Used ONLY when elevation communicates hierarchy (different track phases)
- Track-specific subtle top-border tint: AWS (amber-200), CS/AI (indigo-200), English (blue-200), Mandarin (red-200), Projects (emerald-200)
- High-density views: Replace cards with border-top dividers or negative space
- NO emoji icons (classic AI tell), use track-specific geometric SVG icons instead

**Inputs/Forms:**
- Label above input (never floating labels)
- Helper text optional, error text below in Alert Rose
- Focus ring in Energy Amber, 2px offset
- Standard gap-3 spacing between form elements

**Loaders:**
- Skeletal shimmer matching exact layout dimensions
- No circular spinners (generic AI tell)
- Shimmer direction: left-to-right, 1.5s infinite loop
- Color: Whisper Border base, Muted Steel shimmer

**Empty States:**
- Composed illustrations indicating how to populate (not just "No data" text)
- For empty track modules: "Start your first module →" with directional arrow
- Use simple SVG illustrations, no broken Unsplash links

**Progress Indicators:**
- XP Bar: Height 8px (h-2), rounded-full, Energy Amber fill on Charcoal Ink track
- Streak Badge: Floating animation (translate-y-[-2px] loop), perpetual micro-motion
- Level Badge: Geist font, weight 700, "Level X · Label" format
- Confetti celebration: canvas-confetti, lazy-loaded, particleCount:100, spread:70

## 5. Layout Principles

- **Grid-first responsive architecture** — CSS Grid over Flexbox math, never use `calc()` percentage hacks
- **Asymmetric splits for Hero sections** — No centered layouts (variance 8+ rule)
- **Strict single-column collapse below 768px** — All multi-column layouts collapse for commute mobile sessions
- **Max-width containment** at 1400px centered
- **Full-height sections** use `min-h-[100dvh]` — never `h-screen` (prevents iOS Safari catastrophic jump)
- **No overlapping elements** — Every element occupies its own clear spatial zone
- **Generous internal padding** — `p-6` (1.5rem) standard, `p-4` (1rem) compact
- **Banned:** The generic "3 equal cards horizontally" feature row — use 2-column Zig-Zag, asymmetric grid, or horizontal scroll with snap-x snap-mandatory

## 6. Motion & Interaction

**Spring Physics default:** `stiffness:100, damping:20` — premium, weighty feel. No linear easing anywhere.

**Perpetual Micro-Interactions (make it addictive):**
- Streak flame icon: `animate-bounce` infinite loop, 2s duration
- XP bar: `transition-all duration-500 ease-out` on progress updates
- Continue Studying button: `hover:scale-[1.02] active:scale-[0.98]` with spring
- TrackSelector active tab: `shadow-sm` with Energy Amber glow (inner only, no outer glow)
- Badge icons (achievements): `hover:rotate-[5deg] transition-transform`

**Staggered Orchestration:**
- Never mount lists instantly — use cascade delays: `animation-delay: [0ms, 100ms, 200ms, 300ms]`
- TrackPhaseView modules: Reveal in staggered fashion when track tab activates
- DailyQuests: Slide-in from right, 150ms stagger

**Performance:**
- Animate exclusively via `transform` and `opacity`
- Never animate `top`, `left`, `width`, `height`
- GPU-accelerated transforms only: `translateY`, `scale`, `rotate`
- Confetti: Lazy-loaded via dynamic import, respects `prefers-reduced-motion`

## 7. Responsive Rules (Mobile-First for Commute)

**Mobile-First Collapse (< 768px):**
- All multi-column layouts → single column, no exceptions
- TrackSelector: Horizontal scroll with `snap-x snap-mandatory`, hide scrollbar
- LearningMap: Simplified mobile view or touch-zoom (SVG viewBox manipulation)
- GamificationHeader: Stack vertically with `gap-4`, full-width XP bar

**No Horizontal Scroll:**
- Horizontal overflow on mobile is a critical failure
- TrackPhaseView modules: Single column, full-width cards
- Table content: Horizontal scroll ONLY within table container, not page-level

**Typography Scaling:**
- Headlines scale via `clamp(1.25rem, 4vw, 2rem)`
- Body text minimum `1rem`/`16px` for commute readability
- Module titles: `text-lg` on mobile, `text-xl` on desktop

**Touch Targets:**
- All interactive elements minimum `44px` tap target (DeliverableList checkboxes now 44px)
- Button padding: `px-4 py-3` minimum on mobile
- Checkbox/radio: Minimum 44x44px touch area

**Image Behavior:**
- Inline typography images (if any) stack below headline on mobile
- Track emojis (currently used) → replace with SVG icons for mobile clarity at 375px

**Navigation:**
- Desktop: Horizontal tab bar (TrackSelector)
- Mobile: Horizontal scroll with snap, or collapse to select dropdown
- "Continue Studying" button: Fixed bottom on mobile for thumb access during commute

**Spacing:**
- Vertical section gaps reduce proportionally: `clamp(2rem, 5vw, 4rem)`
- Component internal gaps: `gap-3` (0.75rem) standard

## 8. Anti-Patterns (STRICTLY BANNED)

**Visual Tells (AI Generation Fingerprints):**
- ❌ No emojis anywhere (❄️🔥💯⚔️🤖☁️🀄🇬🇧🚀) — replace with SVG icons
- ❌ No `Inter` font — use Geist or Satoshi exclusively
- ❌ No pure black (`#000000`) — use Charcoal Ink (#18181B)
- ❌ No neon/purple outer glows or gradients
- ❌ No oversaturated accents (saturation >80%)
- ❌ No excessive gradient text on large headers
- ❌ No custom mouse cursors
- ❌ No overlapping elements — clean spatial separation always
- ❌ No "3-column equal card layouts" — use asymmetric grids
- ❌ No generic names ("John Doe", "Acme", "Nexus")
- ❌ No fake round numbers (`99.99%`, `50%`) — use real data
- ❌ No AI copywriting clichés ("Elevate", "Seamless", "Unleash", "Next-Gen")
- ❌ No filler UI text: "Scroll to explore", "Swipe down", scroll arrows, bouncing chevrons
- ❌ No broken Unsplash links — use `picsum.photos` or SVG avatars
- ❌ No centered Hero sections (variance 8+ requires asymmetric splits)

**Accessibility (Non-Negotiable):**
- Respect `prefers-reduced-motion: reduce` — disable all animations, confetti, springs
- ARIA live regions on XP/streak updates (already implemented in GamificationHeader)
- Color contrast ratio 4.5:1 minimum (Charcoal Ink on Pure Surface passes)
- Keyboard navigation support for TrackSelector and module cards
- Focus-visible rings in Energy Amber

## 9. Making It Addictive (User Retention)

**Variable Reward Schedule (like Duolingo):**
- Confetti on level-up (unpredictable timing based on study pace)
- Random "streak milestone" celebrations at 7, 14, 30 days
- Achievement unlocks with badge reveal animations
- Daily quests reset at midnight with slide-in animation

**Progress Visibility:**
- GamificationHeader always visible (sticky on mobile)
- "Continue Studying" button shows exact module title + estimated time
- Weekly summary export: "Esta semana: X módulos, Y XP, racha Z días"
- Freeze indicator prominent when streak is at risk (commute schedule!)

**Friction-Free Commute Study:**
- Last visited module tracking → one-tap resume
- Offline-first: localStorage progress, no backend dependency
- Micro-learning: 20-30 min module chunks fit commute windows
- Touch targets minimum 44px for train/bus study sessions

**Emotional Peaks:**
- Level-up: Confetti + "Level X · Label" reveal with spring animation
- Achievement unlock: Badge shelf pulse animation, trophy icon flash
- Streak at 7 days: "Racha de 7 días" celebration with flame emoji replacement (SVG flame icon)
- Project completion: Connection to real work (Ergane, FairHire, Metis) gives tangible meaning

## 10. Implementation Priority (P1 → P2)

1. **Replace all emojis** with track-specific SVG icons (AWS geometric, CS/AI organic, etc.)
2. **Switch fonts** from system-ui to Geist (headlines) + Satoshi (body) + JetBrains Mono (mono)
3. **TrackPhaseView cards** need track-colored top borders (amber/indigo/blue/red/emerald)
4. **Continue Studying** button fixed bottom on mobile for thumb access
5. **Staggered reveals** on TrackPhaseView module lists
6. **Perpetual motion** on streak badge (floating animation)
7. **Confetti lazy-load** respects `prefers-reduced-motion`
8. **LearningMap** simplify for 375px mobile (touch-zoom or minimal view)
