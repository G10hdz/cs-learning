import { useState, useEffect, useCallback } from 'react'
import { useOfflineCourses, subscribeProgress } from '../lib/useOfflineCourses'
import type { DownloadProgress } from '../lib/useOfflineCourses'

interface Props {
  courseId: string
  label?: string
  sizeBytes?: number
}

function formatBytes(bytes: number) {
  if (bytes > 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
  if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(0)} MB`
  return `${(bytes / 1024).toFixed(0)} KB`
}

export default function OfflineCourseButton({ courseId, label, sizeBytes }: Props) {
  const course = useOfflineCourses((s) => s.courses[courseId])
  const download = useOfflineCourses((s) => s.download)
  const remove = useOfflineCourses((s) => s.remove)
  const cancel = useOfflineCourses((s) => s.cancel)
  const refreshStatus = useOfflineCourses((s) => s.refreshStatus)

  const [progress, setProgress] = useState<DownloadProgress | null>(null)

  useEffect(() => {
    if (!course) {
      refreshStatus(courseId)
    }
  }, [courseId, course, refreshStatus])

  useEffect(() => {
    return subscribeProgress(courseId, setProgress)
  }, [courseId])

  const handleDownload = useCallback(() => {
    setProgress(null)
    download(courseId)
  }, [courseId, download])

  const state = course?.state ?? 'idle'
  const error = course?.error

  if (state === 'idle') {
    return (
      <div className="mt-4">
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors min-h-[44px]"
        >
          ⬇ Download for offline
          {sizeBytes != null && (
            <span className="text-indigo-200">({formatBytes(sizeBytes)})</span>
          )}
        </button>
        <p className="mt-1 text-xs text-slate-400">
          Save {label ?? `MIT ${courseId}`} content for offline study during commutes
        </p>
      </div>
    )
  }

  if (state === 'downloading') {
    const pct =
      progress && progress.total > 0
        ? Math.round((progress.downloaded / progress.total) * 100)
        : 0
    return (
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-medium text-slate-500 tabular-nums">{pct}%</span>
        </div>
        {progress && (
          <p className="text-xs text-slate-400">
            {progress.downloaded}/{progress.total} files · {formatBytes(progress.bytesDone)}
            {progress.bytesTotal > 0 && ` / ${formatBytes(progress.bytesTotal)}`}
          </p>
        )}
        <button
          onClick={() => cancel(courseId)}
          className="text-xs font-medium text-amber-600 hover:underline dark:text-amber-400"
        >
          Cancel
        </button>
      </div>
    )
  }

  if (state === 'cached') {
    return (
      <div className="mt-4">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          ✓ Available offline
        </span>{' '}
        <button
          onClick={() => remove(courseId)}
          className="ml-3 text-xs font-medium text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          Remove
        </button>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="mt-4">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          Error: {error || 'Download failed'}
        </p>
        <button
          onClick={handleDownload}
          className="mt-1 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
        >
          Retry
        </button>
      </div>
    )
  }

  return null
}
