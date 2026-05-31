declare module 'virtual:mdx-raw' {
  const rawModules: Record<string, string>
  export default rawModules
}

declare module '*.mdx' {
  import type { ComponentType } from 'react'
  const Component: ComponentType
  export const frontmatter: {
    title: string
    topic: string
    difficulty: string
    timeEstimate: string
    tags: string[]
    studyTool?: 'notebooklm' | 'ollama' | 'obsidian'
    notebooklmModuleId?: string
    localSourceZip?: string | string[]
  }
  export default Component
}
