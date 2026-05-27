# AGENTS.md

## Subconscious.ai SWOT Prompt Explorer

This document is the complete build specification for an LLM-powered population segmentation web app. Follow it end to end. Do not deviate from the tech stack, file structure, or design system without explicit instruction.

---

## 1. Project Context

This is a case study deliverable for a Founding Engineer interview at Subconscious.ai. The product is an internal-grade web app that lets a user select a product, business objective, and customer segment, then queries an LLM to produce SWOT-style insights across 9 categories. Results render in a clean, browsable UI with light data visualization.

The evaluation criteria are:
- Clarity and UX of the interface
- Output readability and structure
- Visual quality: spacing, motion, hierarchy
- Speed of iteration and polish

The deliverable is a live deployed URL on Vercel. Not a GitHub repo.

---

## 2. Mission Statement

Build a tool that feels like a serious decision-making product, not a playground. Think early Conjoint.ly meets Notion. Fast, opinionated, minimal. The user should land on the page, see real generated insights immediately, switch between segments instantly, and walk away thinking "this is something a strategy team would actually use."

---

## 3. Core Architectural Decisions

These are the load-bearing decisions for the build. Internalize them before writing code.

### 3.1 One LLM call per segment, not 36

Each segment fires exactly one LLM call that returns all 9 categories as structured JSON. With 4 segments active, the app makes 4 parallel API calls on first load, not 36. This is roughly 9x cheaper, more reliable, less rate-limit-prone, and faster end to end.

Cards within a segment arrive together when that segment's call completes. The visual rhythm is "waves per segment" rather than chaotic card-by-card resolution.

### 3.2 Provider abstraction layer from day one

All LLM calls go through a provider interface. The case study ships with Anthropic only, but the abstraction supports OpenAI as a second provider. This makes the multi-LLM future-work section in the README credible rather than aspirational, and the abstraction itself only costs 30 minutes of build time.

### 3.3 Edge Function proxy

The API key never touches the browser. All LLM calls route through a Vercel Edge Function at `/api/generate` which holds the key in a server-side environment variable.

### 3.4 No backend database

State lives in React. No persistence layer. The user starts fresh each session. This is intentional scope control for the time budget.

---

## 4. Tech Stack (Locked)

Use exactly these. Do not substitute.

| Layer | Choice | Why |
|---|---|---|
| Build tool | Vite (latest) | Fast dev server, zero config |
| Framework | React 18 | Standard, well-supported |
| Styling | Tailwind CSS v3 | Utility-first, fast iteration |
| Components | shadcn-style primitives (inlined) | No CLI dependency, accessible |
| Icons | lucide-react | Clean, consistent outline icons |
| Animation | framer-motion | Card entrance, segment transitions |
| Charts | recharts | Radar chart for segment profile |
| Markdown | react-markdown | Render LLM responses cleanly |
| LLM provider (ship) | Anthropic Claude Opus 4.7 | Best persona quality |
| LLM provider (architected) | OpenAI GPT-5.5 | Logprobs support, future-work credibility |
| Hosting | Vercel | Edge Functions, env vars, one-command deploy |

Package manager: npm. Language: plain JavaScript (no TypeScript) to ship faster.

---

## 5. Project Structure

Create exactly this structure. Do not add files outside of it without reason.

```
swot-explorer/
├── api/
│   └── generate.js                  Vercel Edge Function (multi-provider proxy)
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/                      Inlined shadcn primitives
│   │   │   ├── button.jsx
│   │   │   ├── select.jsx
│   │   │   ├── card.jsx
│   │   │   ├── badge.jsx
│   │   │   ├── skeleton.jsx
│   │   │   └── tabs.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TopBar.jsx
│   │   ├── SegmentTabs.jsx
│   │   ├── SegmentProfile.jsx       Radar chart + opportunity bars
│   │   ├── InsightCard.jsx
│   │   ├── InsightGrid.jsx
│   │   ├── CategoryFilter.jsx
│   │   ├── ConfidenceBadge.jsx
│   │   ├── CompareView.jsx
│   │   └── EmptyState.jsx
│   ├── lib/
│   │   ├── providers/
│   │   │   ├── types.js             Provider interface contract
│   │   │   ├── anthropic.js         Anthropic client (only one wired in for MVP)
│   │   │   └── openai.js            OpenAI client (file stub only, not required for ship)
│   │   ├── llm.js                   Unified entry point (selects provider)
│   │   ├── prompts.js               SYSTEM_PROMPT and buildSegmentPrompt only
│   │   ├── insights.js              JSON parser and generateSegmentInsights
│   │   ├── data.js                  Default products, objectives, segments
│   │   └── utils.js                 cn() helper + small helpers
│   ├── hooks/
│   │   └── useInsights.js           Manages parallel per-segment calls
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                    Tailwind directives + custom CSS vars
├── .env.local                       API keys (gitignored)
├── .env.example                     Template for env vars
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── vercel.json                      Edge Function config
└── README.md
```

