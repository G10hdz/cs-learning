const TRACK_TABS = [
  {
    id: 'aws-mla',
    label: 'AWS',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 15a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2z" />
        <path d="M7 8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2" />
        <path d="M9 12h6" />
      </svg>
    ),
  },
  {
    id: 'cs-ai',
    label: 'CS/AI',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'mandarin',
    label: 'Mandarin',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 5h16c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2z" />
        <path d="M8 12h8M12 8v8" />
        <path d="M7 9l-3-3M17 9l3-3" />
      </svg>
    ),
  },
  {
    id: 'english',
    label: 'English',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 4 19.5v-15A2.5 2.5 0 0 6.5 2z" />
        <path d="M8 7h8M8 11h6M8 15h4" />
      </svg>
    ),
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        <path d="M12 11v6M9 14h6" />
      </svg>
    ),
  },
  {
    id: 'tracker',
    label: 'Tracker',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <path d="M9 9l2 2 4-4" />
      </svg>
    ),
  },
]

export default function TrackSelector({
  activeTrackId,
  onTrackChange,
}: {
  activeTrackId: string
  onTrackChange: (trackId: string) => void
}) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
      {TRACK_TABS.map((track) => (
        <button
          key={track.id}
          onClick={() => onTrackChange(track.id)}
          className={`px-4 py-2.5 rounded-full flex items-center gap-2 whitespace-nowrap transition-all snap-start flex-shrink-0 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none ${
            activeTrackId === track.id
              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md active:translate-y-[1px] scale-100'
              : 'bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 hover:shadow-sm'
          }`}
          style={{ minHeight: '44px' }}
        >
          <span className={`transition-transform duration-200 ${activeTrackId === track.id ? 'scale-110' : 'scale-100'}`}>
            {track.icon}
          </span>
          <span className="text-sm font-medium">{track.label}</span>
        </button>
      ))}
    </div>
  )
}
