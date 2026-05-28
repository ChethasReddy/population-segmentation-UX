import ReactMarkdown from "react-markdown";
import { Skeleton } from "../ui/skeleton";
import { CompareConfidenceRing } from "./CompareConfidenceRing";
import { SEGMENTS } from "../../lib/data";
import { cn } from "../../lib/utils";

const PROSE =
  "[&_p]:m-0 [&_p+p]:mt-2.5 [&_ul]:m-0 [&_ul]:pl-4 [&_ul]:list-disc [&_ol]:m-0 [&_ol]:pl-4 [&_ol]:list-decimal [&_li]:mt-1";

function normalizeListItems(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string" && item.trim().length > 0);
  }
  return null;
}

export function CompareContentCell({
  row,
  segmentId,
  segmentState,
}) {
  const status = segmentState?.status || "loading";
  const insights = segmentState?.insights;
  const value = insights?.[row.insightKey];
  const segment = SEGMENTS.find((s) => s.id === segmentId);

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

  if (row.renderType === "orderedList") {
    const items = normalizeListItems(value);
    if (items && items.length > 0) {
      return (
        <ol className="list-decimal pl-4 text-[13px] leading-relaxed text-ink-700 space-y-2">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      );
    }
    if (typeof value === "string" && value.trim()) {
      return (
        <div className={cn("text-[13px] leading-relaxed text-ink-700", PROSE)}>
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      );
    }
    return <p className="text-[12px] text-ink-400">No insight generated.</p>;
  }

  if (typeof value === "string" && value.trim()) {
    return (
      <div className={cn("text-[13px] leading-relaxed text-ink-700", PROSE)}>
        <ReactMarkdown>{value}</ReactMarkdown>
      </div>
    );
  }

  return <p className="text-[12px] text-ink-400">No insight generated.</p>;
}