---

## 6. Setup Phase

Execute these commands in order.

```bash
npm create vite@latest swot-explorer -- --template react
cd swot-explorer
npm install
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
npm install lucide-react framer-motion recharts react-markdown clsx tailwind-merge class-variance-authority
npm install @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-tabs
```

For shadcn primitives, do not run the shadcn CLI. Manually create the 6 files in `src/components/ui/` using the standard shadcn implementations from their docs as reference, inlined. This avoids dependency hell and version drift.

Configure `tailwind.config.js` to scan `./index.html` and `./src/**/*.{js,jsx}`, and extend the theme with the color tokens in Section 8.

---

## 7. Environment Variables

Create `.env.local` at the project root:

```
ANTHROPIC_API_KEY=sk-ant-api03-REPLACE_ME
OPENAI_API_KEY=sk-REPLACE_ME_OR_LEAVE_BLANK_FOR_NOW
```

Create `.env.example` (this one gets committed):

```
ANTHROPIC_API_KEY=your-anthropic-key-here
OPENAI_API_KEY=your-openai-key-here
```

Verify `.env.local` is in `.gitignore`. Vite scaffolds this by default.

For Vercel deployment, both variable names must be set in the dashboard under Project Settings, Environment Variables, for all environments (Production, Preview, Development). The OpenAI key can be omitted at first since the app ships with Anthropic only.

---

## 8. Design System

### 8.1 Color Tokens

Add these to `tailwind.config.js` under `theme.extend.colors`:

```js
colors: {
  ink: {
    900: '#0A0A0B',
    700: '#2A2A2E',
    500: '#6B6B73',
    300: '#A8A8B0',
    100: '#E8E8EB',
  },
  surface: {
    base: '#FAFAFA',
    raised: '#FFFFFF',
    sunken: '#F4F4F5',
  },
  border: {
    DEFAULT: 'rgba(0, 0, 0, 0.08)',
    strong: 'rgba(0, 0, 0, 0.15)',
  },
  strengths:     { bg: '#EAF3DE', fg: '#3B6D11', accent: '#639922' },
  weaknesses:    { bg: '#FAEEDA', fg: '#854F0B', accent: '#BA7517' },
  opportunities: { bg: '#E6F1FB', fg: '#185FA5', accent: '#378ADD' },
  threats:       { bg: '#FCEBEB', fg: '#A32D2D', accent: '#E24B4A' },
  okrs:          { bg: '#EEEDFE', fg: '#3C3489', accent: '#7F77DD' },
  positioning:   { bg: '#E1F5EE', fg: '#0F6E56', accent: '#1D9E75' },
  persona:       { bg: '#FBEAF0', fg: '#72243E', accent: '#D4537E' },
  investment:    { bg: '#FAECE7', fg: '#712B13', accent: '#D85A30' },
  channels:      { bg: '#F1EFE8', fg: '#444441', accent: '#888780' },
  seg1: '#7F77DD',
  seg2: '#1D9E75',
  seg3: '#BA7517',
  seg4: '#D4537E',
}
```

### 8.2 Typography

System font stack only. No custom font loading.

```css
font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif;
```

Type scale:
- Body: `text-sm` (14px)
- Card body: `text-[13px]` with `leading-relaxed`
- Card label: `text-[10px]` uppercase tracking-wider
- Section title: `text-[15px] font-medium`
- Sidebar label: `text-[10px]` uppercase tracking-wider

Two font weights only: 400 (regular) and 500 (medium). Never 700.

### 8.3 Spacing

- Card padding: `p-4` (16px)
- Card gap in grid: `gap-3` (12px)
- Sidebar padding: `p-5` (20px)
- Sidebar section gap: `gap-5` (20px)
- Border radius: cards use `rounded-xl` (12px), buttons/selects use `rounded-lg` (8px)

### 8.4 Borders

All borders use `border` with `border-border` (the rgba token). No thick borders, no decorative outlines.

### 8.5 Motion

Use framer-motion only for:
- Card entrance: stagger fade-in-up, 0.04s delay between cards, 0.25s duration
- Segment tab switch: 0.2s fade
- Loading skeleton: Tailwind's `animate-pulse`

No bouncy springs, no rotations, no decorative motion.

---

## 9. Default Data

Create `src/lib/data.js`:

