import { useEffect, useRef, useState } from "react";
import {
  Briefcase,
  ChevronDown,
  Leaf,
  PenTool,
  Plus,
  Shield,
  Sparkles,
  X,
} from "lucide-react";
import { SEGMENTS } from "../../lib/data";
import { cn } from "../../lib/utils";

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

export function CompareSegmentBar({
  activeSegments,
  comparisonSegments,
  getSegmentState,
  productId,
  objectiveId,
  onAddSegment,
  onRemoveSegment,
  onClearAll,
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const addMenuRef = useRef(null);

  const availableToAdd = SEGMENTS.filter(
    (seg) =>
      activeSegments.includes(seg.id) && !comparisonSegments.includes(seg.id),
  );
  const canAdd = comparisonSegments.length < 4 && availableToAdd.length > 0;

  useEffect(() => {
    if (!isAddOpen) return;
    function handleClickOutside(event) {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target)) {
        setIsAddOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isAddOpen]);

  function handleSelectSegment(segmentId) {
    onAddSegment(segmentId);
    setIsAddOpen(false);
  }

  return (
    <div className="relative z-30 px-8 pb-4">
      <div className="flex flex-wrap items-center gap-2">
        {comparisonSegments.map((segmentId) => {
          const segment = SEGMENTS.find((s) => s.id === segmentId);
          const status = getSegmentState(productId, objectiveId, segmentId)?.status;
          return (
            <span
              key={segmentId}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-raised pl-3 pr-1.5 py-1.5 text-[13px] text-ink-900"
            >
              <SegmentIcon segmentId={segmentId} segmentColor={segment?.color} />
              <span>{segment?.label || segmentId}</span>
              {status === "loading" && (
                <span className="h-1.5 w-1.5 rounded-full bg-ink-300 animate-pulse" />
              )}
              <button
                type="button"
                onClick={() => onRemoveSegment(segmentId)}
                className="rounded p-0.5 text-ink-400 hover:bg-surface-sunken hover:text-ink-700"
                aria-label={`Remove ${segment?.label}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          );
        })}

        <div className="relative" ref={addMenuRef}>
          <button
            type="button"
            onClick={() => canAdd && setIsAddOpen((open) => !open)}
            disabled={!canAdd}
            aria-expanded={isAddOpen}
            aria-haspopup="listbox"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-[13px] transition-colors",
              canAdd
                ? "text-ink-600 hover:bg-surface-raised hover:border-ink-900/15"
                : "text-ink-300 cursor-not-allowed",
            )}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Segment
            {canAdd && (
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  isAddOpen && "rotate-180",
                )}
              />
            )}
          </button>

          {isAddOpen && canAdd && (
            <div
              role="listbox"
              className="absolute left-0 top-full z-30 mt-1.5 min-w-[220px] overflow-hidden rounded-lg border border-border bg-surface-raised py-1 shadow-md"
            >
              {availableToAdd.map((segment) => (
                <button
                  key={segment.id}
                  type="button"
                  role="option"
                  onClick={() => handleSelectSegment(segment.id)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-ink-700 hover:bg-surface-sunken"
                >
                  <SegmentIcon segmentId={segment.id} segmentColor={segment.color} />
                  {segment.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {comparisonSegments.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="ml-auto text-[13px] text-ink-500 hover:text-ink-700"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
}
