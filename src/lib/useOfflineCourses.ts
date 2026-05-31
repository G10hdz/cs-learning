import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CourseState = 'idle' | 'downloading' | 'cached' | 'error'

export interface DownloadProgress {
  downloaded: number
  total: number
  bytesDone: number
  bytesTotal: number
}

interface CourseEntry {
  state: CourseState
  error?: string
}

interface OfflineCoursesState {
  courses: Record<string, CourseEntry>
  _controller: Record<string, AbortController>
  download(courseId: string): Promise<void>
  remove(courseId: string): Promise<void>
  cancel(courseId: string): void
  refreshStatus(courseId: string): Promise<void>
  _subscribeProgress(
    courseId: string,
    cb: (p: DownloadProgress) => void
  ): () => void
}

const progressListeners = new Map<string, Set<(p: DownloadProgress) => void>>()

export function subscribeProgress(
  courseId: string,
  cb: (p: DownloadProgress) => void
): () => void {
  if (!progressListeners.has(courseId)) {
    progressListeners.set(courseId, new Set())
  }
  progressListeners.get(courseId)!.add(cb)
  return () => {
    progressListeners.get(courseId)?.delete(cb)
  }
}

function emitProgress(courseId: string, p: DownloadProgress) {
  progressListeners.get(courseId)?.forEach((cb) => cb(p))
}

export const useOfflineCourses = create<OfflineCoursesState>()(
  persist(
    (set, get) => ({
      courses: {},
      _controller: {},

      download: async (courseId: string) => {
        const stale = get()._controller[courseId]
        if (stale) {
          stale.abort()
        }

        const controller = new AbortController()
        set((s) => ({
          _controller: { ...s._controller, [courseId]: controller },
          courses: {
            ...s.courses,
            [courseId]: { state: 'downloading' },
          },
        }))

        try {
          const manifestRes = await fetch(`/mit-${courseId}/_offline-manifest.json`)
          if (!manifestRes.ok) throw new Error('Failed to fetch course manifest')
          const manifest: {
            totalBytes: number
            files: { url: string; size: number }[]
          } = await manifestRes.json()

          if ('storage' in navigator && 'estimate' in navigator.storage) {
            const est = await navigator.storage.estimate()
            const usage = est.usage ?? 0
            const quota = est.quota ?? 0
            const needed = manifest.totalBytes * 1.2
            if (quota - usage < needed) {
              throw new Error(
                `Not enough storage: need ${(needed / 1024 / 1024).toFixed(0)} MB, have ${((quota - usage) / 1024 / 1024).toFixed(0)} MB available`
              )
            }
          }

          const cache = await caches.open('mit-ocw')
          const files = manifest.files
          const batchSize = 25
          let downloaded = 0
          let bytesDone = 0

          for (let i = 0; i < files.length; i += batchSize) {
            if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError')
            const batch = files.slice(i, i + batchSize)
            await Promise.all(
              batch.map(async (f) => {
                const res = await fetch(f.url, { signal: controller.signal })
                if (res.ok || res.status === 0) {
                  await cache.put(f.url, res.clone())
                }
              })
            )
            downloaded += batch.length
            bytesDone += batch.reduce((s, f) => s + f.size, 0)
            emitProgress(courseId, {
              downloaded,
              total: files.length,
              bytesDone,
              bytesTotal: manifest.totalBytes,
            })
          }

          set((s) => ({
            courses: { ...s.courses, [courseId]: { state: 'cached' } },
          }))
        } catch (err) {
          if (err instanceof DOMException && err.name === 'AbortError') {
            set((s) => ({
              courses: { ...s.courses, [courseId]: { state: 'idle' } },
            }))
            return
          }
          set((s) => ({
            courses: {
              ...s.courses,
              [courseId]: { state: 'error', error: String(err) },
            },
          }))
        }
      },

      remove: async (courseId: string) => {
        const controller = get()._controller[courseId]
        if (controller) controller.abort()

        try {
          const manifestRes = await fetch(`/mit-${courseId}/_offline-manifest.json`)
          if (!manifestRes.ok) throw new Error('No manifest found')
          const manifest: { files: { url: string }[] } = await manifestRes.json()
          const cache = await caches.open('mit-ocw')
          const batchSize = 50
          for (let i = 0; i < manifest.files.length; i += batchSize) {
            const batch = manifest.files.slice(i, i + batchSize)
            await Promise.all(batch.map((f) => cache.delete(f.url)))
          }
          set((s) => ({
            courses: { ...s.courses, [courseId]: { state: 'idle' } },
          }))
        } catch {
          set((s) => ({
            courses: {
              ...s.courses,
              [courseId]: { state: 'error', error: 'Failed to remove from cache' },
            },
          }))
        }
      },

      cancel: (courseId: string) => {
        const controller = get()._controller[courseId]
        if (controller) controller.abort()
      },

      refreshStatus: async (courseId: string) => {
        try {
          const manifestRes = await fetch(`/mit-${courseId}/_offline-manifest.json`)
          if (!manifestRes.ok) throw new Error('No manifest')
          const manifest: { files: { url: string }[] } = await manifestRes.json()
          const cache = await caches.open('mit-ocw')
          const samples = manifest.files.slice(0, 5)
          let hits = 0
          for (const f of samples) {
            const match = await cache.match(f.url)
            if (match) hits++
          }
          set((s) => ({
            courses: {
              ...s.courses,
              [courseId]: { state: hits === samples.length ? 'cached' : 'idle' },
            },
          }))
        } catch {
          // course not available yet
        }
      },

      _subscribeProgress: (courseId: string, cb: (p: DownloadProgress) => void) => {
        return subscribeProgress(courseId, cb)
      },
    }),
    {
      name: 'offline-courses-v1',
      version: 1,
      partialize: (state) => ({
        courses: Object.fromEntries(
          Object.entries(state.courses).map(([id, entry]) => [
            id,
            entry.state === 'downloading' ? { state: 'idle' as const } : entry,
          ])
        ),
      }),
    }
  )
)
