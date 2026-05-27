import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { SegmentTabs } from './components/SegmentTabs'
import { SegmentProfile } from './components/SegmentProfile'
import { InsightGrid } from './components/InsightGrid'
import { CategoryFilter, FILTERS } from './components/CategoryFilter'
import { ConfidenceBadge } from './components/ConfidenceBadge'
import { useInsights } from './hooks/useInsights'
import { PRODUCTS, OBJECTIVES, SEGMENTS, CATEGORIES, DEFAULT_STATE } from './lib/data'

export default function App() {
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
        if (selectedSegment === segId && next.length > 0) setSelectedSegment(next[0])
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

      <div className="flex flex-col flex-1 min-w-0">
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

        {/* Main scrollable content — AnimatePresence fades between segments */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSegment}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="p-6 flex flex-col gap-5"
            >
              {/* Radar + opportunity bars */}
              <SegmentProfile segmentId={selectedSegment} />

              {/* Filter pills + confidence badge */}
              <div className="flex items-center justify-between gap-4">
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
        </main>
      </div>
    </div>
  )
}
