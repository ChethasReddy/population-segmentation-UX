import { useState, useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { duration, ease, fadeUp } from './lib/motion'
import { Sidebar } from './components/Sidebar'
import { SegmentHeader } from './components/SegmentHeader'
import { SegmentProfile } from './components/SegmentProfile'
import { InsightGrid } from './components/InsightGrid'
import { CategoryFilter, FILTERS } from './components/CategoryFilter'
import { EmptyState } from './components/EmptyState'
import { useInsights } from './hooks/useInsights'
import { PRODUCTS, OBJECTIVES, SEGMENTS, CATEGORIES, DEFAULT_STATE } from './lib/data'

export default function App() {
  const reduceMotion = useReducedMotion()
  const [product, setProduct] = useState(DEFAULT_STATE.product)
  const [objective, setObjective] = useState(DEFAULT_STATE.objective)
  const [activeSegments, setActiveSegments] = useState(DEFAULT_STATE.activeSegments)
  const [selectedSegment, setSelectedSegment] = useState(DEFAULT_STATE.selectedSegment)
  const [activeFilter, setActiveFilter] = useState('overview')
  const [isCompareEnabled, setIsCompareEnabled] = useState(false)

  const { bySegment, isRunning, runForSegment, runForAllSegments } = useInsights()

  const productObj = PRODUCTS.find((p) => p.id === product)
  const objectiveObj = OBJECTIVES.find((o) => o.id === objective)
  const currentSegmentState = bySegment[selectedSegment]

  const filteredCategories = (() => {
    const filter = FILTERS.find((f) => f.id === activeFilter)
    if (!filter?.categories) return CATEGORIES
    return CATEGORIES.filter((c) => filter.categories.includes(c.id))
  })()

  useEffect(() => {
    const segs = SEGMENTS.filter((s) => DEFAULT_STATE.activeSegments.includes(s.id))
    runForAllSegments(productObj, objectiveObj, segs)
  }, [])

  function handleSegmentSelect(segId) {
    setSelectedSegment(segId)
    if (!activeSegments.includes(segId)) {
      const seg = SEGMENTS.find((s) => s.id === segId)
      if (seg && !bySegment[segId]?.insights) {
        runForSegment({ product: productObj, objective: objectiveObj, segment: seg })
      }
      setActiveSegments((prev) => [...prev, segId])
    }
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
        selectedSegment={selectedSegment}
        isRunning={isRunning}
        onProductChange={setProduct}
        onObjectiveChange={setObjective}
        onSegmentSelect={handleSegmentSelect}
        onRun={handleRun}
      />

      <motion.div
        className="flex flex-col flex-1 min-w-0"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: duration.normal, delay: 0.06, ease }}
      >
        {selectedSegment ? (
          <>
            <SegmentHeader
              segmentId={selectedSegment}
              segmentState={currentSegmentState}
              activeSegments={activeSegments}
              bySegment={bySegment}
              isCompareEnabled={isCompareEnabled}
              onToggleCompare={() => setIsCompareEnabled((prev) => !prev)}
            />
            <div className="px-8 py-4 border-b border-border bg-surface-raised">
              <SegmentProfile segmentId={selectedSegment} />
            </div>
            <CategoryFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
          </>
        ) : null}

        <main className="flex-1 overflow-y-auto bg-surface-base">
          {activeSegments.length === 0 || !selectedSegment ? (
            <EmptyState />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedSegment}-${activeFilter}`}
                initial={reduceMotion ? false : fadeUp.initial}
                animate={fadeUp.animate}
                exit={reduceMotion ? undefined : fadeUp.exit}
                transition={{ duration: duration.fast, ease }}
                className="px-8 py-6 flex flex-col gap-6"
              >
                <InsightGrid
                  segmentState={currentSegmentState}
                  categories={filteredCategories}
                />

                {isCompareEnabled && (
                  <div className="rounded-xl border border-border bg-surface-raised p-4 text-sm text-ink-500">
                    Compare view is coming soon.
                  </div>
                )}

                <p className="text-center text-[11px] text-ink-400 pt-2 pb-4">
                  AI-generated insights. Review and validate before use.
                </p>
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </motion.div>
    </div>
  )
}
