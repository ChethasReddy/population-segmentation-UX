import { motion, useReducedMotion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "./ui/skeleton";
import * as LucideIcons from "lucide-react";
import { cn } from "../lib/utils";
import { CATEGORY_PROMPTS } from "../lib/data";
import { duration, ease } from "../lib/motion";

const COLOR_MAP = {
  strengths: { bg: "bg-strengths-bg", fg: "text-strengths-fg" },
  weaknesses: { bg: "bg-weaknesses-bg", fg: "text-weaknesses-fg" },
  opportunities: { bg: "bg-opportunities-bg", fg: "text-opportunities-fg" },
  threats: { bg: "bg-threats-bg", fg: "text-threats-fg" },
  okrs: { bg: "bg-okrs-bg", fg: "text-okrs-fg" },
  positioning: { bg: "bg-positioning-bg", fg: "text-positioning-fg" },
  persona: { bg: "bg-persona-bg", fg: "text-persona-fg" },
  investment: { bg: "bg-investment-bg", fg: "text-investment-fg" },
  channels: { bg: "bg-channels-bg", fg: "text-channels-fg" },
};

const PROSE =
  "[&_p]:m-0 [&_p+p]:mt-2.5 [&_ul]:m-0 [&_ul]:list-none [&_ul]:pl-0 [&_ol]:m-0 [&_ol]:list-none [&_ol]:pl-0 [&_li]:m-0";

const BODY = "flex-1 min-h-[120px]";

function toProse(value) {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const lines = value.filter(
      (item) => typeof item === "string" && item.trim().length > 0,
    );
    return lines.join(" ");
  }
  return "";
}

export function InsightCard({ category, status, value, error }) {
  const reduceMotion = useReducedMotion();
  const colors = COLOR_MAP[category.color] || {
    bg: "bg-surface-sunken",
    fg: "text-ink-700",
  };
  const Icon = LucideIcons[category.icon] || LucideIcons.Zap;

  return (
    <motion.div
      className="rounded-xl border border-border bg-surface-raised p-5 flex flex-col gap-3 h-full shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -2,
              boxShadow: "0 6px 20px rgba(15, 23, 42, 0.08)",
            }
      }
      transition={{ duration: duration.fast, ease }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <motion.div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colors.bg}`}
          animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Icon className={`w-4 h-4 ${colors.fg}`} />
        </motion.div>
        <span className="text-[14px] font-medium text-ink-900 leading-tight">
          {category.label}
        </span>
      </div>

      <p className="text-[12px] leading-relaxed text-ink-400">
        {CATEGORY_PROMPTS[category.id]}
      </p>

      {status === "loading" && (
        <div className={cn("flex flex-col gap-2.5", BODY)}>
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
          <Skeleton className="h-5 w-4/6" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      )}

      {status === "error" && (
        <motion.div
          className={cn("rounded-lg bg-threats-bg px-3 py-2", BODY)}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.normal, ease }}
        >
          <p className="text-[12px] text-threats-fg">
            {error || "Failed to load insight."}
          </p>
        </motion.div>
      )}

      {status === "ready" && (
        <motion.div
          className={cn(
            "text-[13px] leading-relaxed text-ink-700",
            PROSE,
            BODY,
          )}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.normal, ease }}
        >
          <ReactMarkdown>{toProse(value)}</ReactMarkdown>
        </motion.div>
      )}
    </motion.div>
  );
}
