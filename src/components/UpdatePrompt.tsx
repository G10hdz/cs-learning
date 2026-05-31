import { useState, useEffect } from 'react'

export default function UpdatePrompt() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = () => setShow(true)
    window.addEventListener('pwa:need-refresh', handler)
    return () => window.removeEventListener('pwa:need-refresh', handler)
  }, [])

  useEffect(() => {
    if (!show) return
    const timer = setTimeout(() => setShow(false), 30_000)
    return () => clearTimeout(timer)
  }, [show])

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 shadow-lg dark:border-amber-900/40 dark:bg-amber-950/30">
      <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
        🔄 New version available.
      </span>{' '}
      <button
        onClick={() => window.location.reload()}
        className="ml-2 text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
      >
        Reload now
      </button>
    </div>
  )
}
