import { Download, GitCompare, Bookmark, Ellipsis } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { PRODUCTS, OBJECTIVES, CATEGORIES } from "../lib/data";
import { isMockInsightsEnabled } from "../lib/mockInsights";
import { duration, ease, fadeDown, tap } from "../lib/motion";

export function TopBar({
  product,
  objective,
  activeSegments,
  bySegment,
  isCompareEnabled,
  onToggleCompare,
}) {
  const reduceMotion = useReducedMotion();
  const productLabel = PRODUCTS.find((p) => p.id === product)?.label || product;
  const objectiveLabel =
    OBJECTIVES.find((o) => o.id === objective)?.label || objective;

  function handleExportJSON() {
    const data = {};
    activeSegments.forEach((id) => {
      if (bySegment[id]?.insights) data[id] = bySegment[id].insights;
    });
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  }

  return (
    <motion.div
      className="flex items-center justify-between px-6 py-3 border-b border-border bg-surface-raised shrink-0"
      initial={reduceMotion ? false : fadeDown.initial}
      animate={fadeDown.animate}
      transition={{ duration: duration.normal, ease }}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm text-ink-500">
          {productLabel}
          <span className="text-ink-300 mx-1.5">·</span>
          <span className="font-medium text-ink-900">{objectiveLabel}</span>
        </span>
        <Badge className="bg-surface-sunken border-transparent text-ink-300 font-normal">
          {CATEGORIES.length} insights · {activeSegments.length} segment
          {activeSegments.length !== 1 ? "s" : ""}
        </Badge>
        {isMockInsightsEnabled() && (
          <Badge className="bg-weaknesses-bg border-transparent text-weaknesses-fg font-normal">
            Mock data
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <motion.div whileTap={reduceMotion ? undefined : tap}>
          <Button
            variant={isCompareEnabled ? "default" : "outline"}
            size="sm"
            onClick={onToggleCompare}
          >
            <GitCompare className="h-3.5 w-3.5" />
            Compare
          </Button>
        </motion.div>
        <motion.div whileTap={reduceMotion ? undefined : tap}>
          <Button variant="outline" size="sm">
            <Bookmark className="h-3.5 w-3.5" />
            Save
          </Button>
        </motion.div>
        <motion.div whileTap={reduceMotion ? undefined : tap}>
          <Button variant="outline" size="sm" onClick={handleExportJSON}>
            <Download className="h-3.5 w-3.5" />
            Export JSON
          </Button>
        </motion.div>
        <motion.div whileTap={reduceMotion ? undefined : tap}>
          <Button variant="outline" size="icon" aria-label="More actions">
            <Ellipsis className="h-3.5 w-3.5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
