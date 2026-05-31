import { useEffect, useMemo, useState } from 'react'
import MiniSearch, { type SearchResult } from 'minisearch'
import { Link } from 'react-router-dom'

export type SearchDocument = {
  id: string
  title: string
  tags: string[]
  content: string
  slug: string
  phase?: number
}

type Props = {
  documents: SearchDocument[]
}

const useDebouncedValue = (value: string, delay = 250) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

const highlight = (text: string, query: string) => {
  if (!query) return text
  const tokens = query.split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return text
  const escaped = tokens.map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const splitRegex = new RegExp(`(${escaped.join('|')})`, 'gi')
  const lowered = tokens.map((token) => token.toLowerCase())
  return text.split(splitRegex).map((part, index) =>
    lowered.includes(part.toLowerCase()) ? (
      <mark key={`${part}-${index}`} className="rounded bg-indigo-100 px-1 text-indigo-900">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  )
}

export const SearchBar = ({ documents }: Props) => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query)

  const miniSearch = useMemo(() => {
    const search = new MiniSearch({
      fields: ['title', 'tags', 'content', 'phase'],
      storeFields: ['title', 'slug', 'tags', 'phase'],
      searchOptions: { prefix: true },
    })
    search.addAll(documents)
    return search
  }, [documents])

  const results = useMemo(() => {
    if (!debouncedQuery) return [] as Array<SearchResult>
    return miniSearch.search(debouncedQuery, { fuzzy: 0.2 })
  }, [miniSearch, debouncedQuery])

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="search">
        Search roadmap
      </label>
      <input
        id="search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search topics, tags, or notes"
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-800 dark:bg-slate-900"
        aria-label="Search roadmap content"
      />
      {debouncedQuery && (
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {results.length === 0 ? (
            <p className="text-sm text-slate-500">No matches found.</p>
          ) : (
            <ul className="space-y-2">
              {results.map((result) => (
                <li key={result.id} className="text-sm">
                  <Link
                    to={`/roadmap/${result.slug}`}
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {highlight(result.title as string, debouncedQuery)}
                  </Link>
                  <div className="text-xs text-slate-500">
                    {(result.tags as string[])?.join(' · ') ?? ''}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
