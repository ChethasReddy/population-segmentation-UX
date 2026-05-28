import { useState, useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { duration, ease, fadeUp } from './lib/motion'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { SegmentTabs } from './components/SegmentTabs'
import { SegmentProfile } from './components/SegmentProfile'
import { InsightGrid } from './components/InsightGrid'
import { CategoryFilter, FILTERS } from './components/CategoryFilter'
import { ConfidenceBadge } from './components/ConfidenceBadge'
import { EmptyState } from './components/EmptyState'
import { useInsights } from './hooks/useInsights'
import { PRODUCTS, OBJECTIVES, SEGMENTS, CATEGORIES, DEFAULT_STATE } from './lib/data'

export default function App() {
  const reduceMotion = useReducedMotion()
  const [product, setProduct] = useState(DEFAULT_STATE.product)
  const [objective, setObjective] = useState(DEFAULT_STATE.objective)
  const [activeSegments, setActiveSegments] = useState(DEFAULT_STATE.activeSegments)
  const [selectedSegment, setSelectedSegment] = useState(DEFAULT_STATE.selectedSegment)
  const [activeFilter, setActiveFilter] = useState('all')

  const { bySegment, isRunning, runForSegment, runForAllSegments } = useInsights()

  const productObj = PRODUCTS.find((p) => p.id === product)
  const objectiveObj = OBJECTIVES.find((o) => o.id === objective)
  const currentSegmentState = bySegment[selectedSegment]
  const confidence = currentSegmentState?.insights?.confidence

  const filteredCategories = (() => {
    const filter = FILTERS.find((f) => f.id === activeFilter)
    if (!filter?.categories) return CATEGORIES
    return CATEGORIES.filter((c) => filter.categories.includes(c.id))
  })()

  // Fire all 4 segment calls on first load
  useEffect(() => {
    const segs = SEGMENTS.filter((s) => DEFAULT_STATE.activeSegments.includes(s.id))
    runForAllSegments(productObj, objectiveObj, segs)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSegmentToggle(segId) {
    setActiveSegments((prev) => {
      if (prev.includes(segId)) {
        const next = prev.filter((id) => id !== segId)
        if (next.length === 0) {
          setSelectedSegment(null)
        } else if (selectedSegment === segId) {
          setSelectedSegment(next[0])
        }
        return next
      } else {
        const seg = SEGMENTS.find((s) => s.id === segId)
        if (seg && !bySegment[segId]?.insights) {
          runForSegment({ product: productObj, objective: objectiveObj, segment: seg })
        }
        return [...prev, segId]
      }
    })
  }

  function handleRun() {
    const segs = SEGMENTS.filter((s) => activeSegments.includes(s.id))
    runForAllSegments(productObj, objectiveObj, segs)
  }

  return (
    <div className="flex h-screen bg-surface-base overflow-hidden">
      <Sidebar
        product={product}
        objective={objective}
        activeSegments={activeSegments}
        isRunning={isRunning}
        onProductChange={setProduct}
        onObjectiveChange={setObjective}
        onSegmentToggle={handleSegmentToggle}
        onRun={handleRun}
      />

      <motion.div
        className="flex flex-col flex-1 min-w-0"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: duration.normal, delay: 0.06, ease }}
      >
        <TopBar
          product={product}
          objective={objective}
          activeSegments={activeSegments}
          bySegment={bySegment}
        />
        <SegmentTabs
          activeSegments={activeSegments}
          selectedSegment={selectedSegment}
          bySegment={bySegment}
          onSelect={setSelectedSegment}
        />

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto">
          {activeSegments.length === 0 ? (
            <EmptyState />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSegment}
                initial={reduceMotion ? false : fadeUp.initial}
                animate={fadeUp.animate}
                exit={reduceMotion ? undefined : fadeUp.exit}
                transition={{ duration: duration.fast, ease }}
                className="p-6 flex flex-col gap-5"
              >
                {/* Radar + opportunity bars */}
                <SegmentProfile segmentId={selectedSegment} />

                {/* Filter pills + confidence badge */}
                <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                  <CategoryFilter
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                  />
                  <ConfidenceBadge confidence={confidence} />
                </div>

                {/* Card grid */}
                <InsightGrid
                  segmentState={currentSegmentState}
                  categories={filteredCategories}
                />
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </motion.div>
    </div>
  )
}
