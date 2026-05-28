import { COMPARE_ROWS, SEGMENTS } from "../../lib/data";
import { CompareCategoryCell } from "./CompareCategoryCell";
import { CompareContentCell } from "./CompareContentCell";

const SEG_COLORS = {
  seg1: "#7F77DD",
  seg2: "#1D9E75",
  seg3: "#BA7517",
  seg4: "#D4537E",
};

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

export function CompareTable({ comparisonSegments, bySegment }) {
  const segmentCount = comparisonSegments.length;
  const { category: categoryWidth, segment: segmentWidth } =
    getColumnWidths(segmentCount);

  return (
    <div className="px-8 pb-8 overflow-x-auto">
      <table className="w-full table-fixed border-separate border-spacing-0">
        <colgroup>
          <col style={{ width: categoryWidth }} />
          {comparisonSegments.map((segmentId) => (
            <col key={segmentId} style={{ width: segmentWidth }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-[#f6f6f7] p-4 text-left align-top shadow-[4px_0_8px_-4px_rgba(0,0,0,0.06)]">
              <p className="text-[11px] font-medium uppercase tracking-wider text-ink-500">
                Insight Category
              </p>
            </th>
            {comparisonSegments.map((segmentId) => {
              const segment = SEGMENTS.find((s) => s.id === segmentId);
              return (
                <th
                  key={segmentId}
                  className="p-4 text-left align-top bg-surface-sunken/60"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor: SEG_COLORS[segment?.color] || "#6B6B73",
                      }}
                    />
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
              <td className="sticky left-0 z-10 align-top p-4 bg-[#f6f6f7] border-t border-border/60 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.06)]">
                <div className="rounded-xl border border-border bg-surface-raised p-4 h-full">
                  <CompareCategoryCell row={row} />
                </div>
              </td>
              {comparisonSegments.map((segmentId) => (
                <td
                  key={`${row.id}-${segmentId}`}
                  className="align-top p-4 border-t border-border/60"
                >
                  <div className="rounded-xl border border-border bg-surface-raised p-4 h-full min-h-[80px]">
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
