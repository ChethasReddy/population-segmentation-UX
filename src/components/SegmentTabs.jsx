import { SEGMENTS } from '../lib/data'

const SEG_COLORS = {
  seg1: '#7F77DD',
  seg2: '#1D9E75',
  seg3: '#BA7517',
  seg4: '#D4537E',
}

export function SegmentTabs({ activeSegments, selectedSegment, bySegment, onSelect }) {
  const visible = SEGMENTS.filter((s) => activeSegments.includes(s.id))

  return (
    <div className="flex items-center gap-0 px-6 border-b border-border bg-surface-raised shrink-0 overflow-x-auto">
      {visible.map((seg) => {
        const isActive = seg.id === selectedSegment
        const status = bySegment[seg.id]?.status
        const color = SEG_COLORS[seg.color]

        return (
          <button
            key={seg.id}
            onClick={() => onSelect(seg.id)}
            className={[
              'flex items-center gap-2 px-4 py-3 text-[13px] border-b-2 -mb-px transition-colors whitespace-nowrap',
              isActive
                ? 'border-ink-900 text-ink-900 font-medium'
                : 'border-transparent text-ink-500 hover:text-ink-700',
            ].join(' ')}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            {seg.label}
            {status === 'loading' && (
              <span className="w-1.5 h-1.5 rounded-full bg-ink-300 animate-pulse ml-0.5" />
            )}
          </button>
        )
      })}
    </div>
  )
}
