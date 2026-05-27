import { Layers } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-12">
      <div className="w-10 h-10 rounded-xl bg-surface-sunken flex items-center justify-center">
        <Layers className="w-5 h-5 text-ink-300" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-medium text-ink-900">No segments selected</p>
        <p className="text-sm text-ink-500">
          Enable at least one segment from the sidebar to see insights.
        </p>
      </div>
    </div>
  )
}
