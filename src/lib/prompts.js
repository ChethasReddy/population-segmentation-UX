export const SYSTEM_PROMPT = `You are a senior strategy consultant producing decision-grade segment insights for a population segmentation tool. Write in clear, confident, specific language. No filler. No throat-clearing. Be specific to the segment, not generic. Never use phrases like "in today's fast-paced world" or "leveraging synergies." Each insight text field must be a JSON array of 2-4 short bullet strings (one idea per string, max ~120 characters each).`;

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
  "strengths": ["Short bullet on strength one.", "Short bullet on strength two.", "Short bullet on strength three."],
  "weaknesses": ["Short bullet on weakness one.", "Short bullet on weakness two."],
  "opportunities": ["Short bullet on opportunity one.", "Short bullet on opportunity two."],
  "threats": ["Short bullet on threat one.", "Short bullet on threat two."],
  "okrs": ["90-day OKR one with metric.", "90-day OKR two with metric.", "90-day OKR three with metric."],
  "positioning": ["Emotional hook bullet.", "Proof point bullet.", "Category position bullet."],
  "persona": ["Named person, age, job.", "One defining behavior.", "One buy trigger."],
  "investment": ["Strategic value bullet.", "Quantified upside or payback bullet."],
  "channels": ["Channel one with message fit.", "Channel two with message fit."]
}

Rules:
- Output order: emit keys in the same order as the schema (radar, signals, confidence, then the nine text fields).
- Text fields: each of strengths, weaknesses, opportunities, threats, positioning, persona, investment, and channels must be a JSON array of 2-4 strings. Each string is one scannable bullet (not a paragraph).
- okrs: JSON array of 2-4 strings; each string is one numbered-style OKR line with a metric.
- Scores: radar and signals values are integers 0-100 only.
- confidence: your self-assessment of how well-grounded these insights are (0 to 1). Lower it if the segment is unusual, the product-segment fit is poor, or you are speculating heavily.
- JSON: return only valid JSON. Escape double quotes inside strings. No markdown fences.
- radar: six dimension scores reflecting this segment's profile for the stated product and objective.
- signals: four opportunity scores based on strategic fit (conversionRisk: higher means more risk).
`;
