import { useMemo } from 'react'
import { csAiTrack, awsMlaTrack, englishTrack, mandarinTrack, projectsTrack } from '../tracks'

type Props = {
  moduleId: string
  relatedModuleIds?: string[]
}

export default function RelatedModules({ relatedModuleIds }: Props) {
  const related = useMemo(() => {
    if (!relatedModuleIds || relatedModuleIds.length === 0) return []

    const allTracks = [csAiTrack, awsMlaTrack, englishTrack, mandarinTrack, projectsTrack]
    const result: { id: string; title: string; trackLabel: string }[] = []

    relatedModuleIds.forEach((id) => {
      for (const track of allTracks) {
        for (const phase of track.phases) {
          const mod = phase.modules.find((m) => m.id === id)
          if (mod) {
            result.push({
              id: mod.id,
              title: mod.title,
              trackLabel: `${track.emoji} ${track.label}`,
            })
            break
          }
        }
        if (result.find((r) => r.id === id)) break
      }
    })

    return result
  }, [relatedModuleIds])

  if (related.length === 0) return null

  return (
    <div className="my-6 p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
        Related Modules
      </h3>
      <ul className="space-y-2">
        {related.map((mod) => (
          <li key={mod.id} className="flex items-center gap-2 text-sm">
            <span className="text-xs text-slate-500">{mod.trackLabel}</span>
            <span className="text-slate-700 dark:text-slate-300">{mod.title}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
