import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Quest } from '../tracks/types'

export type UnifiedProgressState = {
  tracks: Record<
    string,
    {
      modules: Record<
        string,
        { completed: boolean; xpEarned: number; completedAt?: string }
      >
    }
  >
  lastVisitedModule: { trackId: string; moduleId: string } | null
  gamification: {
    totalXP: number
    currentStreak: number
    longestStreak: number
    lastActiveDate: string // ISO date "YYYY-MM-DD"
    freezes: number
    unlockedAchievements: string[]
    todayQuests: Quest[]
    questsGeneratedDate: string
    questsCompletedDate: string
  }
  completeModule: (trackId: string, moduleId: string, xpReward: number) => void
  completeDeliverable: (trackId: string, moduleId: string, xpReward: number) => void
  setLastVisited: (trackId: string, moduleId: string) => void
  updateStreak: () => void
}

const getToday = () => new Date().toISOString().split('T')[0]

export const useUnifiedProgress = create<UnifiedProgressState>()(
  persist(
    (set, get) => ({
  tracks: {},
  lastVisitedModule: null,
  gamification: {
        totalXP: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: '',
        freezes: 0,
        unlockedAchievements: [],
        todayQuests: [],
        questsGeneratedDate: '',
        questsCompletedDate: '',
      },

      completeModule: (trackId, moduleId, xpReward) => {
        const state = get()
        const existing = state.tracks[trackId]?.modules[moduleId]

        if (existing?.completed) return

        set((prev) => {
          // Check if all today's quests are now completed
          const quests = prev.gamification.todayQuests
          const today = getToday()
          const tracksPostUpdate = {
            ...prev.tracks,
            [trackId]: {
              ...prev.tracks[trackId],
              modules: {
                ...prev.tracks[trackId]?.modules,
                [moduleId]: {
                  completed: true,
                  xpEarned: xpReward,
                  completedAt: new Date().toISOString(),
                },
              },
            },
          }
          const allQuestsDone =
            quests.length > 0 &&
            quests.every((q) => {
              // Check if any completed module's title matches a quest label
              return Object.values(tracksPostUpdate).some((track) =>
                Object.values(track.modules).some(
                  (mod) => mod.completed && q.label.includes(
                    // Match by stripping XP suffix - crude but works
                    q.label.replace(/\s*\(\d+\s*XP\)$/, '').replace('Complete ', '')
                  )
                )
              )
            })

          return {
            tracks: tracksPostUpdate,
            gamification: {
              ...prev.gamification,
              totalXP: prev.gamification.totalXP + xpReward,
              questsCompletedDate: allQuestsDone && prev.gamification.questsCompletedDate !== today
                ? today : prev.gamification.questsCompletedDate,
            },
          }
        })

        get().updateStreak()
      },

      completeDeliverable: (trackId, moduleId, xpReward) => {
        const state = get()
        const module = state.tracks[trackId]?.modules[moduleId]

        if (!module) return

        set((prev) => ({
          gamification: {
            ...prev.gamification,
            totalXP: prev.gamification.totalXP + xpReward,
          },
        }))

        get().updateStreak()
      },

      setLastVisited: (trackId, moduleId) => {
        set({ lastVisitedModule: { trackId, moduleId } })
      },

      updateStreak: () => {
        const today = getToday()
        set((prev) => {
          const last = prev.gamification.lastActiveDate
          let newStreak = prev.gamification.currentStreak

          if (last === today) return prev

          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toISOString().split('T')[0]

          if (last === yesterdayStr) {
            newStreak += 1
          } else if (last !== today) {
            newStreak = 1
          }

          const newFreezes =
            newStreak > 0 && newStreak % 7 === 0
              ? prev.gamification.freezes + 1
              : prev.gamification.freezes

          return {
            gamification: {
              ...prev.gamification,
              currentStreak: newStreak,
              longestStreak: Math.max(prev.gamification.longestStreak, newStreak),
              lastActiveDate: today,
              freezes: newFreezes,
            },
          }
        })
      },
    }),
    {
      name: 'unified-progress',
      version: 1,
    }
  )
)
