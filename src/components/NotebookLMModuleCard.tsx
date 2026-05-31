import { useNotebooklmSync } from '../lib/notebooklm-context'

type Props = {
  moduleId: string
  lastSynced?: string
}

const buildCommandHint = (moduleId: string) =>
  `nlm notebook query ${moduleId} "Summarize this notebook and provide 5 concise Q&A pairs." --json`

export default function NotebookLMModuleCard({ moduleId, lastSynced }: Props) {
  const syncedAt = useNotebooklmSync(moduleId) ?? lastSynced
  const status = syncedAt ? 'Synced' : 'Not synced'

  return (
    <section className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-900 shadow-sm dark:border-indigo-900/40 dark:bg-indigo-950/40 dark:text-indigo-100">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-indigo-500">NotebookLM</p>
          <p className="font-semibold">Module {moduleId}</p>
        </div>
        <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-200">
          {status}
        </span>
      </div>
      <div className="mt-3 grid gap-1 text-xs text-indigo-700 dark:text-indigo-200">
        <span>Last updated: {syncedAt ?? 'Awaiting sync'}</span>
        <span className="font-mono">{buildCommandHint(moduleId)}</span>
      </div>
    </section>
  )
}