```js
export const PRODUCTS = [
  { id: 'ev',       label: 'Electric Vehicles' },
  { id: 'coffee',   label: 'Specialty Coffee' },
  { id: 'saas',     label: 'SaaS Analytics Platform' },
  { id: 'fitness',  label: 'Connected Fitness Equipment' },
  { id: 'banking',  label: 'Digital Banking App' },
]

export const OBJECTIVES = [
  { id: 'awareness',     label: 'Increase Awareness' },
  { id: 'consideration', label: 'Increase Consideration' },
  { id: 'conversion',    label: 'Increase Conversion' },
  { id: 'retention',     label: 'Improve Retention' },
  { id: 'expansion',     label: 'Expand Market Share' },
]

export const SEGMENTS = [
  {
    id: 'gen-z-creators',
    label: 'Gen Z Creators',
    description: 'Ages 18-26, social-first, authenticity-driven',
    color: 'seg1',
    archetype: 'Identity and culture buyers',
  },
  {
    id: 'urban-climate',
    label: 'Urban Climate Advocates',
    description: 'Ages 28-40, values-led, eco-literate',
    color: 'seg2',
    archetype: 'Purpose and values buyers',
  },
  {
    id: 'cost-sensitive-smb',
    label: 'Cost-Sensitive SMB Owners',
    description: 'Ages 35-55, time-poor, ROI-obsessed',
    color: 'seg3',
    archetype: 'Practicality buyers',
  },
  {
    id: 'enterprise-it',
    label: 'Enterprise IT Leaders',
    description: 'Ages 40-58, risk-averse, procurement-driven',
    color: 'seg4',
    archetype: 'Security and scale buyers',
  },
]

export const CATEGORIES = [
  { id: 'strengths',     label: 'Strengths',           icon: 'Zap',            color: 'strengths' },
  { id: 'weaknesses',    label: 'Weaknesses',          icon: 'AlertTriangle',  color: 'weaknesses' },
  { id: 'opportunities', label: 'Opportunities',       icon: 'TrendingUp',     color: 'opportunities' },
  { id: 'threats',       label: 'Threats',             icon: 'ShieldOff',      color: 'threats' },
  { id: 'okrs',          label: 'Marketing OKRs',      icon: 'Target',         color: 'okrs' },
  { id: 'positioning',   label: 'Market Positioning',  icon: 'Compass',        color: 'positioning' },
  { id: 'persona',       label: 'Buyer Persona',       icon: 'User',           color: 'persona' },
  { id: 'investment',    label: 'Investment Case',     icon: 'TrendingUpDown', color: 'investment' },
  { id: 'channels',      label: 'Channels and Distribution', icon: 'Radio',    color: 'channels' },
]

export const DEFAULT_STATE = {
  product: 'ev',
  objective: 'consideration',
  activeSegments: ['gen-z-creators', 'urban-climate', 'cost-sensitive-smb', 'enterprise-it'],
  selectedSegment: 'gen-z-creators',
}

export const RADAR_DATA = {
  'gen-z-creators':     { affinity: 92, reach: 78, loyalty: 45, priceSens: 82, trendInfl: 95, convVel: 68 },
  'urban-climate':      { affinity: 85, reach: 62, loyalty: 78, priceSens: 55, trendInfl: 72, convVel: 58 },
  'cost-sensitive-smb': { affinity: 64, reach: 70, loyalty: 82, priceSens: 95, trendInfl: 35, convVel: 75 },
  'enterprise-it':      { affinity: 58, reach: 45, loyalty: 92, priceSens: 38, trendInfl: 22, convVel: 42 },
}
```

---

## 10. Prompt: One Call Per Segment, Structured JSON

Create `src/lib/prompts.js`. The prompt asks the LLM to return all 9 categories plus a self-reported confidence score in a single structured JSON response. This is the single most important file in the build for output quality. Do not modify the prompt phrasing without testing.

