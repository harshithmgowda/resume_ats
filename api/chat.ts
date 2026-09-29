export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey =
    process.env.NVIDIA_API_KEY ||
    process.env.VITE_NVIDIA_API_KEY ||
    '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';

  const { messages, model, temperature, max_tokens } = req.body || {};

  // Try fast verified models on this account
  const modelsToTry = model
    ? [model, 'meta/llama-3.2-11b-vision-instruct', 'deepseek-ai/deepseek-v4.1-flash']
    : ['meta/llama-3.2-11b-vision-instruct', 'deepseek-ai/deepseek-v4.1-flash'];

  let lastError: any = null;

  for (const m of modelsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: m,
          messages: messages || [{ role: 'user', content: 'Hello' }],
          temperature: temperature ?? 0.2,
          max_tokens: max_tokens ?? 2500,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        return res.status(200).json({
          ...data,
          modelUsed: m,
        });
      } else {
        const errText = await response.text();
        console.warn(`Model ${m} returned ${response.status}: ${errText}`);
        lastError = new Error(`HTTP ${response.status}: ${errText}`);
      }
    } catch (err: any) {
      console.warn(`Model ${m} error:`, err.message);
      lastError = err;
    }
  }

  return res.status(500).json({
    error: lastError?.message || 'Failed to generate response from NVIDIA models',
  });
}
