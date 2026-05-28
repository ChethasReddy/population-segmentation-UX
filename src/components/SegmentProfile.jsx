import { motion, useReducedMotion } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "./ui/skeleton";
import { SEGMENTS } from "../lib/data";
import { duration, ease, stagger } from "../lib/motion";

const SEG_COLORS = {
  seg1: "#7F77DD",
  seg2: "#1D9E75",
  seg3: "#BA7517",
  seg4: "#D4537E",
};

const RADAR_AXES = [
  { key: "affinity", label: "Affinity" },
  { key: "reach", label: "Reach" },
  { key: "loyalty", label: "Loyalty" },
  { key: "priceSensitivity", label: "Price Sensitivity" },
  { key: "trendInfluence", label: "Trend Influence" },
  { key: "conversionVelocity", label: "Conversion Velocity" },
];

const SIGNAL_BARS = [
  { key: "brandFit", label: "Brand Fit", type: "segment" },
  { key: "reachPotential", label: "Reach Potential", type: "opportunity" },
  { key: "conversionRisk", label: "Conversion Risk", type: "threat" },
  { key: "longTermValue", label: "Long-term Value", type: "segment" },
];

export function SegmentProfile({
  segmentId,
  segmentState,
  isRunning = false,
  productId,
  objectiveId,
}) {
  const reduceMotion = useReducedMotion();
  const segment = SEGMENTS.find((s) => s.id === segmentId);
  if (!segment) return null;

  const status = segmentState?.status || "idle";
  const error = segmentState?.error;
  const color = SEG_COLORS[segment.color] || "#7F77DD";
  const radar = segmentState?.insights?.radar;
  const signals = segmentState?.insights?.signals;
  const hasChartData =
    status === "ready" && radar != null && signals != null;
  const showLoading =
    status === "loading" ||
    (isRunning && status !== "ready" && status !== "error");
  const profileKey = `${productId ?? ""}-${objectiveId ?? ""}-${segmentId}-${status}-${hasChartData ? "charts" : "empty"}`;

  const radarData = RADAR_AXES.map(({ key, label }) => ({
    axis: label,
    value: radar?.[key] ?? 0,
  }));

  const bars = SIGNAL_BARS.map(({ key, label, type }) => ({
    label,
    type,
    value: signals?.[key] ?? 0,
  }));

  if (status === "idle" && !showLoading) {
    return (
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-3"
        key={profileKey}
      >
        <div className="rounded-xl border border-border bg-surface-raised p-4 flex items-center justify-center min-h-[220px]">
          <p className="text-ink-400 text-[12px] text-center px-4">
            Generate insights to see the segment profile.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-surface-raised p-4 flex items-center justify-center min-h-[220px]">
          <p className="text-ink-400 text-[12px] text-center px-4">
            Generate insights to see the segment profile.
          </p>
        </div>
      </motion.div>
    );
  }

  if (status === "error") {
    return (
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-3"
        key={profileKey}
      >
        <div className="rounded-xl border border-border bg-threats-bg p-4 flex items-center justify-center min-h-[220px]">
          <p className="text-[12px] text-threats-fg text-center px-4">
            {error || "Failed to load segment profile."}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-threats-bg p-4 flex items-center justify-center min-h-[220px]">
          <p className="text-[12px] text-threats-fg text-center px-4">
            {error || "Failed to load segment profile."}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-3"
      variants={reduceMotion ? undefined : stagger.container}
      initial={reduceMotion || hasChartData ? false : "initial"}
      animate="animate"
      key={profileKey}
    >
      <motion.div
        className="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-3"
        variants={reduceMotion ? undefined : stagger.item}
        whileHover={
          reduceMotion
            ? undefined
            : { boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }
        }
      >
        <p className="text-[10px] uppercase tracking-wider text-ink-500">
          Segment Profile
        </p>
        {showLoading || !hasChartData ? (
          <div className="flex flex-col gap-2.5 py-4">
            <Skeleton className="h-[180px] w-full rounded-lg" />
          </div>
        ) : (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: duration.slow, ease }}
          >
            <ResponsiveContainer
              key={`radar-${profileKey}`}
              width="100%"
              height={180}
              debounce={1}
            >
              <RadarChart
                data={radarData}
                margin={{ top: 4, right: 20, bottom: 4, left: 20 }}
              >
                <PolarGrid stroke="rgba(0,0,0,0.07)" />
                <PolarAngleAxis
                  dataKey="axis"
                  interval={0}
                  tick={{ fontSize: 10, fill: "#6B6B73", fontFamily: "inherit" }}
                />
                <Radar
                  dataKey="value"
                  fill={color}
                  fillOpacity={0.25}
                  stroke={color}
                  strokeWidth={1.5}
                  dot={false}
                />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="rounded-xl border border-border bg-surface-raised p-4 flex flex-col gap-3"
        variants={reduceMotion ? undefined : stagger.item}
        whileHover={
          reduceMotion
            ? undefined
            : { boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }
        }
      >
        <p className="text-[10px] uppercase tracking-wider text-ink-500">
          Opportunity Signals
        </p>
        {showLoading || !hasChartData ? (
          <div className="flex flex-col gap-4 flex-1 justify-center py-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-1 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 flex-1 justify-center">
            {bars.map((bar, index) => {
              const barColor =
                bar.type === "threat"
                  ? "#E24B4A"
                  : bar.type === "opportunity"
                    ? "#378ADD"
                    : color;
              return (
                <motion.div
                  key={bar.label}
                  className="flex flex-col gap-1.5"
                  initial={reduceMotion ? false : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: duration.normal,
                    delay: 0.08 + index * 0.06,
                    ease,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-ink-500">{bar.label}</span>
                    <span className="text-[11px] text-ink-400">{bar.value}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-surface-sunken overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: barColor }}
                      initial={reduceMotion ? false : { width: 0 }}
                      animate={{ width: `${bar.value}%` }}
                      transition={{
                        duration: 0.7,
                        delay: 0.12 + index * 0.08,
                        ease,
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
