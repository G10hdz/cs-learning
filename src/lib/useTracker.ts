import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TrackerItemType = 'book' | 'article' | 'video' | 'podcast' | 'paper' | 'course'
export type TrackerStatus = 'want' | 'active' | 'done'

export type TrackerItem = {
  id: string
  title: string
  type: TrackerItemType
  url?: string
  notebooklmId?: string
  status: TrackerStatus
  addedAt: string
  completedAt?: string
  notes?: string
  tags?: string[]
}

type TrackerState = {
  items: TrackerItem[]
  addItem: (item: Omit<TrackerItem, 'id' | 'addedAt'>) => void
  updateStatus: (id: string, status: TrackerStatus) => void
  removeItem: (id: string) => void
  updateNotes: (id: string, notes: string) => void
}

export const useTracker = create<TrackerState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((prev) => ({
          items: [
            ...prev.items,
            {
              ...item,
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              addedAt: new Date().toISOString(),
            },
          ],
        })),

      updateStatus: (id, status) =>
        set((prev) => ({
          items: prev.items.map((item) =>
            item.id === id
              ? { ...item, status, ...(status === 'done' ? { completedAt: new Date().toISOString() } : {}) }
              : item
          ),
        })),

      removeItem: (id) =>
        set((prev) => ({ items: prev.items.filter((item) => item.id !== id) })),

      updateNotes: (id, notes) =>
        set((prev) => ({
          items: prev.items.map((item) => (item.id === id ? { ...item, notes } : item)),
        })),
    }),
    { name: 'learning-tracker' }
  )
)
