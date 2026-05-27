import { Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { PRODUCTS, OBJECTIVES, SEGMENTS } from '../lib/data'
import { cn } from '../lib/utils'

const SEG_COLORS = {
  seg1: '#7F77DD',
  seg2: '#1D9E75',
  seg3: '#BA7517',
  seg4: '#D4537E',
}

export function Sidebar({
  product, objective, activeSegments, isRunning,
  onProductChange, onObjectiveChange, onSegmentToggle, onRun,
}) {
  return (
    <aside className="w-60 shrink-0 flex flex-col h-screen border-r border-border bg-surface-raised">
      <div className="p-5 flex flex-col gap-5 flex-1 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 pt-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#7F77DD' }} />
          <span className="text-[13px] font-medium text-ink-900">Subconscious.ai</span>
        </div>

        {/* Product */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider text-ink-500">Product</label>
          <Select value={product} onValueChange={onProductChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRODUCTS.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Objective */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-wider text-ink-500">Objective</label>
          <Select value={objective} onValueChange={onObjectiveChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OBJECTIVES.map((o) => (
                <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Segments */}
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase tracking-wider text-ink-500">Segments</label>
          <div className="flex flex-col gap-1">
            {SEGMENTS.map((seg) => {
              const active = activeSegments.includes(seg.id)
              const color = SEG_COLORS[seg.color]
              return (
                <button
                  key={seg.id}
                  onClick={() => onSegmentToggle(seg.id)}
                  className={cn(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors',
                    active
                      ? 'bg-surface-sunken text-ink-900'
                      : 'text-ink-500 hover:bg-surface-sunken hover:text-ink-700'
                  )}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0 transition-colors"
                    style={{ backgroundColor: active ? color : '#A8A8B0' }}
                  />
                  <span className="text-[13px] leading-tight">{seg.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Run button */}
      <div className="p-5 border-t border-border">
        <Button className="w-full" onClick={onRun} disabled={isRunning}>
          {isRunning ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Running…
            </>
          ) : (
            'Run analysis'
          )}
        </Button>
      </div>
    </aside>
  )
}
