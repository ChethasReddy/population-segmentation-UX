const SEG_COLORS = {
  seg1: "#7F77DD",
  seg2: "#1D9E75",
  seg3: "#BA7517",
  seg4: "#D4537E",
};

function getConfidenceLabel(confidence) {
  if (confidence >= 0.85) return "High";
  if (confidence >= 0.7) return "Good";
  return "Moderate";
}

export function CompareConfidenceRing({ confidence, segmentColor }) {
  if (confidence == null) return null;

  const pct = Math.round(confidence * 100);
  const label = getConfidenceLabel(confidence);
  const color = SEG_COLORS[segmentColor] || "#6B6B73";
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidence * circumference);

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-16 w-16 shrink-0">
        <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="6"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[13px] font-medium text-ink-900">
          {pct}%
        </span>
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[13px] font-medium text-ink-900">{label} Confidence</span>
        <span className="text-[12px] text-ink-500 leading-relaxed">
          Based on segment-specific model output.
        </span>
      </div>
    </div>
  );
}
