export const anthropicProvider = {
  id: "anthropic",
  supportsLogprobs: false,

  async generate({ system, prompt, maxTokens = 1000 }) {
    const start = Date.now();
    const res = await fetch("/api/generate?provider=anthropic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, prompt, maxTokens }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Anthropic request failed: ${res.status}`);
    }
    const data = await res.json();
    return {
      text: data.text,
      logprobs: null,
      model: data.model || "claude-sonnet-4-6",
      usage: data.usage || {},
      latencyMs: Date.now() - start,
    };
  },
};
