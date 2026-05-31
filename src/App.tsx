import { Suspense, lazy, useMemo, useState, useEffect, type ReactNode } from 'react'
import { BrowserRouter, Link, Route, Routes, useParams } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import UpdatePrompt from './components/UpdatePrompt'
import OfflineReadyToast from './components/OfflineReadyToast'
import { contentItems } from './content'
import { RoadmapTree, type RoadmapNode } from './components/RoadmapTree'
import { SearchBar } from './components/SearchBar'
import { DarkModeToggle } from './components/DarkModeToggle'
import { useProgress } from './lib/useProgress'
import { NotebooklmProvider } from './lib/notebooklm-context'
import { useUnifiedProgress } from './lib/useUnifiedProgress'
import { useOnline } from './lib/useOnline'
import { useTracker } from './lib/useTracker'
import TrackSelector from './components/TrackSelector'
import TrackPhaseView from './components/TrackPhaseView'
import GamificationHeader from './components/GamificationHeader'
import InstallButton from './components/InstallButton'
import LearningTracker from './components/LearningTracker'
import { awsMlaTrack, mandarinTrack, englishTrack, projectsTrack } from './tracks'

const TOPIC_ORDER = ['math', 'systems', 'ai']

const buildRoadmapNodes = (items: typeof contentItems): RoadmapNode[] => {
  const map = new Map<string, RoadmapNode>()
  items.forEach((item) => {
    const topic = item.frontmatter.topic
    if (!map.has(topic)) {
      map.set(topic, { id: `topic-${topic}`, title: topic, children: [] })
    }
    map.get(topic)!.children!.push({
      id: item.id,
      title: item.frontmatter.title,
      slug: item.slug,
      meta: {
        difficulty: item.frontmatter.difficulty,
        timeEstimate: item.frontmatter.timeEstimate,
      },
    })
  })
  const ordered = TOPIC_ORDER.filter((t) => map.has(t)).map((t) => map.get(t)!)
  const rest = [...map.entries()].filter(([t]) => !TOPIC_ORDER.includes(t)).map(([, v]) => v)
  return [...ordered, ...rest]
}

const NotebooklmMapProvider = ({ children }: { children: ReactNode }) => {
  const map = useMemo(() => {
    return contentItems.reduce<Record<string, string | undefined>>((acc, item) => {
      const moduleId = item.frontmatter.notebooklmModuleId
      if (moduleId) acc[moduleId] = item.notebooklmLastSynced
      return acc
    }, {})
  }, [])

  return <NotebooklmProvider value={map}>{children}</NotebooklmProvider>
}

const Skeleton = () => (
  <div className="space-y-3 animate-pulse">
    <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
    <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
    <div className="h-4 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
  </div>
)

const lazyComponents = new Map(
  contentItems.map((item) => [item.slug, lazy(item.load)])
)

/* eslint-disable react-hooks/static-components -- lazy components pre-built at module scope */
const ContentPage = () => {
  const { slug } = useParams()
  const LazyComponent = slug ? lazyComponents.get(slug) : undefined
  const item = slug ? contentItems.find((ci) => ci.slug === slug) : undefined
  const setLastVisited = useUnifiedProgress((s) => s.setLastVisited)
  const tracker = useTracker()

  useEffect(() => {
    if (slug && item) {
      setLastVisited(item.trackId, slug)
    }
  }, [slug, item, setLastVisited])

  const quickSaveToTracker = () => {
    if (!item) return
    tracker.addItem({
      title: item.frontmatter.title,
      type: 'book',
      status: 'want',
      tags: item.frontmatter.tags ?? [],
    })
  }

  const speakContent = () => {
    if (!item) return
    const text = item.raw?.replace(/<[^>]*>/g, ' ')?.replace(/\s+/g, ' ')?.trim() || item.frontmatter.title
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.95
      window.speechSynthesis.speak(utterance)
    }
  }

  if (!LazyComponent) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold">Content not found</h2>
        <p className="text-sm text-slate-500">Try selecting another module.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 relative">
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={speakContent}
          className="px-3 py-2 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:bg-emerald-900 transition-colors min-h-[44px]"
          aria-label="Read content aloud"
        >
          🔊 Read aloud
        </button>
        <button
          onClick={quickSaveToTracker}
          className="px-3 py-2 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900 transition-colors min-h-[44px]"
          aria-label="Save to Learning Tracker"
        >
          + Save to Tracker
        </button>
      </div>
      <Suspense fallback={<Skeleton />}>
        <LazyComponent />
      </Suspense>
    </div>
  )
}
/* eslint-enable react-hooks/static-components */

