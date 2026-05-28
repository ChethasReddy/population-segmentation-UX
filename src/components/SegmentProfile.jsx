import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { RADAR_DATA, SEGMENTS } from '../lib/data'

const SEG_COLORS = {
  seg1: '#7F77DD',
  seg2: '#1D9E75',
  seg3: '#BA7517',
  seg4: '#D4537E',
}

const RADAR_AXES = [
  { key: 'affinity',  label: 'Affinity' },
  { key: 'reach',     label: 'Reach' },
  { key: 'loyalty',   label: 'Loyalty' },
  { key: 'priceSens', label: 'Price Sens.' },
  { key: 'trendInfl', label: 'Trend Infl.' },
  { key: 'convVel',   label: 'Conv. Vel.' },
]

// Deterministic bar values — same segment always produces the same scores
function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

function getBarValues(segmentId) {
  const h = hashCode(segmentId)
  return [
    { label: 'Brand Fit',       value: 40 + (h % 50),          type: 'segment' },
    { label: 'Reach Potential', value: 35 + ((h >> 4) % 55),   type: 'opportunity' },
    { label: 'Conversion Risk', value: 30 + ((h >> 8) % 50),   type: 'threat' },
    { label: 'Long-term Value', value: 45 + ((h >> 12) % 45),  type: 'segment' },
  ]
}

export function SegmentProfile({ segmentId }) {
  const segment = SEGMENTS.find((s) => s.id === segmentId)
  if (!segment) return null

  const color = SEG_COLORS[segment.color] || '#7F77DD'
  const rawData = RADAR_DATA[segmentId] || {}
  const radarData = RADAR_AXES.map(({ key, label }) => ({
    axis: label,
    value: rawData[key] || 0,
  }))
  const bars = getBarValues(segmentId)

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Radar chart */}
      <div className="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-3">
        <p className="text-[10px] uppercase tracking-wider text-ink-500">Segment Profile</p>
        <ResponsiveContainer width="100%" height={180}>
          <RadarChart data={radarData} margin={{ top: 4, right: 20, bottom: 4, left: 20 }}>
            <PolarGrid stroke="rgba(0,0,0,0.07)" />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fontSize: 10, fill: '#6B6B73', fontFamily: 'inherit' }}
            />
            <Radar
              dataKey="value"
              fill={color}
              fillOpacity={0.25}
              stroke={color}
              strokeWidth={1.5}
              dot={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Opportunity bars */}
      <div className="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-3">
        <p className="text-[10px] uppercase tracking-wider text-ink-500">Opportunity Signals</p>
        <div className="flex flex-col gap-4 flex-1 justify-center">
          {bars.map((bar) => {
            const barColor =
              bar.type === 'threat' ? '#E24B4A'
              : bar.type === 'opportunity' ? '#378ADD'
              : color
            return (
              <div key={bar.label} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-ink-500">{bar.label}</span>
                  <span className="text-[11px] text-ink-400">{bar.value}%</span>
                </div>
                <div className="w-full h-1 rounded-full bg-surface-sunken overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${bar.value}%`, backgroundColor: barColor }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
