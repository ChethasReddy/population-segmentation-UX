import { motion, useReducedMotion } from "framer-motion";
import { InsightCard } from "./InsightCard";
import { CATEGORIES } from "../lib/data";
import { duration, ease } from "../lib/motion";

export function InsightGrid({ segmentState, categories }) {
  const reduceMotion = useReducedMotion();
  const status = segmentState?.status || "loading";
  const insights = segmentState?.insights || null;
  const error = segmentState?.error || null;
  const displayCategories = categories || CATEGORIES;

  if (status === "error" && !insights) {
    return (
      <div className="rounded-xl border border-border bg-threats-bg p-6 text-center">
        <p className="text-sm text-threats-fg font-medium mb-1">
          Analysis failed
        </p>
        <p className="text-[12px] text-threats-fg opacity-80">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {displayCategories.map((category, index) => {
        const value = insights?.[category.id];
        return (
          <motion.div
            key={category.id}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: duration.normal,
              delay: status === "ready" && !reduceMotion ? index * 0.04 : 0,
              ease,
            }}
            layout
          >
            <InsightCard
              category={category}
              status={status}
              value={value}
              error={error}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
