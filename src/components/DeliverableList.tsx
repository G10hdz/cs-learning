import { useProgress } from '../lib/useProgress'
import { useUnifiedProgress } from '../lib/useUnifiedProgress'

type Props = {
  moduleId: string
  items: string[]
}

// Default deliverable XP for intermediate modules (cs-ai track)
const DEFAULT_DELIVERABLE_XP = 5

export default function DeliverableList({ moduleId, items }: Props) {
  const completed = useProgress((s) => s.completed)
  const toggle = useProgress((s) => s.toggle)
  const completeDeliverable = useUnifiedProgress((s) => s.completeDeliverable)

  const done = items.filter((_, i) => completed[`${moduleId}:${i}`]).length

  const handleToggle = (id: string) => {
    toggle(id)
    // Track as cs-ai for now (DeliverableList is used in cs-ai MDX files)
    completeDeliverable('cs-ai', moduleId, DEFAULT_DELIVERABLE_XP)
  }

  return (
    <div className="my-4 space-y-2">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {done}/{items.length} completados
      </p>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={done}
        aria-valuemax={items.length}
      >
        <div
          className="h-full rounded-full bg-indigo-500 transition-all"
          style={{ width: `${(done / items.length) * 100}%` }}
        />
      </div>
      <ul className="space-y-2">
        {items.map((item, i) => {
          const id = `${moduleId}:${i}`
          const isChecked = !!completed[id]
          return (
            <li key={id} className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => handleToggle(id)}
                className={`mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded border-2 transition-all ${
                  isChecked
                    ? 'border-amber-600 bg-amber-600 text-white scale-100'
                    : 'border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-900 hover:border-amber-400'
                } active:scale-95`}
                aria-label={isChecked ? 'Marcar como pendiente' : 'Marcar como completado'}
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                {isChecked && (
                  <svg
                    className="h-5 w-5 animate-[checkmark_0.3s_ease-out_forwards]"
                    style={{
                      animation: isChecked ? 'checkmark 0.3s ease-out forwards' : 'none',
                    }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d="M4 12l6 6 10-10"
                      style={{
                        strokeDasharray: '24',
                        strokeDashoffset: isChecked ? 0 : 24,
                        transition: 'stroke-dashoffset 0.3s ease-out',
                      }}
                    />
                  </svg>
                )}
              </button>
              <span
                className={`text-sm leading-relaxed ${isChecked ? 'text-slate-400 line-through dark:text-slate-600' : 'text-slate-700 dark:text-slate-300'}`}
              >
                {item}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
