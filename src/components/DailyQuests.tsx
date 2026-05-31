import { useEffect, useRef } from 'react'
import { useGamification } from '../lib/useGamification'

export default function DailyQuests() {
  const { todayQuests, generateDailyQuests } = useGamification()
  const prevQuestCompletedRef = useRef(false)

  const getToday = () => new Date().toISOString().split('T')[0]
  const questsDoneToday = useRef(false)

  // Generate quests on mount if needed
  if (todayQuests.length === 0) {
    generateDailyQuests()
  }

  const allCompleted = todayQuests.length > 0 && todayQuests.every((q) => q.completed)

  useEffect(() => {
    if (allCompleted && !questsDoneToday.current) {
      questsDoneToday.current = true
      import('canvas-confetti').then((mod) => {
        mod.default({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#d97706', '#eab308', '#fbbf24'],
        })
      })
    }
  }, [allCompleted])

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
        Daily Quests
      </h3>
      {todayQuests.length === 0 ? (
        <p className="text-sm text-slate-500">Loading quests...</p>
      ) : (
        <ul className="space-y-2">
          {todayQuests.map((quest, i) => (
            <li key={i} className="flex items-center justify-between text-sm">
              <span className="text-slate-700 dark:text-slate-300">{quest.label}</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium dark:bg-indigo-900 dark:text-indigo-200">
                {quest.xpReward} XP
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
