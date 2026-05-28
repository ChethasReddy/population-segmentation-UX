import { motion, useReducedMotion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { cn } from "../lib/utils";
import { VIEW_TABS } from "../lib/data";
import { duration, ease, spring, tap } from "../lib/motion";

export const FILTERS = VIEW_TABS;

export function CategoryFilter({ activeFilter, onFilterChange }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="border-b border-border bg-surface-raised shrink-0">
      <div className="px-8 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-1 min-w-max">
          {VIEW_TABS.map((tab, index) => {
            const isActive = activeFilter === tab.id;
            const Icon = LucideIcons[tab.icon] || LucideIcons.LayoutGrid;

            return (
              <motion.button
                key={tab.id}
                onClick={() => onFilterChange(tab.id)}
                whileTap={reduceMotion ? undefined : tap}
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: duration.normal,
                  delay: 0.03 * index,
                  ease,
                }}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-3.5 text-[13px] whitespace-nowrap -mb-px transition-colors",
                  isActive
                    ? "text-seg1 font-medium"
                    : "text-ink-500 hover:text-ink-700",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="view-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-seg1 rounded-full"
                    transition={reduceMotion ? { duration: 0 } : spring}
                  />
                )}
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isActive ? "text-seg1" : "text-ink-400",
                  )}
                />
                {tab.label}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
