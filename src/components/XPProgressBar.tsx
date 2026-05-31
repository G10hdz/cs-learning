import { useGamification } from '../lib/useGamification'

export default function XPProgressBar() {
  const { level, levelLabel, totalXP, xpToNext } = useGamification()

  const progress = totalXP / (totalXP + xpToNext) * 100

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-medium text-slate-900 dark:text-slate-100">
          Level {level} · {levelLabel}
        </span>
        <span className="text-slate-500 dark:text-slate-400">
          {totalXP} / {totalXP + xpToNext} XP
        </span>
      </div>
      <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
