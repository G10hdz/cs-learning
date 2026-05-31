import { useGamification } from '../lib/useGamification'

export default function StreakBadge() {
  const { currentStreak, freezes } = useGamification()

  return (
    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
      <span>🔥</span>
      <span className="text-sm font-semibold">{currentStreak}</span>
      {freezes > 0 && (
        <span className="text-xs ml-1">❄️ {freezes}</span>
      )}
    </div>
  )
}
