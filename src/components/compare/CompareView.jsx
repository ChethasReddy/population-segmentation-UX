import { Columns } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { duration, ease, fadeUp } from "../../lib/motion";
import { CompareHeader } from "./CompareHeader";
import { CompareSegmentBar } from "./CompareSegmentBar";
import { CompareTable } from "./CompareTable";

export function CompareView({
  comparisonSegments = [],
  activeSegments = [],
  bySegment = {},
  onComparisonSegmentsChange = () => {},
  onEnsureSegmentData = () => {},
  previousSegmentId,
  onNavigateBack = () => {},
}) {
  const reduceMotion = useReducedMotion();

  function handleAddSegment(segmentId) {
    if (comparisonSegments.length >= 4) return;
    if (!segmentId || comparisonSegments.includes(segmentId)) return;
    if (!activeSegments.includes(segmentId)) return;
    onEnsureSegmentData(segmentId);
    onComparisonSegmentsChange([...comparisonSegments, segmentId]);
  }

  function handleRemoveSegment(segmentId) {
    onComparisonSegmentsChange(
      comparisonSegments.filter((id) => id !== segmentId),
    );
  }

  function handleClearAll() {
    onComparisonSegmentsChange([]);
  }

  const segmentBar = (
    <CompareSegmentBar
      activeSegments={activeSegments}
      comparisonSegments={comparisonSegments}
      bySegment={bySegment}
      onAddSegment={handleAddSegment}
      onRemoveSegment={handleRemoveSegment}
      onClearAll={handleClearAll}
    />
  );

  if (comparisonSegments.length === 0) {
    return (
      <div className="flex flex-col min-h-full">
        <CompareHeader
          comparisonSegments={[]}
          bySegment={bySegment}
          previousSegmentId={previousSegmentId}
          onNavigateBack={onNavigateBack}
        />
        <motion.div
          className="flex flex-col items-center justify-center flex-1 gap-3 text-center px-8 py-12"
          initial={reduceMotion ? false : fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ duration: duration.slow, ease }}
        >
          <div className="w-10 h-10 rounded-xl bg-surface-sunken flex items-center justify-center">
            <Columns className="w-5 h-5 text-ink-300" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-[15px] font-medium text-ink-900">
              No segments selected
            </h3>
            <p className="text-sm text-ink-500">
              Pick a segment from the list below to start comparing.
            </p>
          </div>
        </motion.div>
        {segmentBar}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full">
      <CompareHeader
        comparisonSegments={comparisonSegments}
        bySegment={bySegment}
        previousSegmentId={previousSegmentId}
        onNavigateBack={onNavigateBack}
      />
      {segmentBar}
      <CompareTable
        comparisonSegments={comparisonSegments}
        bySegment={bySegment}
      />
    </div>
  );
}