```js
export const SYSTEM_PROMPT = `You are a senior strategy consultant producing decision-grade segment insights for a population segmentation tool. Write in clear, confident, specific prose. No filler. No throat-clearing. No bullet points unless the field explicitly requests them. Be specific to the segment, not generic. Never use phrases like "in today's fast-paced world" or "leveraging synergies."`

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
  "okrs": ["First marketing OKR with a specific metric and 90-day target number", "Second OKR with metric and target", "Third OKR with metric and target"],
  "positioning": "3-4 sentences covering the emotional hook, the rational proof point, and the category we should occupy in this segment's mind.",
  "persona": "A vivid 4-5 sentence paragraph describing one specific person in this segment. Include their name, age, occupation, a defining behavior, what they would say about products like this, and what would actually make them buy. Make it feel like a real person, not a stock template.",
  "investment": "3-4 sentences making the strategic case: why this segment is valuable for growth, LTV, market expansion, or moat-building. Quantify where you can.",
  "channels": "3-4 sentences naming the top 2-3 specific channels (platforms, partnerships, contexts) and the message-channel fit for each. Be concrete about platforms, not generic about 'digital marketing.'",
  "confidence": 0.85
}

The confidence value is your self-assessment of how well-grounded these insights are (0 to 1). Lower it if the segment is unusual, the product-segment fit is poor, or you are speculating heavily.
`
```

---

## 11. Provider Abstraction Layer

The unified interface every LLM provider implements. This is what makes the multi-LLM future-work claim credible.

### 11.1 Interface contract

Create `src/lib/providers/types.js`:

```js
// Every provider must implement this shape:
//
//   generate({ system, prompt, maxTokens, responseFormat }) => Promise<{
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
```

### 11.2 Anthropic provider

Create `src/lib/providers/anthropic.js`:

```js
export const anthropicProvider = {
  id: 'anthropic',
  model: 'claude-opus-4-7',
  supportsLogprobs: false,

  async generate({ system, prompt, maxTokens = 3500 }) {
    const start = Date.now()
    const res = await fetch('/api/generate?provider=anthropic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system, prompt, maxTokens }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `Anthropic request failed: ${res.status}`)
    }
    const data = await res.json()
    return {
      text: data.text,
      logprobs: null,
      model: data.model || 'claude-opus-4-7',
      usage: data.usage || {},
      latencyMs: Date.now() - start,
    }
  },
}
```

### 11.3 OpenAI provider (file stub, optional for MVP)

The OpenAI file exists so the abstraction layer is complete and so the future-work section in the README is concrete. It is NOT required to be functional for MVP acceptance. If time is tight, create the file with the code below and move on. Do not test it, do not wire it up.

Create `src/lib/providers/openai.js`:

```js
export const openaiProvider = {
  id: 'openai',
  model: 'gpt-5.5',
  supportsLogprobs: true,

  async generate({ system, prompt, maxTokens = 3500, logprobs = false }) {
    const start = Date.now()
    const res = await fetch('/api/generate?provider=openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system, prompt, maxTokens, logprobs, top_logprobs: logprobs ? 5 : 0 }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || `OpenAI request failed: ${res.status}`)
    }
    const data = await res.json()
    return {
      text: data.text,
      logprobs: data.logprobs || null,
      model: data.model || 'gpt-5.5',
      usage: data.usage || {},
      latencyMs: Date.now() - start,
    }
  },
}
```

### 11.4 Unified entry point

Create `src/lib/llm.js`:

```js
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
```

---

## 12. Edge Function

Create `api/generate.js`. The function reads the `provider` query parameter, dispatches to the right upstream API, and returns a normalized response.

```js
export const config = { runtime: 'edge' }

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const url = new URL(req.url)
  const provider = url.searchParams.get('provider') || 'anthropic'

  let body
  try {
    body = await req.json()
  } catch {
    return jsonError(400, 'Invalid JSON body')
  }

  const { system, prompt, maxTokens = 3500 } = body
  if (!prompt) return jsonError(400, 'Missing prompt')

  if (provider === 'anthropic') {
    return callAnthropic({ system, prompt, maxTokens })
  }
  if (provider === 'openai') {
    return callOpenAI({ system, prompt, maxTokens, logprobs: body.logprobs, top_logprobs: body.top_logprobs })
  }
  return jsonError(400, `Unknown provider: ${provider}`)
}

async function callAnthropic({ system, prompt, maxTokens }) {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return jsonError(500, 'Missing ANTHROPIC_API_KEY')

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-7',
        max_tokens: maxTokens,
        system: system || 'You are a helpful assistant.',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!upstream.ok) {
      const detail = await upstream.text()
      return jsonError(upstream.status, 'Upstream error from Anthropic', detail)
    }

    const data = await upstream.json()
    const text = data.content?.[0]?.text || ''
    return jsonOk({
      text,
      model: data.model,
      usage: { inputTokens: data.usage?.input_tokens, outputTokens: data.usage?.output_tokens },
    })
  } catch (err) {
    return jsonError(500, 'Anthropic request failed', err.message)
  }
}

async function callOpenAI({ system, prompt, maxTokens, logprobs, top_logprobs }) {
  const key = process.env.OPENAI_API_KEY
  if (!key) return jsonError(500, 'Missing OPENAI_API_KEY')

  try {
    const upstream = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.5',
        max_tokens: maxTokens,
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          { role: 'user', content: prompt },
        ],
        ...(logprobs ? { logprobs: true, top_logprobs: top_logprobs || 5 } : {}),
      }),
    })

    if (!upstream.ok) {
      const detail = await upstream.text()
      return jsonError(upstream.status, 'Upstream error from OpenAI', detail)
    }

    const data = await upstream.json()
    const choice = data.choices?.[0]
    return jsonOk({
      text: choice?.message?.content || '',
      logprobs: choice?.logprobs || null,
      model: data.model,
      usage: { inputTokens: data.usage?.prompt_tokens, outputTokens: data.usage?.completion_tokens },
    })
  } catch (err) {
    return jsonError(500, 'OpenAI request failed', err.message)
  }
}

function jsonOk(body) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

