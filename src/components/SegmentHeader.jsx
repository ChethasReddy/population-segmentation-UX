import { Ellipsis, Download } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "./ui/button";
import { SEGMENTS } from "../lib/data";
import { duration, ease, fadeDown, tap } from "../lib/motion";

function formatLastUpdated(meta) {
  if (!meta?.latencyMs) return "Last updated just now";
  const seconds = Math.max(1, Math.round(meta.latencyMs / 1000));
  if (seconds < 60) return `Last updated ${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  return `Last updated ${minutes}m ago`;
}

export function SegmentHeader({
  segmentId,
  segmentState,
  activeSegments,
  bySegment,
}) {
  const reduceMotion = useReducedMotion();
  const segment = SEGMENTS.find((s) => s.id === segmentId);
  if (!segment) return null;

  const meta = segmentState?.insights?._meta;

  function handleExportJSON() {
    const data = {};
    activeSegments.forEach((id) => {
      if (bySegment[id]?.insights) data[id] = bySegment[id].insights;
    });
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  }

  return (
    <motion.div
      className="px-8 pt-7 pb-5 bg-transparent shrink-0"
      initial={reduceMotion ? false : fadeDown.initial}
      animate={fadeDown.animate}
      transition={{ duration: duration.normal, ease }}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-[28px] font-medium text-ink-900 leading-tight tracking-tight">
              {segment.label}
            </h1>
          </div>
          <p className="text-[14px] text-ink-500 leading-relaxed max-w-2xl">
            {segment.description}
          </p>
          <p className="text-[12px] text-ink-400">{formatLastUpdated(meta)}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <motion.div whileTap={reduceMotion ? undefined : tap}>
            <Button variant="outline" size="sm" onClick={handleExportJSON}>
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </motion.div>
          <motion.div whileTap={reduceMotion ? undefined : tap}>
            <Button variant="outline" size="icon" aria-label="More actions">
              <Ellipsis className="h-3.5 w-3.5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
