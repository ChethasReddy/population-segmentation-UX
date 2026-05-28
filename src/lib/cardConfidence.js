const CATEGORY_OFFSETS = {
  strengths: 0.03,
  weaknesses: -0.04,
  opportunities: 0.01,
  threats: -0.06,
  okrs: 0.02,
  positioning: 0,
  persona: -0.02,
  investment: 0.04,
  channels: -0.01,
}

export function getCardConfidence(segmentConfidence, categoryId) {
  if (typeof segmentConfidence !== 'number') return null
  const offset = CATEGORY_OFFSETS[categoryId] ?? 0
  return Math.min(0.99, Math.max(0.55, segmentConfidence + offset))
}
