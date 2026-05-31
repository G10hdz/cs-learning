import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ProgressSnapshot = Record<string, boolean>

type ProgressState = {
  completed: ProgressSnapshot
  toggle: (id: string) => void
  set: (id: string, value: boolean) => void
  reset: () => void
  importSnapshot: (snapshot: ProgressSnapshot) => void
  exportSnapshot: () => ProgressSnapshot
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      completed: {},
      toggle: (id) =>
        set((state) => ({
          completed: { ...state.completed, [id]: !state.completed[id] },
        })),
      set: (id, value) =>
        set((state) => ({ completed: { ...state.completed, [id]: value } })),
      reset: () => set({ completed: {} }),
      importSnapshot: (snapshot) => set({ completed: snapshot }),
      exportSnapshot: () => ({ ...get().completed }),
    }),
    {
      name: 'roadmap-progress',
      version: 1,
    }
  )
)
