import { motion, useReducedMotion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Skeleton } from './ui/skeleton'
import * as LucideIcons from 'lucide-react'
import { cn } from '../lib/utils'
import { duration, ease, hoverLift } from '../lib/motion'

const COLOR_MAP = {
  strengths:     { bg: 'bg-strengths-bg',     fg: 'text-strengths-fg' },
  weaknesses:    { bg: 'bg-weaknesses-bg',     fg: 'text-weaknesses-fg' },
  opportunities: { bg: 'bg-opportunities-bg', fg: 'text-opportunities-fg' },
  threats:       { bg: 'bg-threats-bg',       fg: 'text-threats-fg' },
  okrs:          { bg: 'bg-okrs-bg',          fg: 'text-okrs-fg' },
  positioning:   { bg: 'bg-positioning-bg',   fg: 'text-positioning-fg' },
  persona:       { bg: 'bg-persona-bg',       fg: 'text-persona-fg' },
  investment:    { bg: 'bg-investment-bg',    fg: 'text-investment-fg' },
  channels:      { bg: 'bg-channels-bg',      fg: 'text-channels-fg' },
}

const PROSE =
  '[&_p]:m-0 [&_p+p]:mt-2.5 [&_ul]:mt-2 [&_ul]:mb-0 [&_ul]:pl-4 [&_ol]:mt-2 [&_ol]:mb-0 [&_ol]:pl-4 [&_li]:mt-1 [&_li:first-child]:mt-0'

const BODY = 'flex-1 min-h-[105px]'

export function InsightCard({ category, status, value, error }) {
  const reduceMotion = useReducedMotion()
  const colors = COLOR_MAP[category.color] || { bg: 'bg-surface-sunken', fg: 'text-ink-700' }
  const Icon = LucideIcons[category.icon] || LucideIcons.Zap

  return (
    <motion.div
      className="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-3 h-full"
      whileHover={reduceMotion ? undefined : { ...hoverLift, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
      transition={{ duration: duration.fast, ease }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <motion.div
          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${colors.bg}`}
          whileHover={reduceMotion ? undefined : { scale: 1.06 }}
          transition={{ duration: duration.fast, ease }}
        >
          <Icon className={`w-3.5 h-3.5 ${colors.fg}`} />
        </motion.div>
        <span className={`text-[10px] uppercase tracking-wider font-medium ${colors.fg}`}>
          {category.label}
        </span>
      </div>

      {/* Body */}
      {status === 'loading' && (
        <div className={cn('flex flex-col gap-2.5', BODY)}>
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-4/6" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      )}

      {status === 'error' && (
        <motion.div
          className={cn('rounded-lg bg-threats-bg px-3 py-2', BODY)}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.normal, ease }}
        >
          <p className="text-[12px] text-threats-fg">{error || 'Failed to load insight.'}</p>
        </motion.div>
      )}

      {status === 'ready' && category.id === 'okrs' && Array.isArray(value) && (
        <motion.ol
          className={cn(
            'flex flex-col gap-2 pl-4 list-decimal text-[13px] leading-relaxed text-ink-700',
            PROSE,
            BODY
          )}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.normal, ease }}
        >
          {value.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </motion.ol>
      )}

      {status === 'ready' && category.id !== 'okrs' && typeof value === 'string' && (
        <motion.div
          className={cn('text-[13px] leading-relaxed text-ink-700', PROSE, BODY)}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.normal, ease }}
        >
          <ReactMarkdown>{value}</ReactMarkdown>
        </motion.div>
      )}
    </motion.div>
  )
}
