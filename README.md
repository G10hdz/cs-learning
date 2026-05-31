# CS Learning — Self-Study Roadmap

Offline-first CS/AI self-study platform with gamification, 5 learning tracks, and AuDHD-friendly design. Built with Vite + React 19 + TypeScript + Tailwind v4 + MDX.

## 🚀 Features

- **5 Learning Tracks**: CS/AI, AWS MLA, English, Mandarin, Projects + Learning Tracker
- **Gamification**: XP system, level progression, streak tracking, achievements, confetti on level-up, daily quests
- **Offline-First**: All progress stored in localStorage, no backend needed
- **Mobile-Optimized**: Designed for 375px+ (commute study sessions), 44px touch targets
- **Dark Mode**: System preference detection with manual toggle, zero hardcoded colors
- **MDX Content**: 25 lazy-loaded content pages with resource tables, deliverables, checkpoint callouts, NotebookLM sync
- **12 enriched sub-modules**: ML fundamentals, deep learning, MLOps, inference systems, OS, distributed systems, numerical linear algebra, convex optimization, probability — each with best-of-web course/book/repo links
- **AuDHD-friendly**: Focus mode, progressive disclosure (Continue card + Today's picks), reduce-to-3 decision surface, TTS read-aloud, quick-save to tracker
- **Search**: Full-text search powered by MiniSearch
- **Progress Tracking**: Export/import JSON backups, weekly summaries, learning tracker

## 📦 Commands

```bash
npm run dev          # Vite dev server (port 5173)
npm run build        # tsc + vite build (runs convert + sync as prebuild)
npm run lint         # ESLint
npm run convert      # Obsidian vault → MDX conversion
npm run sync         # Sync NotebookLM content into MDX files (requires nlm CLI)
npx tsc --noEmit     # Type-check only
```

## 🚀 Local Deployment

### Prerequisites
- Node.js 18+ (recommended: install via `nvm`)
- npm or your preferred package manager

### Quick Start
```bash
# Clone the repository
git clone <your-repo-url> cs-learning
cd cs-learning

# Install dependencies (using your specified package manager)
npm install

# Start development server
npm run dev
# Opens at http://localhost:5173

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Using via Mobile (Phone Access)

Since you study during your 5-hour commute, here's how to access from your phone:

#### Option 1: Local Network Access (Same WiFi)
```bash
# Start dev server bound to all network interfaces
npm run dev -- --host

# Or modify package.json script:
# "dev": "vite --host"
```
Then on your phone, navigate to: `http://<your-computer-ip>:5173`
Find your IP: `hostname -I | awk '{print $1}'` (Linux) or `ipconfig` (Windows)

#### Option 2: Build + Serve Static Files
```bash
# Build the project
npm run build

# Serve the dist/ folder (requires: npm install -g serve)
serve -s dist

# Or use Python's built-in server
cd dist && python3 -m http.server 8080
```
Access via: `http://<your-computer-ip>:5173` or `8080`

#### Option 3: Using ngrok for Remote Access (Anywhere)
```bash
# Install ngrok (https://ngrok.com)
npm install -g ngrok

# Start dev server in another terminal
npm run dev

# Expose local server (in new terminal)
ngrok http 5173
```
Use the HTTPS URL ngrok provides to access from your phone anywhere!

## ☁️ Cloud Deployment

### Option A — Cloudflare Pages (free, unlimited bandwidth)
```bash
# 1. Push to GitHub
git init && git add . && git commit -m "init"
git remote add origin https://github.com/<youruser>/cs-learning.git
git push -u origin main

# 2. dash.cloudflare.com → Workers & Pages → Create → Pages → Connect Git
#    - Framework: None (static site)
#    - Build command: npm run build
#    - Output directory: dist
#    - Root: /
```

### Option B — Firebase Hosting (free Spark tier, pairs with sync)
```bash
npm install -g firebase-tools
firebase init hosting  # pick dist/ as public dir, SPA redirects
npm run build
firebase deploy --only hosting
```

### Option C — Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/<your-username>/cs-learning)

## 📱 Mobile Access Tips for Commute

Since your primary use case is **5-hour commute study sessions**:

1. **Download content for offline**: The site is offline-first, but MDX content needs initial load
2. **Bookmark on phone**: After deploying to Netlify, bookmark the URL on your phone's home screen
3. **"Continue Studying" button**: Tracks your last visited module — one tap resume
4. **Touch-friendly**: All interactive elements are minimum 44px (perfect for thumbs)
5. **Progressive Web App**: Consider adding a `manifest.json` + service worker for true offline installation

## 🛠 Tech Stack

- **Framework**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 (CSS-first, `@tailwindcss/postcss`)
- **Content**: MDX with custom remark plugins (wiki-links, frontmatter)
- **State**: Zustand + persist middleware (localStorage)
- **Search**: MiniSearch (client-side full-text search)
- **Animations**: CSS keyframes + canvas-confetti (lazy-loaded)
- **Icons**: Custom SVG icons (no emojis!)
- **Fonts**: Geist (headlines) + Satoshi (body) + JetBrains Mono (mono)

## 📂 Project Structure

```
src/
  tracks/        # 5-track system (types, configs, index)
  lib/           # State management (useProgress, useUnifiedProgress, useGamification)
  components/    # UI components (GamificationHeader, TrackSelector, TrackPhaseView...)
  content/       # MDX content files (math/, systems/, ai/)
  data/          # Curriculum definition (master roadmap graph)
scripts/         # Build scripts (seed, convert, sync)
```

## 🎨 Customization

### Adding a New Course
1. Create `src/content/my-course.mdx` with required frontmatter:
   ```yaml
   ---
   title: My Course
   topic: math
   difficulty: intermediate
   timeEstimate: 4w
   tags: [tag1, tag2]
   ---
   ```
2. It auto-registers via `import.meta.glob` — no manual imports needed!

### Modifying Track Configs
Edit files in `src/tracks/` (e.g., `cs-ai.ts`, `aws-mla.ts`) to add/remove modules or phases.

## 📝 License

MIT (or your preferred license)

---

**Built for self-taught developers who work full-time and study during commute windows.** 🚀


You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