function jsonError(status, error, detail) {
  return new Response(JSON.stringify({ error, detail }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

Create `vercel.json` at project root:

```json
{
  "functions": {
    "api/generate.js": {
      "runtime": "edge"
    }
  }
}
```

---

## 13. Insights Module

The JSON parser and segment-level generator live in their own file. This keeps `prompts.js` pure (just two exports) and avoids the fragile self-import pattern.

Create `src/lib/insights.js`:

```js
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
```

The `prompts.js` file exports only `SYSTEM_PROMPT` and `buildSegmentPrompt`. Do not put the parser or the generator there.

---

## 14. State Hook

Create `src/hooks/useInsights.js`. This hook manages parallel per-segment generation.

```js
import { useState, useCallback } from 'react'
import { generateSegmentInsights } from '../lib/insights'

export function useInsights() {
  // Shape: { [segmentId]: { status: 'idle'|'loading'|'ready'|'error', insights: object|null, error: string|null } }
  const [bySegment, setBySegment] = useState({})
  const [isRunning, setIsRunning] = useState(false)

  const setSegmentState = useCallback((segmentId, patch) => {
    setBySegment((prev) => ({
      ...prev,
      [segmentId]: { ...(prev[segmentId] || {}), ...patch },
    }))
  }, [])

  const runForSegment = useCallback(async (ctx) => {
    setSegmentState(ctx.segment.id, { status: 'loading', error: null })
    try {
      const insights = await generateSegmentInsights(ctx)
      setSegmentState(ctx.segment.id, { status: 'ready', insights, error: null })
    } catch (err) {
      setSegmentState(ctx.segment.id, { status: 'error', insights: null, error: err.message })
    }
  }, [setSegmentState])

  const runForAllSegments = useCallback(async (product, objective, segments) => {
    setIsRunning(true)
    segments.forEach((seg) => setSegmentState(seg.id, { status: 'loading', error: null }))
    await Promise.all(
      segments.map((segment) =>
        generateSegmentInsights({ product, objective, segment })
          .then((insights) => setSegmentState(segment.id, { status: 'ready', insights, error: null }))
          .catch((err) => setSegmentState(segment.id, { status: 'error', insights: null, error: err.message }))
      )
    )
    setIsRunning(false)
  }, [setSegmentState])

  return { bySegment, isRunning, runForSegment, runForAllSegments }
}
```

---

## 15. Component Specifications

### 15.1 App.jsx

Top-level layout. Holds selected product, selected objective, active segments, currently-viewed segment. Renders Sidebar on the left, main column on the right (TopBar, SegmentTabs, content area).

On first mount, automatically trigger `runForAllSegments` so the app loads with real data already visible. Do not leave the user looking at a blank page on first load.

### 15.2 Sidebar.jsx

Fixed 240px wide, full-height, white background, right border. Contains:
- Logo dot + "Subconscious.ai" text
- Product select populated from PRODUCTS
- Objective select populated from OBJECTIVES
- Segments section: list of toggleable segment chips, active ones highlighted with their color dot
- Run button at the bottom: full-width, dark background, white text, triggers `runForAllSegments`. Shows spinning icon and "Running..." when isRunning is true.

### 15.3 TopBar.jsx

Horizontal bar above main content. Contains:
- Left: breadcrumb "Product · Objective" with objective in medium weight
- Left: badge showing "9 insights · N segments"
- Right: Compare button (toggles compare view), Export JSON button (copies all current insights as JSON to clipboard), Copy button (copies current segment's insights as markdown)

### 15.4 SegmentTabs.jsx

Horizontal tab strip showing active segments. Each tab has:
- A colored dot matching the segment's color
- The segment label
- Underline plus medium weight when active

Clicking a tab sets the currently-viewed segment. Use framer-motion to fade content when switching.

### 15.5 SegmentProfile.jsx

Two-column row at the top of the content area. Left card: Radar chart (recharts) showing 6 dimensions for the current segment using `RADAR_DATA`. Right card: 4 horizontal progress bars (Brand Fit, Reach Potential, Conversion Risk, Long-term Value) derived deterministically from segment ID.

Radar axes: Affinity, Reach, Loyalty, Price Sensitivity, Trend Influence, Conversion Velocity. Fill = segment color at 0.3 opacity. Stroke = segment color at full opacity. No legend.

This visualization uses heuristic mock data, intentionally. It provides instant visual structure while LLM cards stream in, and it would be the first thing to replace with LLM-derived dimension scores in a future iteration.

### 15.6 InsightCard.jsx

A single card showing one of the 9 categories. Props: `category` (id, label, icon, color), `status`, `value`, `error`.

The `value` shape differs by category:
- For `okrs`: an array of strings. Render as a numbered list (`<ol>` with each item as `<li>`).
- For all other categories: a single string. Render with react-markdown.

Layout:
- Top row: small icon in a colored square (using category's bg+fg tokens) + category label in the same fg color
- Body: the OKR list, the markdown body, skeleton lines if loading, or red error block if error
- Subtle border, white bg, rounded-xl, p-4

Use framer-motion to fade-in-up when transitioning from loading to ready (delay 0, duration 0.25).

### 15.7 InsightGrid.jsx

3-column grid (responsive: 2 on medium widths, 1 on mobile). Renders one InsightCard per category. Applies stagger animation via framer-motion: each card delayed by 0.04s relative to the previous.

Note: because all 9 categories arrive together (per-segment call), the stagger creates the visual rhythm of cards "settling in" even though they all became available at the same instant.

### 15.8 CategoryFilter.jsx

Pill row above the grid. Pills: All, SWOT, OKRs, Persona, Channels, Investment. Clicking filters which cards show.

SWOT filter shows: strengths, weaknesses, opportunities, threats only.

### 15.9 ConfidenceBadge.jsx

Small badge component rendered in the TopBar or above the grid. Shows the segment's self-reported confidence as a percentage. Color thresholds:
- 0.85 and above: green (uses `strengths.fg`)
- 0.65 to 0.84: amber (uses `weaknesses.fg`)
- Below 0.65: red (uses `threats.fg`)

Tooltip on hover: "Self-reported confidence from the model. Real logprob-based confidence is on the roadmap (requires OpenAI provider)."

### 15.10 CompareView.jsx

When the Compare button is active, replace the single-segment view with a 4-column comparison: all active segments shown side by side, one row per category. Each cell shows truncated insight text. Clicking a cell expands it inline.

This is a bonus feature. Build it last. If time runs short, ship a placeholder behind the Compare button saying "Coming soon."

### 15.11 EmptyState.jsx

Shown when no segments are active. Centered message + "Run analysis" button.

---

## 16. App Behavior

### On mount
1. Load DEFAULT_STATE
2. Immediately trigger `runForAllSegments` for the 4 default segments (4 parallel calls)
3. Show skeleton cards for all segments while loading
4. As each segment's call resolves, replace its skeleton block with the 9 rendered cards

### On changing product or objective
Do not auto-regenerate. The user must click Run to refresh. This prevents accidental API spam when toggling selects.

### On toggling a segment chip
- If activating a segment that has no cached insights yet, fire `runForSegment` for it immediately
- If deactivating, remove it from active list (do not delete cached insights, the user might re-enable)

### On switching the viewed segment tab
Instant. No new API calls. Swap which segment's cached insights are rendered.

### On Run button click
Fire `runForAllSegments` for all currently-active segments. All segment calls fire in parallel.

### Error handling
- If a segment call fails (network error, JSON parse failure, upstream API error), show a single error card spanning the grid for that segment with the error message and a Retry button
- If the API key is missing or invalid, the first failure surfaces a global toast: "Check that ANTHROPIC_API_KEY is set in your Vercel project settings."

---

## 17. Loading States

Per-segment loading: when a segment is in `loading` state, render 9 skeleton cards in the grid. Each skeleton has the same dimensions as a real card, with 3-4 shimmer bars in the body using Tailwind's `animate-pulse` and `bg-surface-sunken`. The icon area shows a faded version of the category icon.

When a segment transitions from loading to ready, the 9 cards animate in together with the stagger described in 15.7.

---

## 18. Visualizations

### Radar chart (recharts)

6 axes from `RADAR_DATA`: Affinity, Reach, Loyalty, Price Sensitivity, Trend Influence, Conversion Velocity. Values 0 to 100.

Visual config:
- Fill: segment color at 0.3 opacity
- Stroke: segment color, 1.5px
- No legend, no axis value labels, axis names only
- Container: 200x180

### Opportunity bars

4 horizontal bars in the right card of SegmentProfile:
- Brand Fit (uses segment color)
- Reach Potential (uses opportunities accent)
- Conversion Risk (uses threats accent)
- Long-term Value (uses segment color)

Each bar: 4px tall, full container width, rounded ends. Fill percentage derived from segment ID via a small hash function so the same segment always shows the same scores (deterministic mock data).

---

## 19. Build Order

Follow strictly. Do not skip ahead.

### Pre-flight (do this before anything else)

Before writing a single line of UI code, verify the Anthropic model string works. Open a terminal and run:

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-opus-4-7",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Reply with the word OK only."}]
  }'
```

If the response contains `"text": "OK"` (or close to it), you are clear to build. If it returns a model-not-found error, switch to whatever Opus model is current in the Anthropic console before proceeding and update every `claude-opus-4-7` reference in this spec accordingly.

This pre-flight check takes 2 minutes and prevents the most painful failure mode: building the full UI before realizing the model string is wrong.

### Build steps

| Step | Task | Time |
|---|---|---|
| 1 | Scaffold Vite + Tailwind + dependencies. Verify dev server runs. | 15 min |
| 2 | Create full file structure with empty files for every component. | 5 min |
| 3 | Build `data.js`, `prompts.js`, the provider files (`types.js`, `anthropic.js`, `openai.js` as stub), and `llm.js`. | 20 min |
| 4 | Build `insights.js` with the parser and `generateSegmentInsights`. | 15 min |
| 5 | Build `api/generate.js` Edge Function. Test locally with `vercel dev` and curl. | 25 min |
| 6 | Build `useInsights.js` hook. Test by calling `runForSegment` in isolation and console-logging the result. | 20 min |
| 7 | Build Sidebar with selects and segment chips. Wire up product/objective/segment state. | 30 min |
| 8 | Build TopBar and SegmentTabs. | 20 min |
| 9 | Build InsightCard and InsightGrid. Wire up the hook. Verify real cards render for one segment. | 40 min |
| 10 | Add loading skeletons and error states. | 20 min |
| 11 | Add framer-motion stagger animations. | 15 min |
| 12 | Build SegmentProfile (radar + bars). | 30 min |
| 13 | Build CategoryFilter pills and ConfidenceBadge. | 20 min |
| 14 | Build CompareView (if time remains). | 30 min |
| 15 | Polish pass: typography, spacing, hover states, focus rings, empty states. | 20 min |
| 16 | Deploy to Vercel, set env var, verify live URL works end to end. | 15 min |
| 17 | Write README.md (see Section 21). | 15 min |

Total: about 5 hours including buffer for debugging.

### Local development command

Use `vercel dev` instead of `npm run dev` once you start testing the Edge Function. `npm run dev` only runs the Vite frontend, so any call to `/api/generate` will 404. `vercel dev` emulates the full Vercel runtime locally, including the Edge Function. Install the CLI first if you have not:

```bash
npm install -g vercel
vercel login
vercel link             # link the directory to a Vercel project
vercel env pull         # pull env vars from Vercel into .env.local
vercel dev              # runs frontend + edge functions locally on one port
```

You can still use `npm run dev` for pure frontend iteration (styling, layout, animation), but switch to `vercel dev` the moment you need to hit the Edge Function.

---

## 20. Deployment

### Local verification first

```bash
vercel dev
```

`vercel dev` is required (not `npm run dev`) because the app depends on the Edge Function at `/api/generate`. Vite's dev server alone does not run Vercel Functions and any call to the endpoint will 404.

Test that selecting a product, objective, and segment, then clicking Run, produces 9 real LLM-generated cards. Test with an intentionally bad API key to verify error states.

### Deploy

```bash
npm install -g vercel
vercel login
vercel
```

Follow prompts. Vite is auto-detected.

After first deploy, go to the Vercel dashboard, open the project, go to Settings, Environment Variables, and add:

```
Name: ANTHROPIC_API_KEY
Value: <your real key>
Environments: Production, Preview, Development
```

Optionally add `OPENAI_API_KEY` too (the app does not use it yet, but having it set means swapping providers later is one config change).

Then redeploy:

```bash
vercel --prod
```

Verify the live URL works end to end.

---

## 21. README.md Content

The README should be short, confident, and demonstrate strategic thinking. Use exactly this structure.

```markdown
# SWOT Prompt Explorer

A population segmentation insight tool. Pick a product, an objective, and 1-4 customer segments. The app generates SWOT analysis, marketing OKRs, buyer personas, channel strategy, and an investment case for each segment. Built as a case study for Subconscious.ai.

Live: <your-vercel-url>

## What I built

A 4-segment comparison tool with one structured LLM call per segment (returning all 9 categories as JSON), a streaming card grid, radar profile visualization, category filtering, and a provider abstraction layer scaffolded for multi-LLM routing. Fully deployed on Vercel with an Edge Function proxy so API keys never touch the browser.

## One tradeoff I made consciously

I shipped the SWOT generation as a single structured-JSON call per segment, rather than 9 parallel category-level calls. The category-level approach would have produced a more dramatic "streaming cards" effect, but it would have meant 36 parallel calls on first load (4 segments times 9 categories), risking rate limits, multiplying input-token cost roughly 9x because the segment context would be repeated in each prompt, and creating 36 independent failure points. The structured-JSON approach makes 4 parallel calls instead of 36, costs less, fails less, and still gives a satisfying "wave per segment" reveal as each segment's call resolves.

## What I would build next

**1. Multi-provider LLM routing.** Different models for different parts of the output, routed through the existing provider abstraction layer. Claude Opus 4.7 for persona prose (it produces more textured, less stereotypical humans). GPT-5.5 for OKRs and structured SWOT (more deterministic JSON, plus native logprob support). Gemini with search grounding for channel recommendations (needs current platform data, not training-cutoff snapshots). The Anthropic and OpenAI providers are already scaffolded; this is a config change.

**2. Real confidence scoring via OpenAI logprobs.** Each card would show a confidence badge based on three signals computed from token-level logprobs: geometric mean token probability (overall response confidence), perplexity (how perplexed the model was), and mean top-1 decisiveness (how much more likely the chosen token was versus the runner-up at each step). This requires routing SWOT generation through GPT-5.5 since Anthropic does not currently expose logprobs. Persona stays on Claude where prose quality matters more than measurability. Today the app shows self-reported confidence as a placeholder.

**3. Consensus scoring for high-stakes categories.** Run Investment Case and Threats generation 3 times at temperature 0.7 and compute embedding cosine similarity across runs. Cards with high agreement get a "stable" badge. Cards with high variance get a "model is uncertain" warning. This costs 3x for those two categories but is worth it for the strategic-decision cards.

**4. LLM-derived radar dimensions.** Today the radar chart uses a hard-coded mock data table. With more time I would have the LLM produce numeric scores for the 6 radar dimensions as part of the structured JSON response, so the chart reflects the model's actual read of the segment rather than my hand-tuned values.

**5. Custom segment definition.** Free-text input ("urban dog owners in coastal cities who buy organic"). The app derives the archetype, color, and behaviors automatically via a structured-output call before running the SWOT.

**6. Save and recall.** A left rail of past analyses scoped by product, with one-click rerun against new objectives.

## Stack

Vite, React 18, Tailwind, framer-motion, recharts, react-markdown, lucide-react. Claude Opus 4.7 via Anthropic API. Vercel Edge Functions for the LLM proxy. Plain JavaScript, no TypeScript.
```

---

## 22. Out of Scope

Do not build these. Explicitly excluded to stay in the time budget:

- 3D force-directed graphs
- Drag-and-drop layout
- ag-grid persona tables
- A backend database (state lives in React only)
- User accounts or auth
- Saved sessions or history
- Dark mode (light only, system-default fine)
- Mobile-specific layouts (responsive but desktop-first)
- Switching the active provider in the UI (the abstraction exists but the toggle does not ship)
- A functional OpenAI provider (only a file stub ships; wiring it up to actually call OpenAI is future work)
- Streaming responses token-by-token (request-response per segment is sufficient)
- Unit tests or e2e tests

---

## 23. Acceptance Criteria

Build is done when all of the following are true:

1. The live Vercel URL loads in under 2 seconds.
2. On first load, the app shows the default state (EV + Increase Consideration + 4 segments) with skeleton cards immediately, and real cards arriving in waves of 9 as each segment's call resolves over 5 to 15 seconds.
3. Switching segment tabs is instant (cached data).
4. Selecting a different product and clicking Run produces fresh insights.
5. Each of the 9 category cards renders without overflow, has correct color treatment, and shows real LLM-generated content.
6. The radar chart renders one shape per segment and visibly changes between segments.
7. Loading skeletons appear and disappear cleanly. No flash of empty state.
8. If the API key is wrong, the user sees a clear error message, not a blank page.
9. If the LLM returns malformed JSON, the affected segment shows a clear error card with the parse failure reason, and other segments continue working.
10. The ConfidenceBadge renders for each segment using the self-reported confidence value.
11. The Compare button at minimum shows a placeholder. At best, shows a working side-by-side view.
12. No visible padding bugs, misaligned text, broken hover states, or console errors.
13. DevTools Network tab confirms all LLM traffic goes through `/api/generate`, never direct to `api.anthropic.com` or `api.openai.com`.
14. The provider abstraction layer (`src/lib/providers/`) exists with `types.js`, a fully working `anthropic.js`, and an `openai.js` file stub. The OpenAI stub does not need to be tested or functional; it just needs to exist so the architecture is consistent and the README's future-work pitch is grounded in real scaffolding.

---

## 24. Critical Reminders for Claude Code

- Do not invent additional features beyond this spec.
- Do not refactor working code unless asked.
- Do not add comments in JSX explaining what obvious code does.
- Use functional components and hooks. No class components.
- Do not use TypeScript. Plain JS only.
- If a Tailwind class does not exist, check the config first. Do not invent custom utility classes.
- All API calls go through `/api/generate`. Never call `api.anthropic.com` or `api.openai.com` directly from the client.
- The default model is `claude-opus-4-7`. Do not change it.
- The fallback if JSON parsing fails is to surface a clear error to the user, not to retry silently. The user needs to see what went wrong.
- The provider abstraction layer should be built (types.js, anthropic.js working, openai.js as stub), but a functional OpenAI provider is not required for ship. The stub is enough to make the README's future-work section credible.
- When in doubt about styling, simpler and more minimal beats more complex.
- Final visual quality matters more than feature count. Polish existing pieces before adding new ones.

End of spec.
