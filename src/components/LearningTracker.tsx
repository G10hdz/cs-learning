import { useState } from 'react'
import { useTracker } from '../lib/useTracker'
import type { TrackerItemType, TrackerStatus, TrackerItem } from '../lib/useTracker'

const TYPE_EMOJI: Record<TrackerItemType, string> = {
  book: '📚',
  article: '📄',
  video: '🎬',
  podcast: '🎧',
  paper: '🔬',
  course: '🎓',
}

const STATUS_LABELS: Record<TrackerStatus, string> = {
  want: 'Want',
  active: 'Reading',
  done: 'Done',
}

const STATUS_COLORS: Record<TrackerStatus, string> = {
  want: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  active: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200',
  done: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200',
}

const EMPTY_FORM = {
  title: '',
  type: 'book' as TrackerItemType,
  url: '',
  notebooklmId: '',
  status: 'want' as TrackerStatus,
  notes: '',
  tags: [] as string[],
}

export default function LearningTracker() {
  const { items, addItem, updateStatus, removeItem } = useTracker()
  const [filter, setFilter] = useState<TrackerStatus | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<TrackerItemType | 'all'>('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const visible = items.filter(
    (i) =>
      (filter === 'all' || i.status === filter) &&
      (typeFilter === 'all' || i.type === typeFilter)
  )

  const handleAdd = () => {
    if (!form.title.trim()) return
    addItem({
      title: form.title.trim(),
      type: form.type,
      url: form.url || undefined,
      notebooklmId: form.notebooklmId || undefined,
      status: form.status,
      notes: form.notes || undefined,
      tags: form.tags,
    })
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const nextStatus = (s: TrackerStatus): TrackerStatus =>
    s === 'want' ? 'active' : s === 'active' ? 'done' : 'done'

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Learning Tracker</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          + Add Item
        </button>
      </div>

      {/* Filters — status pills horizontal, type in dropdown */}
      <div className="flex flex-wrap items-center gap-2">
        {(['all', 'want', 'active', 'done'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-2 rounded-full text-xs font-medium transition-colors min-h-[44px] ${
              filter === s
                ? 'bg-indigo-600 text-white'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            {s === 'all' ? 'All' : STATUS_LABELS[s]} ({s === 'all' ? items.length : items.filter((i) => i.status === s).length})
          </button>
        ))}
        <span className="w-px bg-zinc-200 dark:bg-zinc-700 mx-1 h-6 self-center" />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TrackerItemType | 'all')}
          className="px-3 py-2 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-0 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All types</option>
          {(['book', 'article', 'video', 'podcast', 'paper', 'course'] as TrackerItemType[]).map((t) => (
            <option key={t} value={t}>{TYPE_EMOJI[t]} {t}</option>
          ))}
        </select>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 bg-indigo-50 dark:bg-indigo-950/30 space-y-3">
          <input
            placeholder="Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <div className="flex flex-wrap gap-2">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as TrackerItemType })}
              className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
            >
              {(['book', 'article', 'video', 'podcast', 'paper', 'course'] as TrackerItemType[]).map((t) => (
                <option key={t} value={t}>{TYPE_EMOJI[t]} {t}</option>
              ))}
            </select>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as TrackerStatus })}
              className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm"
            >
              <option value="want">Want</option>
              <option value="active">Reading</option>
              <option value="done">Done</option>
            </select>
          </div>
          <input
            placeholder="URL (optional)"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            placeholder="NotebookLM ID (optional — e.g. tones-pinyin)"
            value={form.notebooklmId}
            onChange={(e) => setForm({ ...form, notebooklmId: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!form.title.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }}
              className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-full text-sm font-semibold hover:opacity-80 transition-opacity"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Items list */}
      <div className="space-y-2">
        {visible.length === 0 && (
          <p className="text-sm text-zinc-400 dark:text-zinc-600 py-6 text-center">
            {items.length === 0 ? 'No items yet — add a book, article, or video to track.' : 'No items match the current filter.'}
          </p>
        )}
        {visible.map((item: TrackerItem) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 border border-zinc-100 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
          >
            <span className="text-xl mt-0.5 select-none">{TYPE_EMOJI[item.type]}</span>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-sm text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate"
                  >
                    {item.title}
                  </a>
                ) : (
                  <span className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">{item.title}</span>
                )}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]}`}>
                  {STATUS_LABELS[item.status]}
                </span>
                {item.notebooklmId && (
                  <a
                    href={`https://notebooklm.google.com/notebook/${item.notebooklmId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200 hover:opacity-80"
                  >
                    🎧 NLM
                  </a>
                )}
              </div>
              {item.notes && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">{item.notes}</p>
              )}
            </div>
            <div className="flex gap-1 max-sm:opacity-100 group-hover:opacity-100 opacity-0 transition-opacity">
              {item.status !== 'done' && (
                <button
                  onClick={() => updateStatus(item.id, nextStatus(item.status))}
                  className="px-2 py-1 rounded text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200 hover:opacity-80"
                  title={item.status === 'want' ? 'Start reading' : 'Mark done'}
                >
                  {item.status === 'want' ? '▶' : '✓'}
                </button>
              )}
              <button
                onClick={() => removeItem(item.id)}
                className="px-2 py-1 rounded text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 hover:opacity-80"
                title="Remove"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
