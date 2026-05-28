import { useState, useEffect, useMemo, useCallback } from 'react'
import { Menu } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { duration, ease, fadeUp } from './lib/motion'
import { Sidebar } from './components/Sidebar'
import { SegmentHeader } from './components/SegmentHeader'
import { SegmentProfile } from './components/SegmentProfile'
import { InsightGrid } from './components/InsightGrid'
import { CategoryFilter, FILTERS } from './components/CategoryFilter'
import { EmptyState } from './components/EmptyState'
import { CompareView } from './components/compare/CompareView'
import { useInsights } from './hooks/useInsights'
import { PRODUCTS, OBJECTIVES, SEGMENTS, CATEGORIES, DEFAULT_STATE } from './lib/data'

export default function App() {
  const reduceMotion = useReducedMotion()
  const [product, setProduct] = useState(DEFAULT_STATE.product)
  const [objective, setObjective] = useState(DEFAULT_STATE.objective)
  const [activeSegments, setActiveSegments] = useState(DEFAULT_STATE.activeSegments)
  const [selectedSegment, setSelectedSegment] = useState(DEFAULT_STATE.selectedSegment)
  const [activeFilter, setActiveFilter] = useState('overview')
  const [activeView, setActiveView] = useState('insights')
  const [comparisonSegments, setComparisonSegments] = useState(
    DEFAULT_STATE.activeSegments.slice(0, 2),
  )
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { bySegment, isRunning, runForSegment, runForAllSegments } = useInsights()

  const productObj = PRODUCTS.find((p) => p.id === product)
  const objectiveObj = OBJECTIVES.find((o) => o.id === objective)
  const currentSegmentState = bySegment[selectedSegment]

  const orderedComparisonSegments = useMemo(
    () => SEGMENTS
      .filter((seg) => comparisonSegments.includes(seg.id))
      .map((seg) => seg.id),
    [comparisonSegments],
  )

  const ensureSegmentData = useCallback(
    (segmentId) => {
      const segment = SEGMENTS.find((s) => s.id === segmentId)
      if (segment && bySegment[segmentId]?.status !== 'ready') {
        runForSegment({
          product: productObj,
          objective: objectiveObj,
          segment,
        })
      }
    },
    [bySegment, productObj, objectiveObj, runForSegment],
  )

  const filteredCategories = (() => {
    const filter = FILTERS.find((f) => f.id === activeFilter)
    if (!filter?.categories) return CATEGORIES
    return CATEGORIES.filter((c) => filter.categories.includes(c.id))
  })()

  useEffect(() => {
    const segs = SEGMENTS.filter((s) => DEFAULT_STATE.activeSegments.includes(s.id))
    runForAllSegments(productObj, objectiveObj, segs)
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    function handleChange(event) {
      if (event.matches) setIsSidebarOpen(false)
    }
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  function handleComparisonSegmentsChange(segmentIds) {
    const ordered = SEGMENTS
      .filter((seg) => segmentIds.includes(seg.id))
      .map((seg) => seg.id)
    setComparisonSegments(ordered)
  }

  function handleNavigateCompare() {
    orderedComparisonSegments.forEach(ensureSegmentData)
    setActiveView('compare')
  }

  function handleSegmentSelect(segId) {
    setActiveView('insights')
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
    <div className="relative flex h-screen bg-surface-base overflow-hidden">
      {isSidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-ink-900/20 lg:hidden"
          aria-label="Close menu"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar
        product={product}
        objective={objective}
        selectedSegment={selectedSegment}
        activeView={activeView}
        isRunning={isRunning}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onProductChange={setProduct}
        onObjectiveChange={setObjective}
        onSegmentSelect={handleSegmentSelect}
        onNavigateCompare={handleNavigateCompare}
        onRun={handleRun}
      />

      <div className="flex flex-col flex-1 min-w-0 min-h-0">
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-surface-raised shrink-0">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-lg p-2 text-ink-600 hover:bg-surface-sunken"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-[15px] font-medium text-ink-900 truncate">
            Subconscious.ai
          </span>
        </div>

      <motion.div
        className="flex flex-col flex-1 min-w-0 min-h-0 overflow-y-auto bg-surface-sunken/60"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: duration.normal, delay: 0.06, ease }}
      >
        {activeView === 'compare' ? (
          <CompareView
            comparisonSegments={orderedComparisonSegments}
            activeSegments={activeSegments}
            bySegment={bySegment}
            onComparisonSegmentsChange={handleComparisonSegmentsChange}
            onEnsureSegmentData={ensureSegmentData}
            previousSegmentId={selectedSegment}
            onNavigateBack={() => setActiveView('insights')}
          />
        ) : (
          <>
            {selectedSegment ? (
              <>
                <SegmentHeader
                  segmentId={selectedSegment}
                  segmentState={currentSegmentState}
                  activeSegments={activeSegments}
                  bySegment={bySegment}
                />
                <div className="px-8 py-4 bg-transparent">
                  <SegmentProfile segmentId={selectedSegment} />
                </div>
                <CategoryFilter
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  confidence={currentSegmentState?.insights?.confidence}
                />
              </>
            ) : null}

            <main className="bg-transparent">
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
                  </motion.div>
                </AnimatePresence>
              )}
            </main>
          </>
        )}
      </motion.div>
      </div>
    </div>
  )
}
