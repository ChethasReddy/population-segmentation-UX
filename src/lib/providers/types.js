// Every provider must implement this shape:
//
//   generate({ system, prompt, maxTokens }) => Promise<{
//     text: string,
//     logprobs: object | null,
//     model: string,
//     usage: { inputTokens, outputTokens },
//     latencyMs: number,
//   }>
//
// The Edge Function selects which provider based on the ?provider= query param.

export const PROVIDER_IDS = ['anthropic', 'openai']
export const DEFAULT_PROVIDER = 'anthropic'
