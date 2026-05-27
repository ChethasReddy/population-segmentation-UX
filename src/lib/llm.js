import { anthropicProvider } from './providers/anthropic'
import { openaiProvider } from './providers/openai'
import { DEFAULT_PROVIDER } from './providers/types'

const PROVIDERS = {
  anthropic: anthropicProvider,
  openai: openaiProvider,
}

export function getProvider(id = DEFAULT_PROVIDER) {
  return PROVIDERS[id] || PROVIDERS[DEFAULT_PROVIDER]
}

export async function llmGenerate(args, providerId = DEFAULT_PROVIDER) {
  const provider = getProvider(providerId)
  return provider.generate(args)
}
