import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import matter from 'gray-matter'
const CONTENT_DIR = path.resolve(process.cwd(), 'src/content')
const START_TOKEN = '<!-- notebooklm-sync-start -->'
const END_TOKEN = '<!-- notebooklm-sync-end -->'
const START_MARKER = `{/* ${START_TOKEN} */}`
const END_MARKER = `{/* ${END_TOKEN} */}`
const DEFAULT_QUESTION =
  process.env.NOTEBOOKLM_DEFAULT_QUESTION ??
  'Summarize this notebook and provide 5 concise Q&A pairs.'
const MCP_ENDPOINT = process.env.NOTEBOOKLM_MCP_ENDPOINT
const CLI_TEMPLATE =
  process.env.NOTEBOOKLM_CLI_TEMPLATE ??
  'nlm notebook query {id} "{question}" --json'

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const log = {
  info: (message) => console.log(`[notebooklm-sync] ${message}`),
  warn: (message) => console.warn(`[notebooklm-sync] ${message}`),
}

const getMdxFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        return getMdxFiles(fullPath)
      }
      return entry.name.endsWith('.mdx') ? [fullPath] : []
    })
  )
  return files.flat()
}

const runCli = (moduleId) => {
  const command = CLI_TEMPLATE.replace('{id}', moduleId).replace('{question}', DEFAULT_QUESTION)
  const result = spawnSync(command, { encoding: 'utf-8', shell: true })
  if (result.error) {
    log.warn(`CLI unavailable for module ${moduleId}: ${result.error.message}`)
    return null
  }
  if (result.status !== 0) {
    log.warn(`CLI failed for module ${moduleId}: ${result.stderr || result.stdout}`)
    return null
  }

  try {
    const payload = JSON.parse(result.stdout)
    if (payload?.status === 'error') {
      log.warn(`CLI failed for module ${moduleId}: ${payload.error ?? 'unknown error'}`)
      return null
    }
    return payload
  } catch (error) {
    log.warn(`Invalid JSON for module ${moduleId}: ${error.message}`)
    return null
  }
}

const runMcpProxy = async (moduleId) => {
  if (!MCP_ENDPOINT) return null
  try {
    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        tool: 'notebook_query',
        notebook_id: moduleId,
        query: DEFAULT_QUESTION,
      }),
    })
    if (!response.ok) {
      log.warn(`MCP proxy failed for module ${moduleId}: ${response.status}`)
      return null
    }
    return await response.json()
  } catch (error) {
    log.warn(`MCP proxy unavailable for module ${moduleId}: ${error.message}`)
    return null
  }
}

const runNotebooklm = async (moduleId) => {
  if (MCP_ENDPOINT) {
    const mcpPayload = await runMcpProxy(moduleId)
    if (mcpPayload) return mcpPayload
  }
  return runCli(moduleId)
}

const formatNotebooklmBlock = (moduleId, payload) => {
  const syncedAt = new Date().toISOString()
  const summary = payload?.summary ?? payload?.data?.summary ?? ''
  const qa = payload?.qa ?? payload?.data?.qa ?? []
  const qaLines = Array.isArray(qa)
    ? qa
        .map((item) => {
          const question = item.question ?? item.q ?? ''
          const answer = item.answer ?? item.a ?? ''
          if (!question && !answer) return null
          return `- **Q:** ${question}\n  **A:** ${answer}`
        })
        .filter(Boolean)
        .join('\n')
    : ''

  return [
    START_MARKER,
    `> NotebookLM module: \`${moduleId}\``,
    `> Last synced: ${syncedAt}`,
    '',
    '## NotebookLM Summary',
    summary || '_No summary returned._',
    '',
    '## NotebookLM Q&A',
    qaLines || '_No Q&A returned._',
    END_MARKER,
  ].join('\n')
}

const upsertNotebooklmBlock = (content, block) => {
  const regex = new RegExp(
    `${escapeRegex(START_MARKER)}[\\s\\S]*?${escapeRegex(END_MARKER)}`,
    'm'
  )
  if (regex.test(content)) {
    return content.replace(regex, block)
  }
  return `${content.trim()}\n\n${block}\n`
}

const syncFile = async (filePath) => {
  const raw = await fs.readFile(filePath, 'utf-8')
  const parsed = matter(raw)
  const moduleId = parsed.data?.notebooklmModuleId
  if (!moduleId) return

  const payload = await runNotebooklm(moduleId)
  if (!payload) return

  const block = formatNotebooklmBlock(moduleId, payload)
  const updated = upsertNotebooklmBlock(raw, block)
  if (updated !== raw) {
    await fs.writeFile(filePath, updated, 'utf-8')
    log.info(`Synced ${path.relative(process.cwd(), filePath)}`)
  }
}

const syncAll = async () => {
  try {
    const files = await getMdxFiles(CONTENT_DIR)
    await Promise.all(files.map(syncFile))
  } catch (error) {
    log.warn(`Sync skipped: ${error.message}`)
  }
}

syncAll()
