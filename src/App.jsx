import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { SegmentTabs } from './components/SegmentTabs'
import { InsightGrid } from './components/InsightGrid'
import { useInsights } from './hooks/useInsights'
import { PRODUCTS, OBJECTIVES, SEGMENTS, DEFAULT_STATE } from './lib/data'

export default function App() {
  const [product, setProduct] = useState(DEFAULT_STATE.product)
  const [objective, setObjective] = useState(DEFAULT_STATE.objective)
  const [activeSegments, setActiveSegments] = useState(DEFAULT_STATE.activeSegments)
  const [selectedSegment, setSelectedSegment] = useState(DEFAULT_STATE.selectedSegment)

  const { bySegment, isRunning, runForSegment, runForAllSegments } = useInsights()

  const productObj = PRODUCTS.find((p) => p.id === product)
  const objectiveObj = OBJECTIVES.find((o) => o.id === objective)

  // Fire all 4 segment calls on mount
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
        <main className="flex-1 overflow-y-auto p-6">
          <InsightGrid segmentState={bySegment[selectedSegment]} />
        </main>
      </div>
    </div>
  )
}
