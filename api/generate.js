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
