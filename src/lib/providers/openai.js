export const openaiProvider = {
  id: "openai",
  supportsLogprobs: true,

  async generate({ system, prompt, maxTokens = 3500, logprobs = false }) {
    const start = Date.now();
    const res = await fetch("/api/generate?provider=openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system,
        prompt,
        maxTokens,
        logprobs,
        top_logprobs: logprobs ? 5 : 0,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `OpenAI request failed: ${res.status}`);
    }
    const data = await res.json();
    return {
      text: data.text,
      logprobs: data.logprobs || null,
      model: data.model || "gpt-5.5",
      usage: data.usage || {},
      latencyMs: Date.now() - start,
    };
  },
};