const Home = ({ focusMode = false }: { focusMode?: boolean }) => {
  const [topicFilter, setTopicFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [timeFilter, setTimeFilter] = useState('all')
  const [studyToolFilter, setStudyToolFilter] = useState('all')
  const [showAllModules, setShowAllModules] = useState(false)

  const exportSnapshot = useProgress((state) => state.exportSnapshot)
  const importSnapshot = useProgress((state) => state.importSnapshot)
  const reset = useProgress((state) => state.reset)
  const toggle = useProgress((state) => state.toggle)
  const completed = useProgress((state) => state.completed)
  const lastVisited = useUnifiedProgress((s) => s.lastVisitedModule)

  const topics = useMemo(
    () => Array.from(new Set(contentItems.map((item) => item.frontmatter.topic))),
    []
  )
  const difficulties = useMemo(
    () => Array.from(new Set(contentItems.map((item) => item.frontmatter.difficulty))),
    []
  )
  const times = useMemo(
    () => Array.from(new Set(contentItems.map((item) => item.frontmatter.timeEstimate))),
    []
  )
  const studyTools = useMemo(
    () =>
      Array.from(
        new Set(contentItems.map((item) => item.frontmatter.studyTool).filter(Boolean))
      ),
    []
  )

  const filtered = useMemo(() => {
    return contentItems.filter((item) => {
      if (topicFilter !== 'all' && item.frontmatter.topic !== topicFilter) return false
      if (difficultyFilter !== 'all' && item.frontmatter.difficulty !== difficultyFilter)
        return false
      if (timeFilter !== 'all' && item.frontmatter.timeEstimate !== timeFilter) return false
      if (studyToolFilter !== 'all' && item.frontmatter.studyTool !== studyToolFilter)
        return false
      return true
    })
  }, [topicFilter, difficultyFilter, timeFilter, studyToolFilter])

  const roadmapNodes = useMemo(() => buildRoadmapNodes(filtered), [filtered])

  const todayPicks = useMemo(() => {
    const incomplete = filtered.filter((item) => !completed[item.id])
    const byTopic = new Map<string, typeof contentItems[0][]>()
    incomplete.forEach((item) => {
      const topic = item.frontmatter.topic
      if (!byTopic.has(topic)) byTopic.set(topic, [])
      byTopic.get(topic)!.push(item)
    })
    const picks: typeof contentItems[0][] = []
    byTopic.forEach((items) => {
      const beginner = items.find((i) => i.frontmatter.difficulty === 'beginner')
      picks.push(beginner ?? items[0])
    })
    return picks.slice(0, 3)
  }, [filtered, completed])

  const continueModule = useMemo(() => {
    if (!lastVisited) return null
    return contentItems.find((item) => item.slug === lastVisited.moduleId) ?? null
  }, [lastVisited])

  const documents = useMemo(
    () =>
      contentItems.map((item) => ({
        id: item.id,
        title: item.frontmatter.title,
        tags: item.frontmatter.tags,
        content: item.raw,
        slug: item.slug,
        phase: item.frontmatter.phase,
      })),
    []
  )

  const downloadBackup = () => {
    const blob = new Blob([JSON.stringify(exportSnapshot(), null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'roadmap-progress.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportWeeklySummary = () => {
    const unified = useUnifiedProgress.getState()
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)

    let modulesCompleted = 0
    let xpThisWeek = 0

    Object.values(unified.tracks).forEach((track) => {
      Object.values(track.modules).forEach((mod) => {
        if (mod.completed && mod.completedAt) {
          const completedDate = new Date(mod.completedAt)
          if (completedDate >= weekAgo) {
            modulesCompleted++
            xpThisWeek += mod.xpEarned || 0
          }
        }
      })
    })

    const summary = `Esta semana: ${modulesCompleted} módulos, ${xpThisWeek} XP, racha ${unified.gamification.currentStreak} días`

    const blob = new Blob([summary], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'weekly-summary.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const text = await file.text()
    try {
      importSnapshot(JSON.parse(text))
    } catch (error) {
      console.warn('Invalid progress backup', error)
    } finally {
      event.target.value = ''
    }
  }

  const renderSidebar = () => (
    <aside className="space-y-6">
      <SearchBar documents={documents} />
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-sm font-semibold">Filters</h2>
        <div className="space-y-3 text-sm">
          <label className="block">
            <span className="text-xs uppercase text-slate-500">Topic</span>
            <select
              value={topicFilter}
              onChange={(event) => setTopicFilter(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900 min-h-[44px]"
            >
              <option value="all">All</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs uppercase text-slate-500">Difficulty</span>
            <select
              value={difficultyFilter}
              onChange={(event) => setDifficultyFilter(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900 min-h-[44px]"
            >
              <option value="all">All</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs uppercase text-slate-500">Time</span>
            <select
              value={timeFilter}
              onChange={(event) => setTimeFilter(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900 min-h-[44px]"
            >
              <option value="all">All</option>
              {times.map((time) => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs uppercase text-slate-500">Study Tool</span>
            <select
              value={studyToolFilter}
              onChange={(event) => setStudyToolFilter(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-2.5 text-sm dark:border-slate-800 dark:bg-slate-900 min-h-[44px]"
            >
              <option value="all">All</option>
              {studyTools.map((tool) => (
                <option key={tool} value={tool}>{tool}</option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 text-xs shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="font-semibold">Progress backup</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={downloadBackup}
            className="rounded-md bg-indigo-600 px-4 py-2.5 text-white min-h-[44px]"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={exportWeeklySummary}
            className="rounded-md bg-emerald-600 px-4 py-2.5 text-white min-h-[44px]"
          >
            Weekly Summary
          </button>
          <label className="rounded-md border border-slate-200 px-4 py-2.5 text-slate-700 dark:border-slate-800 dark:text-slate-200 min-h-[44px] inline-flex items-center">
            Import JSON
            <input
              type="file"
              accept="application/json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-slate-200 px-4 py-2.5 text-slate-700 dark:border-slate-800 dark:text-slate-200 min-h-[44px]"
          >
            Reset
          </button>
        </div>
      </div>
    </aside>
  )

  const gridClass = `grid gap-6 ${focusMode ? '' : 'lg:grid-cols-[320px_1fr]'}`

  return (
    <div className={gridClass}>
      {!focusMode && renderSidebar()}
      <section className="space-y-6 min-w-0">
        {/* Continue where you left off */}
        {continueModule && (
          <Link
            to={`/roadmap/${continueModule.slug}`}
            className="block rounded-xl border-2 border-emerald-200 bg-emerald-50 p-5 shadow-sm hover:border-emerald-400 hover:bg-emerald-100 transition-colors dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:hover:border-emerald-700"
          >
            <p className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Continue where you left off</p>
            <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mt-1">{continueModule.frontmatter.title}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-emerald-600 dark:text-emerald-400">
              <span>{continueModule.frontmatter.difficulty}</span>
              <span>·</span>
              <span>{continueModule.frontmatter.timeEstimate || 'varies'}</span>
              <span className="ml-auto font-semibold">Resume →</span>
            </div>
          </Link>
        )}

        {/* Today's picks */}
        {todayPicks.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20">
            <p className="text-xs uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-3">Today's picks</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {todayPicks.map((item) => (
                <Link
                  key={item.slug}
                  to={`/roadmap/${item.slug}`}
                  className="flex items-center gap-3 rounded-lg border border-amber-200 bg-white p-3 hover:border-amber-400 transition-colors dark:border-amber-800 dark:bg-zinc-900 dark:hover:border-amber-600"
                >
                  <input
                    type="checkbox"
                    checked={!!completed[item.id]}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggle(item.id)}
                    className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    aria-label={`Mark ${item.frontmatter.title} complete`}
                  />
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100 flex-1">
                    {item.frontmatter.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All modules — collapsed by default */}
        {!focusMode && (
        <details open={todayPicks.length === 0}>
          <summary className="cursor-pointer text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 list-none flex items-center gap-2">
            <span className="text-xs transition-transform duration-200 inline-block" style={{ transform: showAllModules ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
            Explore all modules ({contentItems.length})
          </summary>
          <div className="mt-4">
            <RoadmapTree nodes={roadmapNodes} />
          </div>
        </details>
        )}
      </section>
    </div>
  )
}

export default function App() {
  const [activeTrackId, setActiveTrackId] = useState<string>('cs-ai')
  const [focusMode, setFocusMode] = useState(false)
  const online = useOnline()

  const renderTrackContent = () => {
    if (activeTrackId === 'cs-ai') {
      return (
        <Routes>
          <Route path="/" element={<Home focusMode={focusMode} />} />
          <Route path="/roadmap/:slug" element={<ContentPage />} />
          <Route
            path="*"
            element={
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Page not found</h2>
                <Link to="/" className="text-indigo-600 hover:underline">
                  Return home
                </Link>
              </div>
            }
          />
        </Routes>
      )
    }

    if (activeTrackId === 'tracker') {
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <LearningTracker />
        </div>
      )
    }

    const trackMap: Record<string, import('./tracks/types').Track> = {
      'aws-mla': awsMlaTrack,
      'mandarin': mandarinTrack,
      'english': englishTrack,
      'projects': projectsTrack,
    }
    const track = trackMap[activeTrackId]
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {track ? (
          <TrackPhaseView track={track} />
        ) : (
          <div className="text-center py-8 text-slate-500">
            Track {activeTrackId} coming soon
          </div>
        )}
      </div>
    )
  }

  return (
    <BrowserRouter>
      <NotebooklmMapProvider>
        <MDXProvider>
          <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
            >
              Skip to content
            </a>
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
              <header className="flex flex-wrap items-center justify-between gap-3">
                <Link to="/" className="text-lg font-semibold">
                  {activeTrackId === 'cs-ai' ? 'CS/AI Roadmap' : `${activeTrackId.toUpperCase()} Roadmap`}
                </Link>
                <div className="flex items-center gap-4">
                  <GamificationHeader />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFocusMode((fm) => !fm)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium min-h-[44px] transition-colors ${
                        focusMode
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                      }`}
                      aria-label={focusMode ? 'Exit focus mode' : 'Enter focus mode'}
                    >
                      {focusMode ? '✕ Focus' : '⊙ Focus'}
                    </button>
                    <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-xs font-semibold text-indigo-600">
                      Offline-first
                    </span>
                    <InstallButton />
                    {!online && (
                      <span className="rounded-full bg-amber-600/10 px-3 py-1 text-xs font-semibold text-amber-600">
                        ● Offline
                      </span>
                    )}
                    <DarkModeToggle />
                  </div>
                </div>
              </header>
              <main id="main-content" className="space-y-6 overscroll-contain">
                {!focusMode && <TrackSelector activeTrackId={activeTrackId} onTrackChange={setActiveTrackId} />}
                {renderTrackContent()}
              </main>
            </div>
          </div>
        </MDXProvider>
      </NotebooklmMapProvider>
      <UpdatePrompt />
      <OfflineReadyToast />
    </BrowserRouter>
  )
}
