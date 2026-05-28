import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export async function runWithConcurrency(tasks, limit = 2) {
  const results = []
  for (let i = 0; i < tasks.length; i += limit) {
    const batch = tasks.slice(i, i + limit)
    const batchResults = await Promise.all(batch.map(fn => fn()))
    results.push(...batchResults)
  }
  return results
}

const DEFAULT_MAX_ITEMS = 4

function splitLegacyString(text) {
  const trimmed = text.trim()
  if (!trimmed) return []

  const markdownBullets = trimmed
    .split(/\n+/)
    .map((line) => line.replace(/^[-*•]\s+/, '').trim())
    .filter(Boolean)
  if (markdownBullets.length >= 2) return markdownBullets

  const sentences = trimmed
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
  if (sentences.length >= 2) return sentences

  return [trimmed]
}

/** Normalize LLM or cached insight text into 2–4 bullet strings. */
export function toBulletItems(value, { maxItems = DEFAULT_MAX_ITEMS } = {}) {
  let items = []

  if (Array.isArray(value)) {
    items = value
      .filter((item) => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean)
  } else if (typeof value === 'string' && value.trim()) {
    items = splitLegacyString(value)
  }

  if (items.length === 0) return []
  if (items.length === 1 && items[0].length > 80) {
    const split = splitLegacyString(items[0])
    if (split.length > 1) items = split
  }

  return items.slice(0, maxItems).filter((item) => item.length >= 3)
}
