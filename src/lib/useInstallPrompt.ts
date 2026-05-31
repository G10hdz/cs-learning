import { useState, useEffect, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): void
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISSED_KEY = 'pwa-install-dismissed'
const DISMISS_TTL = 7 * 24 * 60 * 60 * 1000

export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [canInstall, setCanInstall] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISSED_KEY)
    if (dismissed) {
      const ts = Number(dismissed)
      if (Date.now() - ts < DISMISS_TTL) return
      localStorage.removeItem(DISMISSED_KEY)
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
      setCanInstall(true)
    }
    window.addEventListener('beforeinstallprompt', handler)

    const installed = () => {
      setCanInstall(false)
      setDeferred(null)
    }
    window.addEventListener('appinstalled', installed)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installed)
    }
  }, [])

  const promptInstall = useCallback(async (): Promise<'accepted' | 'dismissed'> => {
    if (!deferred) return 'dismissed'
    deferred.prompt()
    const { outcome } = await deferred.userChoice
    setDeferred(null)
    setCanInstall(false)
    if (outcome === 'dismissed') {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()))
    }
    return outcome === 'accepted' ? 'accepted' : 'dismissed'
  }, [deferred])

  return { canInstall, promptInstall }
}
