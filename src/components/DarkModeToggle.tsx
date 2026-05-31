import { useDarkMode } from '../lib/useDarkMode'

export const DarkModeToggle = () => {
  const [dark, toggle] = useDarkMode()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="rounded-lg border border-slate-200 p-2 text-sm hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800 min-h-[44px] min-w-[44px]"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
