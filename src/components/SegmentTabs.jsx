import { motion, useReducedMotion } from 'framer-motion'
import { SEGMENTS } from '../lib/data'
import { duration, ease, spring, tap } from '../lib/motion'

const SEG_COLORS = {
  seg1: '#7F77DD',
  seg2: '#1D9E75',
  seg3: '#BA7517',
  seg4: '#D4537E',
}

export function SegmentTabs({ activeSegments, selectedSegment, bySegment, onSelect }) {
  const reduceMotion = useReducedMotion()
  const visible = SEGMENTS.filter((s) => activeSegments.includes(s.id))

  return (
    <motion.div
      className="flex items-center gap-0 px-6 border-b border-border bg-surface-raised shrink-0 overflow-x-auto"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: duration.normal, delay: 0.05, ease }}
    >
      {visible.map((seg, index) => {
        const isActive = seg.id === selectedSegment
        const status = bySegment[seg.id]?.status
        const color = SEG_COLORS[seg.color]

        return (
          <motion.button
            key={seg.id}
            onClick={() => onSelect(seg.id)}
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.normal, delay: 0.04 * index, ease }}
            whileTap={reduceMotion ? undefined : tap}
            className={[
              'relative flex items-center gap-2 px-4 py-3 text-[13px] -mb-px transition-colors whitespace-nowrap',
              isActive
                ? 'text-ink-900 font-medium'
                : 'text-ink-500 hover:text-ink-700',
            ].join(' ')}
          >
            {isActive && (
              <motion.span
                layoutId="segment-tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink-900 rounded-full"
                transition={reduceMotion ? { duration: 0 } : spring}
              />
            )}
            <motion.span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: color }}
              animate={reduceMotion ? undefined : { scale: isActive ? 1.2 : 1 }}
              transition={{ duration: duration.fast, ease }}
            />
            {seg.label}
            {status === 'loading' && (
              <span className="w-1.5 h-1.5 rounded-full bg-ink-300 animate-pulse ml-0.5" />
            )}
          </motion.button>
        )
      })}
    </motion.div>
  )
}
