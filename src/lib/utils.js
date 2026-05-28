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
