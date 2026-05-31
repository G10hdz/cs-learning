import { useUnifiedProgress } from '../lib/useUnifiedProgress'
import { achievements } from '../lib/achievements'
import type { Achievement } from '../lib/achievements'

export default function BadgeShelf() {
  const unlocked = useUnifiedProgress((s) => s.gamification.unlockedAchievements)

  const isUnlocked = (id: string) => unlocked.includes(id)

  const allLocked = achievements.every((ach) => !isUnlocked(ach.id))
  const unlockedCount = unlocked.length

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
        Achievements {unlockedCount > 0 ? `(${unlockedCount}/${achievements.length})` : ''}
      </h3>
      {allLocked ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
          Complete your first module to unlock achievements
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {achievements.map((ach: Achievement) => {
            const unlocked = isUnlocked(ach.id)
            return (
              <div
                key={ach.id}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-opacity ${
                  unlocked ? 'opacity-100' : 'opacity-40 grayscale'
                }`}
                title={`${ach.label} - ${ach.xpThreshold} XP threshold`}
              >
                <span className="text-2xl">{ach.icon}</span>
                <span className="text-xs text-center text-slate-700 dark:text-slate-300">
                  {ach.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
