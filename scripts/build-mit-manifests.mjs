import { readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const publicDir = resolve(__dirname, '..', 'public')
const courses = ['mit-18.01', 'mit-18.02', 'mit-18.06']

const ALLOWED_EXT = new Set([
  '.html',
  '.json',
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.css',
  '.js',
  '.pdf',
  '.mp4',
  '.webm',
  '.txt',
  '.ico',
])

function walkDir(dir, base) {
  const results = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walkDir(full, base))
    } else {
      const ext = entry.name.slice(entry.name.lastIndexOf('.')).toLowerCase()
      if (!ALLOWED_EXT.has(ext)) continue
      const relative = full.slice(base.length)
      const size = statSync(full).size
      results.push({ url: relative, size })
    }
  }
  return results
}

for (const course of courses) {
  const courseDir = join(publicDir, course)
  console.log(`Scanning ${course}...`)
  const files = walkDir(courseDir, publicDir)
    .filter((f) => f.size > 0)
    .sort((a, b) => a.url.localeCompare(b.url))

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0)
  const manifest = {
    course,
    totalBytes,
    fileCount: files.length,
    files,
  }

  const outPath = join(courseDir, '_offline-manifest.json')
  writeFileSync(outPath, JSON.stringify(manifest))
  console.log(
    `  ${course}: ${files.length} files, ${(totalBytes / 1024 / 1024).toFixed(1)} MB → ${outPath}`
  )
}

console.log('Done.')
