import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  variant?: 'warning' | 'info' | 'success'
}

const styles = {
  warning: {
    container: 'border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40',
    icon: '⚠️',
    label: 'text-amber-800 dark:text-amber-300',
    body: 'text-amber-900 dark:text-amber-200',
  },
  info: {
    container: 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950/40',
    icon: 'ℹ️',
    label: 'text-blue-800 dark:text-blue-300',
    body: 'text-blue-900 dark:text-blue-200',
  },
  success: {
    container: 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/40',
    icon: '✅',
    label: 'text-green-800 dark:text-green-300',
    body: 'text-green-900 dark:text-green-200',
  },
}

export default function CheckpointCallout({ children, variant = 'warning' }: Props) {
  const s = styles[variant]
  return (
    <div className={`my-4 rounded-xl border-l-4 p-4 ${s.container}`}>
      <p className={`mb-1 text-xs font-bold uppercase tracking-wide ${s.label}`}>
        {s.icon} Checkpoint
      </p>
      <div className={`text-sm leading-relaxed ${s.body}`}>{children}</div>
    </div>
  )
}
