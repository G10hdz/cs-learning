import { useEffect, useState } from 'react'

const STORAGE_KEY = 'roadmap-dark-mode'

const getSystemPreference = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches

const getInitial = (): boolean => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored !== null) return stored === 'true'
  return getSystemPreference()
}

export const useDarkMode = () => {
  const [dark, setDark] = useState(getInitial)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem(STORAGE_KEY, String(dark))
  }, [dark])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      if (localStorage.getItem(STORAGE_KEY) === null) setDark(e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return [dark, () => setDark((d) => !d)] as const
}
