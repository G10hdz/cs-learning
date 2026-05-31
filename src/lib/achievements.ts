import type { UnifiedProgressState } from './useUnifiedProgress'

export type Achievement = {
  id: string
  label: string
  icon: string
  xpThreshold: number
  check: (state: UnifiedProgressState) => boolean
}

export const achievements: Achievement[] = [
  {
    id: 'first-blood',
    label: 'Primer Deliverable',
    icon: '⚔️',
    xpThreshold: 0,
    check: (state) => {
      // Check if any deliverable is completed (totalDeliverables >=1)
      // Placeholder: check if any module has xpEarned >0
      let totalDeliverables = 0
      Object.values(state.tracks).forEach((track) => {
        Object.values(track.modules).forEach((mod) => {
          if (mod.xpEarned > 0) totalDeliverables++
        })
      })
      return totalDeliverables >= 1
    },
  },
  {
    id: 'week-warrior',
    label: 'Racha de 7 días',
    icon: '🔥',
    xpThreshold: 0,
    check: (state) => state.gamification.currentStreak >= 7,
  },
  {
    id: 'math-wizard',
    label: 'Math Wizard',
    icon: '🧮',
    xpThreshold: 100,
    check: (state) => {
      const csAiTrack = state.tracks['cs-ai']
      if (!csAiTrack) return false
      const mathModules = ['optimization-convexa', 'probabilidad-aplicada', 'algebra-lineal-numerica', 'calculo-para-ml']
      let completed = 0
      mathModules.forEach((id) => {
        if (csAiTrack.modules[id]?.completed) completed++
      })
      return completed >= 4
    },
  },
  {
    id: 'shipper',
    label: 'First Ship',
    icon: '🚀',
    xpThreshold: 50,
    check: (state) => {
      const projectsTrack = state.tracks['projects']
      if (!projectsTrack) return false
      return Object.values(projectsTrack.modules).some((mod) => mod.completed)
    },
  },
  {
    id: 'centurion',
    label: '100 XP Club',
    icon: '💯',
    xpThreshold: 100,
    check: (state) => state.gamification.totalXP >= 100,
  },
  {
    id: 'polyglot',
    label: 'Bilingüe Técnico',
    icon: '🌐',
    xpThreshold: 200,
    check: (state) => {
      const englishTrack = state.tracks['english']
      if (!englishTrack) return false
      const modules = Object.values(englishTrack.modules).filter((mod) => mod.completed)
      return modules.length >= 4
    },
  },
  {
    id: 'aws-ready',
    label: 'MLA-C01 Ready',
    icon: '☁️',
    xpThreshold: 300,
    check: (state) => {
      const awsTrack = state.tracks['aws-mla']
      if (!awsTrack) return false
      const modules = Object.values(awsTrack.modules).filter((mod) => mod.completed)
      return modules.length >= 8
    },
  },
  {
    id: 'metis-link',
    label: 'Metis Integrado',
    icon: '🤖',
    xpThreshold: 150,
    check: (state) => {
      const projectsTrack = state.tracks['projects']
      if (!projectsTrack) return false
      const modules = Object.values(projectsTrack.modules).filter((mod) => mod.completed)
      return modules.length >= 3
    },
  },
]
