import type { ComponentType } from 'react'
import rawModules from 'virtual:mdx-raw'

export type ContentFrontmatter = {
  title: string
  topic: string
  difficulty: string
  timeEstimate: string
  tags: string[]
  studyTool?: 'notebooklm' | 'ollama' | 'obsidian'
  notebooklmModuleId?: string
  localSourceZip?: string | string[]
  phase?: number
}

export type ContentItem = {
  id: string
  slug: string
  trackId: string
  frontmatter: ContentFrontmatter
  raw: string
  load: () => Promise<{ default: ComponentType }>
  notebooklmLastSynced?: string
}

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

const mdxModules = import.meta.glob('./**/*.mdx') as Record<
  string,
  () => Promise<{ default: ComponentType }>
>

const parseFrontmatter = (raw: string): { data: ContentFrontmatter; body: string } => {
  const match = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!match) {
    return {
      data: {
        title: 'Untitled',
        topic: 'general',
        difficulty: 'intro',
        timeEstimate: '15m',
        tags: [],
      },
      body: raw,
    }
  }

  const lines = match[1].split('\n')
  const data: Record<string, string | string[] | null> = {}
  let currentKey: string | null = null

  lines.forEach((line) => {
    if (line.trim().startsWith('-') && currentKey) {
      const value = line.replace(/^\s*-\s*/, '').trim()
      const list = (data[currentKey] as string[]) ?? []
      list.push(value)
      data[currentKey] = list
      return
    }

    const [key, ...rest] = line.split(':')
    if (!key || rest.length === 0) return
    const rawValue = rest.join(':').trim()
    if (rawValue === '') {
      data[key.trim()] = []
      currentKey = key.trim()
      return
    }
    data[key.trim()] = rawValue === 'null' ? null : rawValue
    currentKey = null
  })

  const body = raw.slice(match[0].length).trim()

  return {
    data: {
      title: String(data.title ?? 'Untitled'),
      topic: String(data.topic ?? 'general'),
      difficulty: String(data.difficulty ?? 'intro'),
      timeEstimate: String(data.timeEstimate ?? '15m'),
      tags: (data.tags as string[]) ?? [],
      studyTool: data.studyTool
        ? (String(data.studyTool) as ContentFrontmatter['studyTool'])
        : undefined,
      notebooklmModuleId: data.notebooklmModuleId ? String(data.notebooklmModuleId) : undefined,
      phase: data.phase ? Number(data.phase) : undefined,
      localSourceZip: Array.isArray(data.localSourceZip)
        ? (data.localSourceZip as string[])
        : data.localSourceZip
          ? String(data.localSourceZip)
          : undefined,
    },
    body,
  }
}

const extractNotebooklmSync = (raw: string) => {
  const match = raw.match(/Last synced: ([^\n]+)/i)
  return match?.[1]
}

const deriveTrackId = (slug: string, pathKey: string): string => {
  const dir = pathKey.replace('./', '').split('/').slice(0, -1).join('/')
  const trackMap: Record<string, string> = {
    '': 'cs-ai',
    math: 'cs-ai',
    ai: 'cs-ai',
    systems: 'cs-ai',
    mandarin: 'mandarin',
    english: 'english',
  }
  return trackMap[dir] ?? 'cs-ai'
}

export const contentItems: ContentItem[] = Object.keys(mdxModules).map((pathKey) => {
  const raw = rawModules[pathKey] ?? ''
  const fileName = pathKey.split('/').pop() ?? pathKey
  const slug = toSlug(fileName.replace('.mdx', ''))
  const id = slug
  const { data } = parseFrontmatter(raw)

  return {
    id,
    slug,
    trackId: deriveTrackId(slug, pathKey),
    frontmatter: data,
    raw,
    load: mdxModules[pathKey],
    notebooklmLastSynced: extractNotebooklmSync(raw),
  }
})
