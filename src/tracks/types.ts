export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type ResourceRow = {
  topic: string
  free?: string
  paid?: string
  deliverable?: string
}

export type DailyItem = {
  label: string
  xpReward: number
  completed?: boolean
}

export type TrackModule = {
  id: string
  title: string
  description: string
  difficulty: Difficulty
  timeEstimate: string
  xpReward: number
  tags: string[]
  requires?: string[]        // module IDs within this track
  relatedModules?: string[]  // cross-track module IDs
  resources?: ResourceRow[]
  dailyItems?: DailyItem[]
  deliverables?: string[]
  mdxSlug?: string
  notebooklmId?: string
}

export type TrackPhase = {
  id: string
  title: string
  description?: string
  modules: TrackModule[]
}

export type Track = {
  id: string
  label: string
  emoji: string
  description: string
  phases: TrackPhase[]
  color: string // Tailwind color token e.g. 'indigo' | 'amber' | 'emerald'
}

export type Quest = DailyItem
