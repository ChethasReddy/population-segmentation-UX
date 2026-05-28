const MOCK_DELAY_MS = 900;

export function isMockInsightsEnabled() {
  return import.meta.env.VITE_USE_MOCK_INSIGHTS === "true";
}

export async function generateMockSegmentInsights(ctx) {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  const { product, objective, segment } = ctx;
  const seg = segment.label;
  const prod = product.label;
  const obj = objective.label;

  return {
    strengths: `${prod} resonates with ${seg} when messaging leads with authenticity and concrete proof. Their ${segment.archetype.toLowerCase()} mindset responds to clear value framing tied to ${obj.toLowerCase()}. Community-led narratives are likely to outperform broad generic ads.`,
    weaknesses: `${seg} may reject claims that feel vague on tradeoffs. Long and dense value communication can reduce attention before intent forms. Price transparency and trust signals are required early in the journey.`,
    opportunities: `For ${obj.toLowerCase()}, test creator-led social proof with short format demos and segment-native language. Pair this with a lightweight comparison experience that removes friction in first-session exploration. Referral mechanics can amplify adoption within this audience.`,
    threats: `Competing brands can mimic top-funnel messaging quickly and erode differentiation. Platform algorithm shifts can reduce reach efficiency for the same creative strategy. Macro price sensitivity can delay conversion if value is not explicit.`,
    okrs: "Lift qualified segment consideration by 15 percent in 90 days. Reach 25 percent click-through from segment-matched creator assets. Reduce cost per engaged visit by 10 percent while keeping recall above 60 percent.",
    positioning: `Position ${prod} for ${seg} as the practical premium choice: culturally fluent, evidence-backed, and easy to evaluate. Lead with identity alignment, then reinforce with measurable proof and transparent ownership expectations. Keep tone direct and specific.`,
    persona: `Maya is 24, works in content production, and uses peer recommendations to shortlist products quickly. She values brands that match her identity but still provide hard proof before purchase. She buys when the product story is both credible and socially shareable.`,
    investment: `${seg} can produce durable LTV through repeat advocacy and strong earned amplification. Winning this segment during ${obj.toLowerCase()} builds a reference base that supports adjacent segment expansion. Scenario analysis indicates efficient CAC when creator fit is high.`,
    channels: `Prioritize Instagram and TikTok creator partnerships, high-intent landing pages, and community channels where this segment already compares options. Use concise proof clips for retargeting and reserve long-form assets for post-click validation.`,
    confidence: 0.86,
    _meta: {
      model: "mock",
      latencyMs: MOCK_DELAY_MS,
      usage: { inputTokens: 0, outputTokens: 0 },
    },
  };
}
