import { useState, useCallback, useRef } from 'react'
import { generateSegmentInsights } from '../lib/insights'
import { runWithConcurrency } from '../lib/utils'
import { SEGMENTS } from '../lib/data'

const makeCacheKey = (productId, objectiveId, segmentId) =>
  `${productId}:${objectiveId}:${segmentId}`

const LOADING = { status: 'loading', insights: null, error: null }
const idleState = () => ({ status: 'idle', insights: null, error: null })

const allSegmentIds = () => SEGMENTS.map((s) => s.id)

export function useInsights() {
  const cacheRef = useRef(new Map())
  const pendingRef = useRef(new Set())
  const [bySegment, setBySegment] = useState({})
  const [isRunning, setIsRunning] = useState(false)

  const setSegmentEntry = useCallback((segmentId, entry) => {
    setBySegment((prev) => ({ ...prev, [segmentId]: entry }))
  }, [])

  const syncDisplay = useCallback((productId, objectiveId, segmentIds) => {
    setBySegment((prev) => {
      const next = { ...prev }
      segmentIds.forEach((segId) => {
        const key = makeCacheKey(productId, objectiveId, segId)
        if (cacheRef.current.has(key)) {
          next[segId] = cacheRef.current.get(key)
        } else {
          next[segId] = idleState()
        }
      })
      return next
    })
  }, [])

  const getSegmentState = useCallback((productId, objectiveId, segmentId) => {
    const key = makeCacheKey(productId, objectiveId, segmentId)
    return cacheRef.current.get(key) ?? idleState()
  }, [])

  const resolveSegmentState = useCallback(
    (productId, objectiveId, segmentId) => {
      const cached = getSegmentState(productId, objectiveId, segmentId)
      const live = bySegment[segmentId]

      if (live?.status === 'loading' || live?.status === 'error') return live
      if (live?.status === 'ready') return live
      if (pendingRef.current.has(segmentId)) return LOADING
      if (cached?.status === 'ready') return cached
      return live ?? cached
    },
    [bySegment, getSegmentState],
  )

  const hydrateSegment = useCallback(
    (productId, objectiveId, segmentId) => {
      const key = makeCacheKey(productId, objectiveId, segmentId)
      if (cacheRef.current.has(key)) {
        setSegmentEntry(segmentId, cacheRef.current.get(key))
      }
    },
    [setSegmentEntry],
  )

  const runForSegment = useCallback(
    async (ctx) => {
      const cacheKey = makeCacheKey(
        ctx.product.id,
        ctx.objective.id,
        ctx.segment.id,
      )
      if (cacheRef.current.has(cacheKey)) return

      pendingRef.current.add(ctx.segment.id)
      setSegmentEntry(ctx.segment.id, LOADING)
      try {
        const insights = await generateSegmentInsights(ctx)
        const entry = { status: 'ready', insights, error: null }
        cacheRef.current.set(cacheKey, entry)
        setSegmentEntry(ctx.segment.id, entry)
      } catch (err) {
        setSegmentEntry(ctx.segment.id, {
          status: 'error',
          insights: null,
          error: err.message,
        })
      } finally {
        pendingRef.current.delete(ctx.segment.id)
      }
    },
    [setSegmentEntry],
  )

  const runForAllSegments = useCallback(
    async (product, objective, segments) => {
      const segmentIds = segments.map((s) => s.id)
      const tasks = segments
        .filter((segment) => {
          const key = makeCacheKey(product.id, objective.id, segment.id)
          return !cacheRef.current.has(key)
        })
        .map((segment) => async () => {
          const cacheKey = makeCacheKey(product.id, objective.id, segment.id)
          try {
            const insights = await generateSegmentInsights({
              product,
              objective,
              segment,
            })
            const entry = { status: 'ready', insights, error: null }
            cacheRef.current.set(cacheKey, entry)
            setSegmentEntry(segment.id, entry)
          } catch (err) {
            setSegmentEntry(segment.id, {
              status: 'error',
              insights: null,
              error: err.message,
            })
          } finally {
            pendingRef.current.delete(segment.id)
          }
        })

      if (tasks.length === 0) {
        syncDisplay(product.id, objective.id, allSegmentIds())
        return
      }

      setIsRunning(true)
      segments.forEach((seg) => {
        const key = makeCacheKey(product.id, objective.id, seg.id)
        if (!cacheRef.current.has(key)) {
          pendingRef.current.add(seg.id)
          setSegmentEntry(seg.id, LOADING)
        }
      })

      await runWithConcurrency(tasks, 2)
      setIsRunning(false)
      syncDisplay(product.id, objective.id, allSegmentIds())
    },
    [setSegmentEntry, syncDisplay],
  )

  return {
    bySegment,
    isRunning,
    runForSegment,
    runForAllSegments,
    syncDisplay,
    getSegmentState,
    resolveSegmentState,
    hydrateSegment,
  }
}
