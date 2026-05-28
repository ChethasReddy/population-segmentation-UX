import { Briefcase, Leaf, PenTool, Shield, Sparkles } from "lucide-react";
import { COMPARE_ROWS, SEGMENTS } from "../../lib/data";
import { cn } from "../../lib/utils";
import { CompareCategoryCell } from "./CompareCategoryCell";
import { CompareContentCell } from "./CompareContentCell";

const SEGMENT_ICONS = {
  "gen-z-creators": PenTool,
  "urban-climate": Leaf,
  "cost-sensitive-smb": Briefcase,
  "enterprise-it": Shield,
};

const SEG_ICON_CLASS = {
  seg1: "text-seg1",
  seg2: "text-seg2",
  seg3: "text-seg3",
  seg4: "text-seg4",
};

function SegmentIcon({ segmentId, segmentColor }) {
  const Icon = SEGMENT_ICONS[segmentId] || Sparkles;
  return (
    <Icon
      className={cn(
        "h-3.5 w-3.5 shrink-0",
        SEG_ICON_CLASS[segmentColor] || "text-ink-400",
      )}
    />
  );
}

function getSegmentLabel(id) {
  return SEGMENTS.find((seg) => seg.id === id)?.label || id;
}

function getColumnWidths(segmentCount) {
  const categoryPercent =
    segmentCount <= 1 ? 32 : segmentCount === 2 ? 26 : segmentCount === 3 ? 22 : 18;
  const segmentPercent = (100 - categoryPercent) / Math.max(segmentCount, 1);
  return {
    category: `${categoryPercent}%`,
    segment: `${segmentPercent}%`,
  };
}

/** Sticky only on large screens; on narrow viewports the whole table scrolls together. */
const CATEGORY_HEADER_CELL = cn(
  "max-w-0 bg-[#f6f6f7] p-4 text-left align-top",
  "lg:sticky lg:left-0 lg:z-20 lg:shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)]",
);

const CATEGORY_BODY_CELL = cn(
  "max-w-0 align-top p-4 bg-[#f6f6f7] border-t border-border/60",
  "lg:sticky lg:left-0 lg:z-20 lg:shadow-[4px_0_8px_-4px_rgba(0,0,0,0.08)]",
);

export function CompareTable({ comparisonSegments, bySegment }) {
  const segmentCount = comparisonSegments.length;
  const { category: categoryWidth, segment: segmentWidth } =
    getColumnWidths(segmentCount);

  const minTableWidth = 220 + segmentCount * 260;

  return (
    <div className="px-8 pb-8 overflow-x-auto">
      <table
        className="w-full table-fixed border-separate border-spacing-0"
        style={{ minWidth: minTableWidth }}
      >
        <colgroup>
          <col style={{ width: categoryWidth }} />
          {comparisonSegments.map((segmentId) => (
            <col key={segmentId} style={{ width: segmentWidth }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className={CATEGORY_HEADER_CELL}>
              <p className="text-[11px] font-medium uppercase tracking-wider text-ink-500 break-words">
                Insight Category
              </p>
            </th>
            {comparisonSegments.map((segmentId) => {
              const segment = SEGMENTS.find((s) => s.id === segmentId);
              return (
                <th
                  key={segmentId}
                  className="relative z-0 max-w-0 p-4 text-left align-top bg-surface-sunken/60"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <SegmentIcon segmentId={segmentId} segmentColor={segment?.color} />
                    <span className="text-[13px] font-medium text-ink-900 truncate">
                      {getSegmentLabel(segmentId)}
                    </span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {COMPARE_ROWS.map((row) => (
            <tr key={row.id}>
              <td className={CATEGORY_BODY_CELL}>
                <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface-raised p-4 h-full">
                  <CompareCategoryCell row={row} />
                </div>
              </td>
              {comparisonSegments.map((segmentId) => (
                <td
                  key={`${row.id}-${segmentId}`}
                  className="relative z-0 max-w-0 align-top p-4 border-t border-border/60"
                >
                  <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface-raised p-4 h-full min-h-[80px]">
                    <CompareContentCell
                      row={row}
                      segmentId={segmentId}
                      segmentState={bySegment[segmentId]}
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
