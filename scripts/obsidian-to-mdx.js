import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import matter from 'gray-matter'

const VAULT_DIR =
  process.argv[2] || path.resolve(process.env.HOME, "Documents/Gio's Brain OwO/20-Study")
const OUTPUT_DIR = process.argv[3] || path.resolve(process.cwd(), 'src/content')

const TOPIC_MAP = {
  math: 'math',
  systems: 'systems',
  'ai-ml': 'ai-ml',
  mlops: 'mlops',
  programming: 'programming',
  'programming gen': 'programming',
}

const DIFFICULTY_HINTS = {
  intro: /intro|basics|101|beginner|fundament/i,
  intermediate: /intermediate|applied|practice/i,
  advanced: /advanced|research|deep|grad/i,
}

const log = {
  info: (msg) => console.log(`[obsidian→mdx] ${msg}`),
  warn: (msg) => console.warn(`[obsidian→mdx] ${msg}`),
  skip: (msg) => console.log(`[obsidian→mdx] SKIP ${msg}`),
}

const toSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

const ensureDir = (dir) => fs.mkdir(dir, { recursive: true })

const getMarkdownFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) return getMarkdownFiles(fullPath)
      return entry.name.endsWith('.md') ? [fullPath] : []
    })
  )
  return files.flat()
}

const inferTopic = (filePath) => {
  const relative = path.relative(VAULT_DIR, filePath)
  const firstDir = relative.split(path.sep)[0]?.toLowerCase()
  return TOPIC_MAP[firstDir] || 'general'
}

const inferDifficulty = (title, content) => {
  const text = `${title} ${content.slice(0, 500)}`
  for (const [level, pattern] of Object.entries(DIFFICULTY_HINTS)) {
    if (pattern.test(text)) return level
  }
  return 'intro'
}

const extractTitle = (filePath, content) => {
  const heading = content.match(/^#\s+(.+)$/m)?.[1]
  if (heading) return heading.trim()
  return path.basename(filePath, path.extname(filePath))
}

const extractTags = (content) => {
  const obsidianTags = content.match(/#([a-zA-Z][\w/-]*)/g)
  if (!obsidianTags) return []
  return [...new Set(obsidianTags.map((t) => t.slice(1).toLowerCase()))]
}

const transformObsidianSyntax = (content) => {
  let result = content

  // ==highlights== → <mark>...</mark>
  result = result.replace(/==([^=]+)==/g, '<mark>$1</mark>')

  // > [!type] callouts → blockquote with bold type header
  result = result.replace(
    /^>\s*\[!(\w+)\]\s*(.*)$/gm,
    (_, type, title) => `> **${type.charAt(0).toUpperCase() + type.slice(1)}${title ? `: ${title}` : ''}**`
  )

  // Obsidian [[links]] are handled by remarkWikiLinks in vite.config.ts, keep as-is

  // Strip footnote-style references like [1] that NotebookLM/AI outputs inject
  result = result.replace(/\s*\[\d+\]/g, '')

  // Remove Obsidian inline tags from body (already extracted)
  result = result.replace(/(^|\s)#([a-zA-Z][\w/-]*)/g, '$1')

  return result.trim()
}

const convertFile = async (filePath) => {
  const raw = await fs.readFile(filePath, 'utf-8')

  if (raw.trim().length === 0) {
    log.skip(`empty file: ${path.relative(VAULT_DIR, filePath)}`)
    return null
  }

  const parsed = matter(raw)
  const body = parsed.content.trim()
  const title = parsed.data?.title ?? extractTitle(filePath, body)
  const topic = parsed.data?.topic ?? inferTopic(filePath)
  const difficulty = parsed.data?.difficulty ?? inferDifficulty(title, body)
  const existingTags = parsed.data?.tags ?? []
  const inferredTags = extractTags(body)
  const tags = [...new Set([...existingTags, ...inferredTags])].filter(Boolean)

  const frontmatter = {
    title,
    topic,
    difficulty,
    timeEstimate: parsed.data?.timeEstimate ?? '15m',
    tags,
  }

  if (parsed.data?.studyTool) frontmatter.studyTool = parsed.data.studyTool
  if (parsed.data?.notebooklmModuleId)
    frontmatter.notebooklmModuleId = parsed.data.notebooklmModuleId
  if (parsed.data?.localSourceZip) frontmatter.localSourceZip = parsed.data.localSourceZip

  const slug = toSlug(title)
  const outputPath = path.join(OUTPUT_DIR, `${slug}.mdx`)

  const existing = await fs.readFile(outputPath, 'utf-8').catch(() => null)
  if (existing) {
    const existingParsed = matter(existing)
    const hasManualContent =
      existing.includes('notebooklm-sync-start') ||
      existing.includes('<InteractiveCodeBlock') ||
      existing.includes('<NotebookLMModuleCard')
    if (hasManualContent) {
      log.skip(`has manual content: ${slug}.mdx (update frontmatter only)`)
      const merged = matter.stringify(existingParsed.content, {
        ...existingParsed.data,
        ...frontmatter,
        tags: [...new Set([...(existingParsed.data.tags ?? []), ...tags])],
      })
      await fs.writeFile(outputPath, merged, 'utf-8')
      return slug
    }
  }

  const transformed = transformObsidianSyntax(body)
  const output = matter.stringify(transformed, frontmatter)
  await fs.writeFile(outputPath, output, 'utf-8')
  return slug
}

const run = async () => {
  await ensureDir(OUTPUT_DIR)

  try {
    await fs.access(VAULT_DIR)
  } catch {
    log.warn(`Vault not found at ${VAULT_DIR} — skipping conversion`)
    process.exit(0)
  }

  const files = await getMarkdownFiles(VAULT_DIR)
  if (files.length === 0) {
    log.info('No .md files found in vault')
    return
  }

  const results = await Promise.all(files.map(convertFile))
  const converted = results.filter(Boolean)
  log.info(`Converted ${converted.length}/${files.length} files → ${OUTPUT_DIR}`)
  if (converted.length > 0) log.info(`Slugs: ${converted.join(', ')}`)
}

run().catch((error) => {
  log.warn(`Conversion failed: ${error.message}`)
  process.exit(0)
})
