export const SYSTEM_PROMPT = `You are a senior strategy consultant producing decision-grade segment insights for a population segmentation tool. Write in clear, confident, specific prose. No filler. No throat-clearing. No bullet points unless the field explicitly requests them. Be specific to the segment, not generic. Never use phrases like "in today's fast-paced world" or "leveraging synergies."`;

export const buildSegmentPrompt = ({ product, objective, segment }) => `
Product: ${product.label}
Business objective: ${objective.label}
Target segment: ${segment.label}
Segment description: ${segment.description}
Segment archetype: ${segment.archetype}

Produce 9 insight categories for this segment in the context of the stated product and business objective. Return ONLY a valid JSON object with the exact shape below. No preamble. No markdown code fences. No commentary after the JSON.

{
  "strengths": "3-4 sentences identifying the top 2-3 product strengths that matter most to this specific segment. Tie each to the segment's archetype and the stated objective.",
  "weaknesses": "3-4 sentences on the top 2-3 things this segment would dislike, distrust, or perceive as weakness. Be honest, not defensive.",
  "opportunities": "3-4 sentences identifying 2-3 distinct product or brand opportunities unlocked by targeting this segment. Focus on what is uniquely possible with this group versus the general market.",
  "threats": "3-4 sentences on the top external risks: competitive threats, behavioral risks, and adoption barriers specific to this segment.",
  "okrs": "A single 3-4 sentence paragraph covering three concrete 90-day marketing OKRs with clear metrics and target numbers. Keep it prose-style, not bullets or numbered lists.",
  "positioning": "3-4 sentences covering the emotional hook, the rational proof point, and the category we should occupy in this segment's mind.",
  "persona": "A vivid 4-5 sentence paragraph describing one specific person in this segment. Include their name, age, occupation, a defining behavior, what they would say about products like this, and what would actually make them buy. Make it feel like a real person, not a stock template.",
  "investment": "3-4 sentences making the strategic case: why this segment is valuable for growth, LTV, market expansion, or moat-building. Quantify where you can.",
  "channels": "3-4 sentences naming the top 2-3 specific channels (platforms, partnerships, contexts) and the message-channel fit for each. Be concrete about platforms, not generic about 'digital marketing.'",
  "confidence": 0.85
}

The confidence value is your self-assessment of how well-grounded these insights are (0 to 1). Lower it if the segment is unusual, the product-segment fit is poor, or you are speculating heavily.
`;
