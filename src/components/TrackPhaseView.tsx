import { useNavigate } from 'react-router-dom'
import type { Track, Difficulty } from '../tracks/types'

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

const TRACK_TOP_BORDER: Record<string, string> = {
  'cs-ai': 'border-t-4 border-indigo-300 dark:border-indigo-600',
  'aws-mla': 'border-t-4 border-amber-300 dark:border-amber-600',
  'english': 'border-t-4 border-blue-300 dark:border-blue-600',
  'mandarin': 'border-t-4 border-red-300 dark:border-red-600',
  'projects': 'border-t-4 border-emerald-300 dark:border-emerald-600',
}

export default function TrackPhaseView({ track }: { track: Track }) {
  const navigate = useNavigate()
  return (
    <div className="space-y-8">
      {track.phases.map((phase, phaseIndex) => (
        <div
          key={phase.id}
          className="border border-zinc-200 dark:border-zinc-700 rounded-xl p-6 shadow-sm"
          style={{ animationDelay: `${phaseIndex * 100}ms` }}
        >
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              {phase.title}
            </h3>
            {phase.description && (
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {phase.description}
              </p>
            )}
          </div>

          <div className="space-y-4">
            {phase.modules.map((module, modIndex) => (
              <div
                key={module.id}
                className={`border border-zinc-100 dark:border-zinc-800 rounded-lg p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-[2px] ${
                  TRACK_TOP_BORDER[track.id] || ''
                } stagger-fade-in`}
                style={{ animationDelay: `${phaseIndex * 100 + modIndex * 50}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                      {module.title}
                    </h4>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {module.description}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        DIFFICULTY_COLORS[module.difficulty]
                      }`}
                    >
                      {module.difficulty}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {module.timeEstimate}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200">
                      {module.xpReward} XP
                    </span>
                  </div>
                </div>

                {module.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {module.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-xs bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {module.notebooklmId && (
                  <div className="mt-3 flex gap-2">
                    {module.mdxSlug && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200 cursor-pointer" onClick={() => navigate(`/roadmap/${module.mdxSlug}`)}>
                        📄 Abrir módulo
                      </span>
                    )}
                    <a
                      href={`https://notebooklm.google.com/notebook/${module.notebooklmId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200 hover:opacity-80 transition-opacity"
                    >
                      🎧 NotebookLM
                    </a>
                  </div>
                )}
                {module.deliverables && module.deliverables.length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Deliverables
                    </h5>
                    <ul className="list-disc pl-5 text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                      {module.deliverables.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {module.resources && module.resources.length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Resources
                    </h5>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-zinc-600 dark:text-zinc-400">
                        <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-400">
                          <tr>
                            <th className="px-3 py-2">Topic</th>
                            <th className="px-3 py-2">Free</th>
                            <th className="px-3 py-2">Paid</th>
                          </tr>
                        </thead>
                        <tbody>
                          {module.resources.map((res, i) => (
                            <tr key={i} className="border-t border-zinc-200 dark:border-zinc-700">
                              <td className="px-3 py-2">{res.topic}</td>
                              <td className="px-3 py-2">
                                {res.free ? (
                                  <a
                                    href={res.free}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:underline dark:text-indigo-400"
                                  >
                                    Link
                                  </a>
                                ) : (
                                  '-'
                                )}
                              </td>
                              <td className="px-3 py-2">
                                {res.paid ? (
                                  <a
                                    href={res.paid}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:underline dark:text-indigo-400"
                                  >
                                    Link
                                  </a>
                                ) : (
                                  '-'
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
