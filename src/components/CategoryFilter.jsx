import { cn } from '../lib/utils'

export const FILTERS = [
  { id: 'all',        label: 'All',        categories: null },
  { id: 'swot',       label: 'SWOT',       categories: ['strengths', 'weaknesses', 'opportunities', 'threats'] },
  { id: 'okrs',       label: 'OKRs',       categories: ['okrs'] },
  { id: 'persona',    label: 'Persona',    categories: ['persona'] },
  { id: 'channels',   label: 'Channels',   categories: ['channels'] },
  { id: 'investment', label: 'Investment', categories: ['investment'] },
]

export function CategoryFilter({ activeFilter, onFilterChange }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {FILTERS.map((f) => (
        <button
          key={f.id}
          onClick={() => onFilterChange(f.id)}
          className={cn(
            'px-3 py-1 rounded-full text-[12px] transition-colors border whitespace-nowrap',
            activeFilter === f.id
              ? 'bg-ink-900 text-white border-ink-900'
              : 'bg-surface-raised text-ink-500 border-border hover:border-ink-300 hover:text-ink-700'
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
