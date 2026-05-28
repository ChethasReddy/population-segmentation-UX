import { cn } from "../lib/utils";

function stripOrderedPrefix(text) {
  return text
    .replace(/^\d+[.)]\s+/, "")
    .replace(/^\d+\s*[-–—]\s+/, "")
    .trim();
}

export function InsightBulletList({ items = [], ordered = false, className }) {
  if (!items.length) {
    return (
      <p className={cn("text-[12px] text-ink-400", className)}>No insight generated.</p>
    );
  }

  const listClass = cn(
    "text-[13px] leading-relaxed text-ink-700 break-words [overflow-wrap:anywhere]",
    ordered ? "list-decimal pl-4 space-y-2" : "list-disc pl-4 space-y-2",
    className,
  );

  const Tag = ordered ? "ol" : "ul";

  return (
    <Tag className={listClass}>
      {items.map((item, index) => (
        <li key={index}>{ordered ? stripOrderedPrefix(item) : item}</li>
      ))}
    </Tag>
  );
}
