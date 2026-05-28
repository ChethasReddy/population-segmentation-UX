import { ArrowLeft, Bookmark, Download } from "lucide-react";
import { Button } from "../ui/button";
import { SEGMENTS } from "../../lib/data";

export function CompareHeader({
  comparisonSegments,
  getSegmentState,
  productId,
  objectiveId,
  previousSegmentId,
  onNavigateBack,
}) {
  const previousSegment = SEGMENTS.find((s) => s.id === previousSegmentId);
  const backLabel = previousSegment?.label ?? "Insights";

  function buildExportData() {
    const data = {};
    comparisonSegments.forEach((id) => {
      const state = getSegmentState(productId, objectiveId, id);
      if (state.status === "ready" && state.insights) {
        data[id] = state.insights;
      }
    });
    return data;
  }

  function handleSave() {
    navigator.clipboard.writeText(JSON.stringify(buildExportData(), null, 2));
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(buildExportData(), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "segment-comparison.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  const segmentLabels = comparisonSegments
    .map((id) => SEGMENTS.find((s) => s.id === id)?.label)
    .filter(Boolean)
    .join(", ");

  return (
    <div className="px-8 pt-7 pb-4 flex items-start justify-between gap-6 shrink-0">
      <div className="min-w-0">
        <button
          type="button"
          onClick={onNavigateBack}
          className="flex items-center gap-1.5 text-[12px] text-ink-500 hover:text-ink-900 transition-colors mb-3"
        >
          <ArrowLeft size={14} />
          Back to {backLabel}
        </button>
        <h1 className="text-[28px] font-medium text-ink-900 leading-tight tracking-tight">
          Compare Segments
        </h1>
        <p className="text-[14px] text-ink-500 leading-relaxed mt-2 max-w-2xl">
          Side-by-side comparison of AI-generated insights across segments.
        </p>
        {segmentLabels && (
          <p className="text-[12px] text-ink-400 mt-1 truncate">{segmentLabels}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={handleSave}>
          <Bookmark className="h-3.5 w-3.5" />
          Save Comparison
        </Button>
        <Button variant="outline" size="icon" onClick={handleExport} aria-label="Export comparison">
          <Download className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
