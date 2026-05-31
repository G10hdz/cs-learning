import { createContext, useContext } from 'react'

export type NotebooklmSyncMap = Record<string, string | undefined>

const NotebooklmContext = createContext<NotebooklmSyncMap>({})

export const NotebooklmProvider = NotebooklmContext.Provider

export const useNotebooklmSync = (moduleId?: string) => {
  const map = useContext(NotebooklmContext)
  if (!moduleId) return undefined
  return map[moduleId]
}
