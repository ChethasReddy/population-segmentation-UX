import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../lib/utils'
import { spring, tap } from '../lib/motion'

export const FILTERS = [
  { id: 'all',        label: 'All',        categories: null },
  { id: 'swot',       label: 'SWOT',       categories: ['strengths', 'weaknesses', 'opportunities', 'threats'] },
  { id: 'okrs',       label: 'OKRs',       categories: ['okrs'] },
  { id: 'persona',    label: 'Persona',    categories: ['persona'] },
  { id: 'channels',   label: 'Channels',   categories: ['channels'] },
  { id: 'investment', label: 'Investment', categories: ['investment'] },
]

export function CategoryFilter({ activeFilter, onFilterChange }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {FILTERS.map((f) => {
        const isActive = activeFilter === f.id
        return (
          <motion.button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            whileTap={reduceMotion ? undefined : tap}
            className={cn(
              'relative px-3 py-1 rounded-full text-[12px] border whitespace-nowrap transition-colors',
              isActive
                ? 'text-ink-900 border-border font-medium'
                : 'bg-surface-raised text-ink-500 border-border hover:border-ink-300 hover:text-ink-700',
            )}
          >
            {isActive && (
              <motion.span
                layoutId="category-filter-pill"
                className="absolute inset-0 rounded-full bg-surface-sunken border border-border"
                transition={reduceMotion ? { duration: 0 } : spring}
                style={{ zIndex: 0 }}
              />
            )}
            <span className="relative z-[1]">{f.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
