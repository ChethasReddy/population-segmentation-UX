import { useState, useCallback } from 'react'
import { generateSegmentInsights } from '../lib/insights'
import { runWithConcurrency } from '../lib/utils'

export function useInsights() {
  // Shape: { [segmentId]: { status: 'idle'|'loading'|'ready'|'error', insights: object|null, error: string|null } }
  const [bySegment, setBySegment] = useState({})
  const [isRunning, setIsRunning] = useState(false)

  const setSegmentState = useCallback((segmentId, patch) => {
    setBySegment((prev) => ({
      ...prev,
      [segmentId]: { ...(prev[segmentId] || {}), ...patch },
    }))
  }, [])

  const runForSegment = useCallback(async (ctx) => {
    setSegmentState(ctx.segment.id, { status: 'loading', error: null })
    try {
      const insights = await generateSegmentInsights(ctx)
      setSegmentState(ctx.segment.id, { status: 'ready', insights, error: null })
    } catch (err) {
      setSegmentState(ctx.segment.id, { status: 'error', insights: null, error: err.message })
    }
  }, [setSegmentState])

  const runForAllSegments = useCallback(async (product, objective, segments) => {
    setIsRunning(true)
    segments.forEach((seg) => setSegmentState(seg.id, { status: 'loading', error: null }))
    const tasks = segments.map((segment) => async () => {
      try {
        const insights = await generateSegmentInsights({ product, objective, segment })
        setSegmentState(segment.id, { status: 'ready', insights, error: null })
      } catch (err) {
        setSegmentState(segment.id, { status: 'error', insights: null, error: err.message })
      }
    })

    await runWithConcurrency(tasks, 2)
    setIsRunning(false)
  }, [setSegmentState])

  return { bySegment, isRunning, runForSegment, runForAllSegments }
}
