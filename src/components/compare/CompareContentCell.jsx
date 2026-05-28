import { Skeleton } from "../ui/skeleton";
import { CompareConfidenceRing } from "./CompareConfidenceRing";
import { InsightBulletList } from "../InsightBulletList";
import { SEGMENTS } from "../../lib/data";
import { toBulletItems } from "../../lib/utils";

export function CompareContentCell({
  row,
  segmentId,
  segmentState,
}) {
  const status = segmentState?.status || "idle";
  const insights = segmentState?.insights;
  const value = insights?.[row.insightKey];
  const segment = SEGMENTS.find((s) => s.id === segmentId);

  if (status === "idle") {
    return (
      <p className="text-ink-400 text-[12px] italic leading-relaxed">
        Not generated. Select this segment and click Generate Insights.
      </p>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex flex-col gap-2.5">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-5/6" />
        <Skeleton className="h-5 w-4/6" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <p className="text-[12px] text-ink-500 leading-relaxed">
        {segmentState?.error || "Failed to load insight."}
      </p>
    );
  }

  if (row.renderType === "confidenceRing") {
    return (
      <CompareConfidenceRing
        confidence={insights?.confidence}
        segmentColor={segment?.color}
      />
    );
  }

  if (row.renderType === "orderedList" || row.renderType === "markdown") {
    const ordered = row.renderType === "orderedList";
    const items = toBulletItems(value);
    return <InsightBulletList items={items} ordered={ordered} />;
  }

  return <p className="text-[12px] text-ink-400">No insight generated.</p>;
}
