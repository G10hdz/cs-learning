import { useGamification } from '../lib/useGamification'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUnifiedProgress } from '../lib/useUnifiedProgress'

type Props = {
  onTrackChange?: (trackId: string) => void
}

export default function GamificationHeader({ onTrackChange }: Props) {
  const { level, levelLabel, totalXP, xpToNext, currentStreak, freezes } =
    useGamification()
  const prevLevel = useRef(level)
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  const lastVisited = useUnifiedProgress((s) => s.lastVisitedModule)
  const navigate = useNavigate()

  useEffect(() => {
    if (prevLevel.current !== undefined && level > prevLevel.current && !prefersReducedMotion.current) {
      // Lazy-load confetti
      import('canvas-confetti').then((mod) => {
        const confetti = mod.default
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      })
    }
    prevLevel.current = level
  }, [level])

  const handleContinue = () => {
    if (!lastVisited) return
    // CS/AI track modules have MDX pages
    if (lastVisited.trackId === 'cs-ai') {
      navigate(`/roadmap/${lastVisited.moduleId}`)
    } else {
      // For other tracks, switch to that track
      onTrackChange?.(lastVisited.trackId)
    }
  }

  return (
    <div
      className="flex flex-wrap items-center gap-4 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm"
      role="region"
      aria-label="Gamification status"
      style={{ animation: 'fadeInUp 0.5s ease-out forwards' }}
    >
      {/* Streak - live region with pulse animation */}
      <div className="flex items-center gap-2 animate-pulse" aria-live="polite">
        <span className="text-xl transition-transform duration-300 hover:scale-110">🔥</span>
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {currentStreak > 0 ? (
              <><span aria-label={`${currentStreak} day streak`}>{currentStreak}</span> day streak</>
            ) : (
              <span>Start your streak today!</span>
            )}
          </p>
          {freezes > 0 && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400" aria-label={`${freezes} freezes available`}>
              ❄️ {freezes} freezes
            </p>
          )}
        </div>
      </div>

      {/* Level + XP Bar - live region */}
      <div className="flex-1 min-w-[200px]" aria-live="polite">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Level <span aria-label={`Level ${level}`}>{level}</span> · {levelLabel}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400" aria-label={`${totalXP} of ${totalXP + xpToNext} XP`}>
            {totalXP} / {totalXP + xpToNext} XP
          </span>
        </div>
        <div
          className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={totalXP}
          aria-valuemax={totalXP + xpToNext}
          aria-label={`XP progress: ${totalXP} of ${totalXP + xpToNext}`}
        >
          <div
            className="h-full bg-amber-600 transition-all duration-500 ease-out"
            style={{ width: `${(totalXP / (totalXP + xpToNext)) * 100}%` }}
          />
        </div>
      </div>

      {/* Total XP - live region */}
      <div className="flex items-center gap-2 transition-transform duration-200 hover:scale-105" aria-live="polite">
        <span className="text-xl">💯</span>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100" aria-label={`Total XP: ${totalXP}`}>
          {totalXP} total XP
        </p>
      </div>

      {/* Continue button with scale animation */}
      {lastVisited && (
        <button
          onClick={handleContinue}
          className="px-4 py-2.5 bg-emerald-600 text-white rounded-full text-sm font-medium hover:bg-emerald-700 transition-all duration-200 active:scale-95 active:translate-y-[1px] shadow-sm hover:shadow-md"
          aria-label="Continue studying where you left off"
          style={{ minHeight: '44px' }}
        >
          Continue Studying →
        </button>
      )}
    </div>
  )
}
