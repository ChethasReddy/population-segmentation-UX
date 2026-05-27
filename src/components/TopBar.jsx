import { Download } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { PRODUCTS, OBJECTIVES, CATEGORIES } from '../lib/data'

export function TopBar({ product, objective, activeSegments, bySegment }) {
  const productLabel = PRODUCTS.find((p) => p.id === product)?.label || product
  const objectiveLabel = OBJECTIVES.find((o) => o.id === objective)?.label || objective

  function handleExportJSON() {
    const data = {}
    activeSegments.forEach((id) => {
      if (bySegment[id]?.insights) data[id] = bySegment[id].insights
    })
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-surface-raised shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-sm text-ink-500">
          {productLabel}
          <span className="text-ink-300 mx-1.5">·</span>
          <span className="font-medium text-ink-900">{objectiveLabel}</span>
        </span>
        <Badge>
          {CATEGORIES.length} insights · {activeSegments.length} segment{activeSegments.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleExportJSON}>
          <Download className="h-3.5 w-3.5" />
          Export JSON
        </Button>
      </div>
    </div>
  )
}
