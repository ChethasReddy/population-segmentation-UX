import { Loader2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { PRODUCTS, OBJECTIVES, SEGMENTS } from "../lib/data";
import { cn } from "../lib/utils";
import { duration, ease, slideInLeft, stagger, tap } from "../lib/motion";

const SEG_COLORS = {
  seg1: "#7F77DD",
  seg2: "#1D9E75",
  seg3: "#BA7517",
  seg4: "#D4537E",
};

const SIDEBAR_SELECT =
  "h-8 px-2.5 text-[13px] leading-tight [&>span]:flex-1 [&>span]:min-w-0 [&>span]:truncate [&>span]:text-left [&_svg]:ml-1.5";

export function Sidebar({
  product,
  objective,
  activeSegments,
  isRunning,
  onProductChange,
  onObjectiveChange,
  onSegmentToggle,
  onRun,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.aside
      className="w-60 shrink-0 flex flex-col h-screen border-r border-border bg-surface-raised"
      initial={reduceMotion ? false : slideInLeft.initial}
      animate={slideInLeft.animate}
      transition={{ duration: duration.slow, ease }}
    >
      <motion.div
        className="p-5 flex flex-col gap-5 flex-1 overflow-y-auto"
        variants={reduceMotion ? undefined : stagger.container}
        initial="initial"
        animate="animate"
      >
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2 pt-1"
          variants={reduceMotion ? undefined : stagger.item}
        >
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: "#7F77DD" }}
            animate={reduceMotion ? undefined : { scale: [1, 1.15, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-[13px] font-medium text-ink-900">
            Subconscious.ai
          </span>
        </motion.div>

        {/* Product */}
        <motion.div
          className="flex flex-col gap-1.5"
          variants={reduceMotion ? undefined : stagger.item}
        >
          <label className="text-[10px] uppercase tracking-wider text-ink-500">
            Product
          </label>
          <Select value={product} onValueChange={onProductChange}>
            <SelectTrigger className={SIDEBAR_SELECT}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRODUCTS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Objective */}
        <motion.div
          className="flex flex-col gap-1.5"
          variants={reduceMotion ? undefined : stagger.item}
        >
          <label className="text-[10px] uppercase tracking-wider text-ink-500">
            Objective
          </label>
          <Select value={objective} onValueChange={onObjectiveChange}>
            <SelectTrigger className={SIDEBAR_SELECT}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OBJECTIVES.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Segments */}
        <motion.div
          className="flex flex-col gap-2"
          variants={reduceMotion ? undefined : stagger.item}
        >
          <label className="text-[10px] uppercase tracking-wider text-ink-500">
            Segments
          </label>
          <div className="flex flex-col gap-1">
            {SEGMENTS.map((seg) => {
              const active = activeSegments.includes(seg.id);
              const color = SEG_COLORS[seg.color];
              return (
                <motion.button
                  key={seg.id}
                  onClick={() => onSegmentToggle(seg.id)}
                  whileTap={reduceMotion ? undefined : tap}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors",
                    active
                      ? "bg-surface-sunken text-ink-900"
                      : "text-ink-500 hover:bg-surface-sunken hover:text-ink-700",
                  )}
                >
                  <motion.span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: active ? color : "#A8A8B0" }}
                    animate={
                      reduceMotion
                        ? undefined
                        : { scale: active ? 1.15 : 1 }
                    }
                    transition={{ duration: duration.fast, ease }}
                  />
                  <span className="text-[13px] leading-tight">{seg.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* Run button */}
      <motion.div
        className="p-5 border-t border-border"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.normal, delay: 0.2, ease }}
      >
        <motion.div whileTap={reduceMotion ? undefined : tap}>
          <Button className="w-full" onClick={onRun} disabled={isRunning}>
            {isRunning ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Running…
              </>
            ) : (
              "Run analysis"
            )}
          </Button>
        </motion.div>
      </motion.div>
    </motion.aside>
  );
}
