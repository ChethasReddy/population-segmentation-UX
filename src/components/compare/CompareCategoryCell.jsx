import * as LucideIcons from "lucide-react";
import { CATEGORIES, CATEGORY_PROMPTS } from "../../lib/data";

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
  confidence: { bg: "bg-surface-sunken", fg: "text-ink-500" },
};

export function CompareCategoryCell({ row }) {
  const category = CATEGORIES.find((c) => c.id === row.id);
  const Icon = LucideIcons[category?.icon] || LucideIcons.LayoutGrid;
  const colors = COLOR_MAP[row.id] || { bg: "bg-surface-sunken", fg: "text-ink-500" };

  return (
    <div className="flex items-start gap-2.5 min-w-0 w-full">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colors.bg}`}
      >
        <Icon className={`h-4 w-4 ${colors.fg}`} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium text-ink-900 leading-tight break-words">
          {row.label}
        </p>
        {CATEGORY_PROMPTS[row.id] && (
          <p className="text-[11px] text-ink-400 leading-relaxed mt-1 break-words">
            {CATEGORY_PROMPTS[row.id]}
          </p>
        )}
      </div>
    </div>
  );
}
