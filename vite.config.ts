import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import { VitePWA } from 'vite-plugin-pwa'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, join, relative } from 'node:path'
import type { Node } from 'unist'

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

const remarkWikiLinks = () => (tree: Node) => {
  visit(
    tree,
    'text',
    (
      node: { value?: string },
      index: number | null,
      parent: { children: unknown[] } | undefined
    ) => {
      if (!parent || typeof node.value !== 'string') return
      const matches = [...node.value.matchAll(/\[\[([^\]]+)\]\]/g)]
      if (matches.length === 0 || typeof index !== 'number') return
      const parts: Array<{
        type: string
        value?: string
        url?: string
        children?: Array<{ type: string; value: string }>
      }> = []
      let lastIndex = 0
      matches.forEach((match) => {
        const [full, label] = match
        const start = match.index ?? 0
        if (start > lastIndex) {
          parts.push({ type: 'text', value: node.value?.slice(lastIndex, start) })
        }
        const slug = toSlug(label)
        parts.push({
          type: 'link',
          url: `/roadmap/${slug}`,
          children: [{ type: 'text', value: label }],
        })
        lastIndex = start + full.length
      })
      if (lastIndex < node.value.length) {
        parts.push({ type: 'text', value: node.value.slice(lastIndex) })
      }
      parent.children.splice(index, 1, ...parts)
    }
  )
}

const VIRTUAL_ID = 'virtual:mdx-raw'
const RESOLVED_VIRTUAL_ID = '\0' + VIRTUAL_ID

const mdxRawPlugin = (): Plugin => {
  const contentDir = resolve(__dirname, 'src/content')
  return {
    name: 'mdx-raw-virtual',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_VIRTUAL_ID
      return null
    },
    load(id) {
      if (id !== RESOLVED_VIRTUAL_ID) return null
      const walkDir = (dir: string): string[] => {
        let results: string[] = []
        for (const entry of readdirSync(dir)) {
          const fullPath = join(dir, entry)
          if (statSync(fullPath).isDirectory()) {
            results = results.concat(walkDir(fullPath))
          } else if (entry.endsWith('.mdx')) {
            results.push(fullPath)
          }
        }
        return results
      }
      const files = walkDir(contentDir)
      const entries = files.map((f) => {
        const raw = readFileSync(f, 'utf-8')
        const relPath = './' + relative(contentDir, f)
        return [relPath, raw]
      })
      return `export default ${JSON.stringify(Object.fromEntries(entries))}`
    },
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.mdx') && file.includes('src/content')) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_ID)
        if (mod) return [mod]
      }
      return undefined
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    mdxRawPlugin(),
    mdx({
      remarkPlugins: [
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: 'frontmatter' }],
        remarkGfm,
        remarkWikiLinks,
      ],
    }),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        globIgnores: ['mit-*/**', '**/*.pdf'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/mit-/],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => /^\/mit-(18\.01|18\.02|18\.06)\//.test(url.pathname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'mit-ocw',
              expiration: { maxEntries: 100000, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'images', expiration: { maxEntries: 200 } },
          },
          {
            urlPattern: ({ request }) => request.destination === 'font',
            handler: 'CacheFirst',
            options: { cacheName: 'fonts', expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
      manifest: {
        name: 'CS Learning Roadmap',
        short_name: 'CS Roadmap',
        description: 'Offline CS/AI/Math learning roadmap with MIT OCW courses',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone'],
        orientation: 'any',
        scope: '/',
        start_url: '/',
        lang: 'en',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: '/pwa-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          { name: 'CS/AI Track', url: '/?track=cs-ai' },
          { name: 'Math Track', url: '/?track=math' },
          { name: 'Search', url: '/?focus=search' },
        ],
        categories: ['education', 'productivity'],
      },
      devOptions: { enabled: false },
    }),
  ],
})
