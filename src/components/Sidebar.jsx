import {
  Loader2,
  Sparkles,
  Car,
  TrendingUp,
  GitCompare,
  Settings,
  X,
  Coffee,
  BarChart3,
  Dumbbell,
  Landmark,
  Megaphone,
  Search,
  ShoppingCart,
  RefreshCw,
  PieChart,
  PenTool,
  Leaf,
  Briefcase,
  Shield,
} from "lucide-react";
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
import { duration, ease, stagger, tap } from "../lib/motion";

const SIDEBAR_SELECT =
  "h-9 px-3 text-[13px] leading-tight [&>span]:flex-1 [&>span]:min-w-0 [&>span]:truncate [&>span]:text-left [&_svg]:ml-2";

const PRODUCT_ICONS = {
  ev: Car,
  coffee: Coffee,
  saas: BarChart3,
  fitness: Dumbbell,
  banking: Landmark,
};

const OBJECTIVE_ICONS = {
  awareness: Megaphone,
  consideration: Search,
  conversion: ShoppingCart,
  retention: RefreshCw,
  expansion: PieChart,
};

const SEGMENT_ICONS = {
  "gen-z-creators": PenTool,
  "urban-climate": Leaf,
  "cost-sensitive-smb": Briefcase,
  "enterprise-it": Shield,
};

export function Sidebar({
  product,
  objective,
  selectedSegment,
  activeView,
  isRunning,
  isOpen = true,
  onClose,
  onProductChange,
  onObjectiveChange,
  onSegmentSelect,
  onNavigateCompare,
  onRun,
}) {
  const reduceMotion = useReducedMotion();
  const ProductIcon = PRODUCT_ICONS[product] || Car;
  const ObjectiveIcon = OBJECTIVE_ICONS[objective] || TrendingUp;

  function handleSegmentSelect(segId) {
    onSegmentSelect(segId);
    onClose?.();
  }

  function handleNavigateCompare() {
    onNavigateCompare();
    onClose?.();
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-screen border-r border-border bg-surface-raised z-40",
        "fixed inset-y-0 left-0 w-[min(100vw,272px)] max-w-[272px]",
        "transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:relative lg:translate-x-0 lg:shrink-0 lg:w-[272px]",
      )}
    >
      <motion.div
        className="p-4 sm:p-5 flex flex-col gap-4 sm:gap-5 flex-1 overflow-y-auto min-h-0"
        variants={reduceMotion ? undefined : stagger.container}
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="flex items-center justify-between gap-2 pt-1"
          variants={reduceMotion ? undefined : stagger.item}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <motion.div
              className="w-8 h-8 rounded-lg bg-[#EEEDFE] flex items-center justify-center shrink-0"
              animate={reduceMotion ? undefined : { scale: [1, 1.08, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-4 h-4 rounded-full bg-seg1" />
            </motion.div>
            <span className="text-[15px] font-medium text-ink-900 truncate">
              Subconscious.ai
            </span>
          </div>
          <button
            type="button"
            onClick={() => onClose?.()}
            className="lg:hidden rounded-lg p-1.5 text-ink-500 hover:bg-surface-sunken hover:text-ink-900 shrink-0"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>

        <motion.div
          className="flex flex-col gap-1.5"
          variants={reduceMotion ? undefined : stagger.item}
        >
          <label className="text-[11px] font-medium text-ink-500">
            Product
          </label>
          <Select value={product} onValueChange={onProductChange}>
            <SelectTrigger className={cn(SIDEBAR_SELECT, "gap-2")}>
              <ProductIcon className="h-3.5 w-3.5 text-ink-400 shrink-0" />
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

        <motion.div
          className="flex flex-col gap-1.5"
          variants={reduceMotion ? undefined : stagger.item}
        >
          <label className="text-[11px] font-medium text-ink-500">
            Business Objective
          </label>
          <Select value={objective} onValueChange={onObjectiveChange}>
            <SelectTrigger className={cn(SIDEBAR_SELECT, "gap-2")}>
              <ObjectiveIcon className="h-3.5 w-3.5 text-ink-400 shrink-0" />
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

        <motion.div
          className="flex flex-col gap-2"
          variants={reduceMotion ? undefined : stagger.item}
        >
          <label className="text-[11px] font-medium text-ink-500">
            Segments
          </label>
          <div className="flex flex-col gap-1.5 pt-0.5">
            {SEGMENTS.map((seg) => {
              const selected = selectedSegment === seg.id;
              const SegmentIcon = SEGMENT_ICONS[seg.id] || Sparkles;
              return (
                <motion.button
                  key={seg.id}
                  onClick={() => handleSegmentSelect(seg.id)}
                  whileTap={reduceMotion ? undefined : tap}
                  className={cn(
                    "relative flex items-center px-3 py-2.5 rounded-lg text-left transition-colors mx-0.5 border border-border focus:outline-none focus:ring-2 focus:ring-ink-900/10",
                    selected
                      ? "bg-[#EEEDFE] text-ink-900"
                      : "bg-surface-raised text-ink-600 hover:bg-surface-sunken",
                  )}
                >
                  <motion.span
                    animate={
                      reduceMotion ? undefined : { scale: selected ? 1.1 : 1 }
                    }
                    transition={{ duration: duration.fast, ease }}
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 ml-1",
                      selected ? "text-seg1" : "text-ink-400",
                    )}
                  >
                    <SegmentIcon className="h-3.5 w-3.5" />
                  </motion.span>
                  <span className="text-[13px] leading-tight pl-2 truncate">
                    {seg.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="flex flex-col gap-1.5 pt-1"
          variants={reduceMotion ? undefined : stagger.item}
        >
          <Button
            variant="brand"
            size="lg"
            className="w-full"
            onClick={onRun}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Insights
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="px-4 sm:px-5 py-4 border-t border-border flex flex-col gap-1 shrink-0"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.normal, delay: 0.15, ease }}
      >
        <button
          type="button"
          onClick={handleNavigateCompare}
          className={cn(
            "flex items-center gap-2.5 px-2 py-2 rounded-lg text-[13px] transition-colors",
            activeView === "compare"
              ? "bg-[#EEEDFE] text-ink-900 font-medium"
              : "text-ink-600 hover:bg-surface-sunken",
          )}
        >
          <GitCompare
            className={cn(
              "h-4 w-4",
              activeView === "compare" ? "text-seg1" : "text-ink-400",
            )}
          />
          Comparison
        </button>
        <button className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-[13px] text-ink-600 hover:bg-surface-sunken transition-colors">
          <Settings className="h-4 w-4 text-ink-400" />
          Settings
        </button>

        <div className="mt-3 flex items-center gap-2.5 rounded-xl border border-border bg-surface-base p-2.5">
          <div className="w-8 h-8 rounded-full bg-[#EEEDFE] flex items-center justify-center text-[11px] font-medium text-seg1 shrink-0">
            AJ
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-ink-900 truncate">
              Alex Johnson
            </p>
            <p className="text-[11px] text-ink-500 truncate">Strategy Team</p>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
