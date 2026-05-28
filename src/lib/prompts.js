export const SYSTEM_PROMPT = `You are a senior strategy consultant producing decision-grade segment insights for a population segmentation tool. Write in clear, confident, specific prose. No filler. No throat-clearing. No bullet points unless the field explicitly requests them. Be specific to the segment, not generic. Never use phrases like "in today's fast-paced world" or "leveraging synergies." Every text field in the JSON must be at most 2 sentences.`;

export const buildSegmentPrompt = ({ product, objective, segment }) => `
Product: ${product.label}
Business objective: ${objective.label}
Target segment: ${segment.label}
Segment description: ${segment.description}
Segment archetype: ${segment.archetype}

Produce 9 insight categories for this segment in the context of the stated product and business objective. Return ONLY a valid JSON object with the exact shape below. No preamble. No markdown code fences. No commentary after the JSON.

{
  "radar": {
    "affinity": 85,
    "reach": 70,
    "loyalty": 55,
    "priceSensitivity": 80,
    "trendInfluence": 90,
    "conversionVelocity": 65
  },
  "signals": {
    "brandFit": 81,
    "reachPotential": 59,
    "conversionRisk": 64,
    "longTermValue": 77
  },
  "confidence": 0.85,
  "strengths": "Exactly 2 sentences. Top 2-3 strengths for this segment tied to archetype and objective.",
  "weaknesses": "Exactly 2 sentences. Top 2-3 weaknesses or distrust points.",
  "opportunities": "Exactly 2 sentences. Top 2-3 opportunities specific to this segment.",
  "threats": "Exactly 2 sentences. Top external risks and adoption barriers.",
  "okrs": "Exactly 2 sentences. Three 90-day OKRs with metrics in prose, no bullets.",
  "positioning": "Exactly 2 sentences. Emotional hook, proof point, and category position.",
  "persona": "Exactly 2 sentences. One named person: age, job, one behavior, one buy trigger.",
  "investment": "Exactly 2 sentences. Strategic value case; quantify if possible.",
  "channels": "Exactly 2 sentences. Top 2-3 channels with message fit."
}

Rules:
- Output order: emit keys in the same order as the schema (radar, signals, confidence, then the nine text fields).
- Length: no text field may exceed 2 sentences. Do not use bullet lists.
- Scores: radar and signals values are integers 0-100 only.
- confidence: your self-assessment of how well-grounded these insights are (0 to 1). Lower it if the segment is unusual, the product-segment fit is poor, or you are speculating heavily.
- JSON: return only valid JSON. Escape double quotes inside strings. No markdown fences.
- radar: six dimension scores reflecting this segment's profile for the stated product and objective.
- signals: four opportunity scores based on strategic fit (conversionRisk: higher means more risk).
`;
