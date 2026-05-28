import { llmGenerate } from "./llm";
import { SYSTEM_PROMPT, buildSegmentPrompt } from "./prompts";
import { toBulletItems } from "./utils";

export { toBulletItems } from "./utils";

const BULLET_FIELD_KEYS = [
  "strengths",
  "weaknesses",
  "opportunities",
  "threats",
  "okrs",
  "positioning",
  "persona",
  "investment",
  "channels",
];

const RADAR_KEYS = [
  "affinity",
  "reach",
  "loyalty",
  "priceSensitivity",
  "trendInfluence",
  "conversionVelocity",
];

const SIGNAL_KEYS = [
  "brandFit",
  "reachPotential",
  "conversionRisk",
  "longTermValue",
];

const clampScore = (val) =>
  Math.min(100, Math.max(0, Math.round(Number(val) || 0)));

function normalizeBulletFields(parsed) {
  for (const key of BULLET_FIELD_KEYS) {
    const items = toBulletItems(parsed[key]);
    if (items.length < 2) {
      throw new Error(`LLM response missing or invalid field: ${key}`);
    }
    parsed[key] = items;
  }
  return parsed;
}

function parseLLMResponse(rawText) {
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*\n?/, "")
      .replace(/\n?```\s*$/, "");
  }
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`Failed to parse LLM JSON response: ${err.message}`);
  }

  normalizeBulletFields(parsed);

  if (typeof parsed.confidence !== "number") {
    parsed.confidence = 0.75;
  }

  if (!parsed.radar || typeof parsed.radar !== "object") {
    throw new Error("LLM response missing radar or signals fields");
  }
  if (!parsed.signals || typeof parsed.signals !== "object") {
    throw new Error("LLM response missing radar or signals fields");
  }

  parsed.radar = Object.fromEntries(
    RADAR_KEYS.map((key) => [key, clampScore(parsed.radar[key])]),
  );
  parsed.signals = Object.fromEntries(
    SIGNAL_KEYS.map((key) => [key, clampScore(parsed.signals[key])]),
  );

  return parsed;
}

export async function generateSegmentInsights(ctx, providerId = "anthropic") {
  const result = await llmGenerate(
    {
      system: SYSTEM_PROMPT,
      prompt: buildSegmentPrompt(ctx),
      maxTokens: 2000,
    },
    providerId,
  );
  const parsed = parseLLMResponse(result.text);
  return {
    ...parsed,
    _meta: {
      model: result.model,
      latencyMs: result.latencyMs,
      usage: result.usage,
    },
  };
}
