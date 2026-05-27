import { motion } from 'framer-motion'
import { InsightCard } from './InsightCard'
import { CATEGORIES } from '../lib/data'

export function InsightGrid({ segmentState }) {
  const status = segmentState?.status || 'loading'
  const insights = segmentState?.insights || null
  const error = segmentState?.error || null

  // Segment-level error (e.g. network failure before any cards)
  if (status === 'error' && !insights) {
    return (
      <div className="rounded-xl border border-border bg-threats-bg p-6 text-center">
        <p className="text-sm text-threats-fg font-medium mb-1">Analysis failed</p>
        <p className="text-[12px] text-threats-fg opacity-80">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {CATEGORIES.map((category, index) => {
        const value = insights?.[category.id]
        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.25,
              delay: status === 'ready' ? index * 0.04 : 0,
            }}
          >
            <InsightCard
              category={category}
              status={status}
              value={value}
              error={error}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
