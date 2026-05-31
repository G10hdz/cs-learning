import { useMemo } from 'react'
import { useUnifiedProgress } from './useUnifiedProgress'
import type { Quest, TrackModule } from '../tracks/types'
import { csAiTrack, awsMlaTrack, englishTrack, mandarinTrack } from '../tracks'

const DIFFICULTY_WEIGHT: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
}

// Placeholder for projects track (will be added later)
const ALL_TRACKS = [csAiTrack, awsMlaTrack, englishTrack, mandarinTrack]

export function useGamification() {
  const totalXP = useUnifiedProgress((s) => s.gamification.totalXP)
  const currentStreak = useUnifiedProgress((s) => s.gamification.currentStreak)
  const longestStreak = useUnifiedProgress((s) => s.gamification.longestStreak)
  const freezes = useUnifiedProgress((s) => s.gamification.freezes)
  const rawQuests = useUnifiedProgress((s) => s.gamification.todayQuests)
  const questsGeneratedDate = useUnifiedProgress((s) => s.gamification.questsGeneratedDate)
  const tracks = useUnifiedProgress((s) => s.tracks)

  // Derive completed status from actual module progress
  const todayQuests = useMemo(() =>
    rawQuests.map((q) => {
      const moduleTitle = q.label.replace(/\s*\(\d+\s*XP\)$/, '').replace('Complete ', '')
      const isCompleted = Object.values(tracks).some((track) =>
        Object.values(track.modules).some(
          (mod) => mod.completed && moduleTitle.includes(mod.completed ? moduleTitle : '')
        )
      )
      return { ...q, completed: isCompleted }
    }),
    [rawQuests, tracks]
  )

  const level = useMemo(() => Math.floor(Math.sqrt(totalXP / 100)) + 1, [totalXP])

  const xpForNextLevel = useMemo(() => level * level * 100, [level])
  const xpToNext = useMemo(() => xpForNextLevel - totalXP, [xpForNextLevel, totalXP])

  const levelLabel = useMemo(() => {
    if (level < 3) return 'Novice'
    if (level < 5) return 'Aprendiz'
    if (level < 10) return 'Practicante'
    return 'Experto'
  }, [level])

  const generateDailyQuests = (): Quest[] => {
    const today = new Date().toISOString().split('T')[0]
    if (questsGeneratedDate === today) return todayQuests

    // Collect all uncompleted modules
    const candidates: (TrackModule & { trackId: string; score: number })[] = []

    ALL_TRACKS.forEach((track) => {
      track.phases.forEach((phase) => {
        phase.modules.forEach((mod) => {
          // Skip if module is completed (would need to check progress, placeholder for now)
          const score =
            mod.xpReward * 0.6 +
            (DIFFICULTY_WEIGHT[mod.difficulty] || 1) * 0.4 +
            Math.random() * 0.1

          candidates.push({ ...mod, trackId: track.id, score })
        })
      })
    })

    // Sort by score descending, pick top 3 with variety (no 2 from same track)
    candidates.sort((a, b) => b.score - a.score)
    const selected: typeof candidates = []
    const trackCount: Record<string, number> = {}

    for (const c of candidates) {
      if (selected.length >= 3) break
      if (trackCount[c.trackId] >= 1) continue
      trackCount[c.trackId] = (trackCount[c.trackId] || 0) + 1
      selected.push(c)
    }

    const quests: Quest[] = selected.map((m) => ({
      label: `Complete ${m.title} (${m.xpReward} XP)`,
      xpReward: m.xpReward,
    }))

    // Update store with new quests
    useUnifiedProgress.setState((prev) => ({
      gamification: {
        ...prev.gamification,
        todayQuests: quests,
        questsGeneratedDate: today,
      },
    }))

    return quests
  }

  return {
    level,
    levelLabel,
    totalXP,
    xpToNext,
    currentStreak,
    longestStreak,
    freezes,
    todayQuests,
    generateDailyQuests,
  }
}
