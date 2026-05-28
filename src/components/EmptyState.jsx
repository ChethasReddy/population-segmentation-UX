import { Layers } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { duration, ease, fadeUp } from "../lib/motion";

export function EmptyState() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full gap-3 text-center p-12"
      initial={reduceMotion ? false : fadeUp.initial}
      animate={fadeUp.animate}
      transition={{ duration: duration.slow, ease }}
    >
      <motion.div
        className="w-10 h-10 rounded-xl bg-surface-sunken flex items-center justify-center"
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.normal, ease }}
      >
        <Layers className="w-5 h-5 text-ink-300" />
      </motion.div>
      <div className="flex flex-col gap-1">
        <p className="text-[15px] font-medium text-ink-900">
          No segments selected
        </p>
        <p className="text-sm text-ink-500">
          Enable at least one segment from the sidebar to see insights.
        </p>
      </div>
    </motion.div>
  );
}
