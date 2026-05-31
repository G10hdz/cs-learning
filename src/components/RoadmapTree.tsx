import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useProgress } from '../lib/useProgress'

export type RoadmapNode = {
  id: string
  title: string
  slug?: string
  children?: RoadmapNode[]
  meta?: { difficulty?: string; timeEstimate?: string }
}

const difficultyClass = (d: string) => {
  if (d === 'beginner') return 'text-xs rounded px-1.5 py-0.5 font-medium text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950'
  if (d === 'intermediate') return 'text-xs rounded px-1.5 py-0.5 font-medium text-yellow-700 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950'
  return 'text-xs rounded px-1.5 py-0.5 font-medium text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950'
}

type ProgressTotals = { total: number; completed: number }

const computeProgress = (
  node: RoadmapNode,
  completed: Record<string, boolean>
): ProgressTotals => {
  if (!node.children || node.children.length === 0) {
    const done = completed[node.id] ? 1 : 0
    return { total: 1, completed: done }
  }

  return node.children.reduce(
    (acc, child) => {
      const childTotals = computeProgress(child, completed)
      return {
        total: acc.total + childTotals.total,
        completed: acc.completed + childTotals.completed,
      }
    },
    { total: 0, completed: 0 }
  )
}

const formatPercent = ({ total, completed }: ProgressTotals) =>
  total === 0 ? 0 : Math.round((completed / total) * 100)

export const RoadmapTree = ({ nodes }: { nodes: RoadmapNode[] }) => {
  const completed = useProgress((state) => state.completed)
  const toggle = useProgress((state) => state.toggle)

  const progressMap = useMemo(() => {
    const map = new Map<string, ProgressTotals>()
    const walk = (node: RoadmapNode) => {
      const totals = computeProgress(node, completed)
      map.set(node.id, totals)
      node.children?.forEach(walk)
    }
    nodes.forEach(walk)
    return map
  }, [nodes, completed])

  const renderNode = (node: RoadmapNode) => {
    const totals = progressMap.get(node.id) ?? { total: 0, completed: 0 }
    const percent = formatPercent(totals)
    const isLeaf = !node.children || node.children.length === 0

    return (
      <li key={node.id} className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {isLeaf ? (
            <label className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer">
              <input
                type="checkbox"
                aria-label={`Mark ${node.title} complete`}
                checked={!!completed[node.id]}
                onChange={() => toggle(node.id)}
                className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          ) : (
            <span className="h-4 w-4 rounded-full border border-indigo-400 bg-indigo-50" />
          )}
          <div className="flex-1">
            {node.slug ? (
              <Link
                to={`/roadmap/${node.slug}`}
                className="font-medium text-slate-900 hover:text-indigo-600 dark:text-slate-100"
              >
                {node.title}
              </Link>
            ) : (
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {node.title}
              </span>
            )}
          </div>
          {isLeaf && node.meta?.difficulty && (
            <span className={difficultyClass(node.meta.difficulty)}>
              {node.meta.difficulty}
            </span>
          )}
          {isLeaf && node.meta?.timeEstimate && (
            <span className="text-xs text-slate-400">{node.meta.timeEstimate}</span>
          )}
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {percent}%
          </span>
        </div>
        {node.children && node.children.length > 0 && (
          <ul className="space-y-2 border-l border-slate-200 pl-4 dark:border-slate-800">
            {node.children.map(renderNode)}
          </ul>
        )}
      </li>
    )
  }

  return <ul className="space-y-3">{nodes.map(renderNode)}</ul>
}
