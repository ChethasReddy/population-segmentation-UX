import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils'

export const Tabs = TabsPrimitive.Root

export function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      className={cn('flex items-center gap-1', className)}
      {...props}
    />
  )
}

export function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 text-sm text-ink-500 transition-colors',
        'hover:text-ink-900 data-[state=active]:text-ink-900 data-[state=active]:font-medium',
        'border-b-2 border-transparent data-[state=active]:border-ink-900 rounded-none',
        className
      )}
      {...props}
    />
  )
}

export function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      className={cn('mt-0', className)}
      {...props}
    />
  )
}
