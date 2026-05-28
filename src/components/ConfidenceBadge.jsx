import { cn } from "../lib/utils";

export function ConfidenceBadge({ confidence, compact = false }) {
  if (confidence == null) return null;

  const pct = Math.round(confidence * 100);

  const { colorClass, bgClass } =
    confidence >= 0.85
      ? { colorClass: "text-strengths-fg", bgClass: "bg-strengths-bg" }
      : confidence >= 0.65
        ? { colorClass: "text-weaknesses-fg", bgClass: "bg-weaknesses-bg" }
        : { colorClass: "text-threats-fg", bgClass: "bg-threats-bg" };

  const fullLabel = `${pct}% Confidence`;

  return (
    <div
      className={cn(
        "inline-flex min-w-0 max-w-full shrink items-center rounded-full",
        bgClass,
        compact ? "px-2 py-0.5" : "px-2.5 py-1",
      )}
      title={fullLabel}
    >
      <span
        className={cn(
          "min-w-0 truncate font-medium",
          colorClass,
          compact ? "text-[10px]" : "text-[11px]",
        )}
      >
        {pct}%
        <span className={compact ? "hidden md:inline" : "hidden sm:inline"}>
          {" "}
          Confidence
        </span>
      </span>
    </div>
  );
}
