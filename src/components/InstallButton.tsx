import { useInstallPrompt } from '../lib/useInstallPrompt'

export default function InstallButton() {
  const { canInstall, promptInstall } = useInstallPrompt()

  if (!canInstall) return null

  return (
    <button
      onClick={() => promptInstall()}
      className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors min-h-[44px]"
    >
      📲 Install App
    </button>
  )
}
