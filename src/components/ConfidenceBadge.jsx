import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '../lib/utils'
import { duration, ease } from '../lib/motion'

export function ConfidenceBadge({ confidence }) {
  const reduceMotion = useReducedMotion()

  if (confidence == null) return null

  const pct = Math.round(confidence * 100)

  const { colorClass, bgClass } =
    confidence >= 0.85
      ? { colorClass: 'text-strengths-fg', bgClass: 'bg-strengths-bg' }
      : confidence >= 0.65
        ? { colorClass: 'text-weaknesses-fg', bgClass: 'bg-weaknesses-bg' }
        : { colorClass: 'text-threats-fg',    bgClass: 'bg-threats-bg' }

  return (
    <motion.div
      className="relative group"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: duration.normal, ease }}
    >
      <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-default', bgClass)}>
        <span className={cn('text-[11px] font-medium', colorClass)}>
          {pct}% confidence
        </span>
      </div>
      <div className="absolute right-0 top-full mt-1.5 w-60 rounded-lg border border-border bg-surface-raised shadow-md p-2.5 text-[11px] text-ink-500 leading-relaxed invisible group-hover:visible z-20 pointer-events-none">
        Self-reported confidence from the model. Real logprob-based confidence is on the roadmap (requires OpenAI provider).
      </div>
    </motion.div>
  )
}
