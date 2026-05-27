import { llmGenerate } from './llm'
import { SYSTEM_PROMPT, buildSegmentPrompt } from './prompts'

const REQUIRED_STRING_KEYS = [
  'strengths', 'weaknesses', 'opportunities', 'threats',
  'positioning', 'persona', 'investment', 'channels',
]

function parseLLMResponse(rawText) {
  let cleaned = rawText.trim()
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')
  }
  const firstBrace = cleaned.indexOf('{')
  const lastBrace = cleaned.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1)
  }

  let parsed
  try {
    parsed = JSON.parse(cleaned)
  } catch (err) {
    throw new Error(`Failed to parse LLM JSON response: ${err.message}`)
  }

  for (const key of REQUIRED_STRING_KEYS) {
    if (typeof parsed[key] !== 'string' || parsed[key].length < 10) {
      throw new Error(`LLM response missing or invalid field: ${key}`)
    }
  }

  if (!Array.isArray(parsed.okrs) || parsed.okrs.length < 1) {
    throw new Error('LLM response missing or invalid field: okrs (expected array)')
  }
  parsed.okrs = parsed.okrs.filter((s) => typeof s === 'string' && s.length > 5)

  if (typeof parsed.confidence !== 'number') {
    parsed.confidence = 0.75
  }
  return parsed
}

export async function generateSegmentInsights(ctx, providerId = 'anthropic') {
  const result = await llmGenerate(
    {
      system: SYSTEM_PROMPT,
      prompt: buildSegmentPrompt(ctx),
      maxTokens: 3500,
    },
    providerId
  )
  const parsed = parseLLMResponse(result.text)
  return {
    ...parsed,
    _meta: {
      model: result.model,
      latencyMs: result.latencyMs,
      usage: result.usage,
    },
  }
}
