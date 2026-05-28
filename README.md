# SWOT Prompt Explorer

A live population segmentation tool that generates AI-powered strategic insights across customer segments. Choose a product and business objective, then explore SWOT analysis, marketing OKRs, buyer personas, channel strategy, and an investment case for each segment—with profile charts and side-by-side comparison.

**Live:** `https://your-production-url.vercel.app` — replace with your Vercel URL after `vercel --prod` and verify the app loads with working LLM calls.

---

## What I built

- **Segment insights:** One structured LLM call per segment returns all nine categories plus radar and opportunity scores; responses are parsed and validated as JSON before display.
- **First-load experience:** Default product (Electric Cars) and objective (Increase Awareness) auto-generate insights for all four segments on open. Changing product or objective requires **Generate Insights**.
- **Session cache:** Results are cached in memory by `product + objective + segment`. Switching back to a previously generated combination restores cached data instantly with no API calls.
- **Compare mode:** Full-page side-by-side table across segments (all nine insight categories plus a confidence ring per segment). Cells show formatted bullet lists; export copies comparison JSON to clipboard or downloads a file.
- **Segment profile:** Radar chart and opportunity signal bars are derived from LLM output for that segment, not static mock data.
- **Architecture:** Vercel Edge Function proxy at `/api/generate` so API keys never reach the browser. Provider abstraction with Anthropic as the active provider and OpenAI scaffolded for future logprob-based confidence.

---

## One tradeoff I made consciously

I shipped SWOT generation as **one structured-JSON call per segment**, not nine separate category prompts. Nine calls per segment would mean up to 36 parallel requests on first load (four segments), with repeated context, higher cost, more rate-limit risk, and more failure points. One call per segment means four parallel requests (concurrency capped at two), lower cost, and a clear wave per segment as each completes—while still feeling responsive with skeleton cards and staggered motion.

---

## What I would build next

1. **Multi-provider routing** — Route persona prose to Claude and structured OKRs/SWOT to a model with native logprob support; OpenAI provider is already scaffolded.
2. **Logprob-based confidence** — Replace self-reported confidence with token-level scores where the provider supports it (Anthropic does not expose logprobs today).
3. **Compare auto-fetch** — Generate insights when a segment is added to comparison without cached data (today compare shows cached results only).
4. **Custom segments** — Free-text input with an archetype derivation call before the main insight run.
5. **Session history** — Persist and recall past analyses by product and objective (would need a backend or durable local storage).

---

## Local development

Requires Node.js and an Anthropic API key.

```bash
npm install
cp .env.example .env.local
# Set ANTHROPIC_API_KEY in .env.local
```

Use Vercel's dev server, not Vite alone—the app calls `/api/generate`, which only exists with the Vercel runtime:

```bash
vercel login
vercel link
vercel dev
```

`npm run dev` serves the frontend only; LLM requests will 404 without `vercel dev`.

```bash
npm run build
npm run preview
```

---

## Deploy

```bash
vercel --prod
```

Set in Vercel dashboard → Settings → Environment Variables:

- `ANTHROPIC_API_KEY` (required)
- `ANTHROPIC_MODEL` (optional, default `claude-sonnet-4-6`)
- `OPENAI_API_KEY` / `OPENAI_MODEL` (optional)

Update the **Live** link at the top with your production URL.

---

## Stack

Vite, React 18, Tailwind CSS, framer-motion, recharts, lucide-react. Claude via Anthropic API through a Vercel Edge Function. In-memory session cache keyed by `product:objective:segment`. Plain JavaScript.
