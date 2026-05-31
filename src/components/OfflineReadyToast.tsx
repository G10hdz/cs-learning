import { useState, useEffect } from 'react'

export default function OfflineReadyToast() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = () => setShow(true)
    window.addEventListener('pwa:offline-ready', handler)
    return () => window.removeEventListener('pwa:offline-ready', handler)
  }, [])

  useEffect(() => {
    if (!show) return
    const timer = setTimeout(() => setShow(false), 3_000)
    return () => clearTimeout(timer)
  }, [show])

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 shadow-lg dark:border-emerald-900/40 dark:bg-emerald-950/30">
      <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
        ✓ App ready for offline use
      </span>
    </div>
  )
}
