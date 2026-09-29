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

  // Only meta/llama-3.2-11b-vision-instruct is verified working on this API key
  // All other models return 404/410/timeout — don't waste time trying them
  const targetModel = 'meta/llama-3.2-11b-vision-instruct';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout for quality

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: targetModel,
        messages: messages || [{ role: 'user', content: 'Hello' }],
        temperature: temperature ?? 0.4,
        max_tokens: max_tokens ?? 4000,
        top_p: 0.9,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return res.status(200).json({
        ...data,
        modelUsed: targetModel,
      });
    } else {
      const errText = await response.text();
      console.error(`NVIDIA API ${response.status}: ${errText}`);

      // Retry once on 5xx server errors
      if (response.status >= 500) {
        await new Promise((r) => setTimeout(r, 2000));
        const retryRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: targetModel,
            messages: messages || [{ role: 'user', content: 'Hello' }],
            temperature: temperature ?? 0.4,
            max_tokens: max_tokens ?? 4000,
            top_p: 0.9,
          }),
        });
        if (retryRes.ok) {
          const retryData = await retryRes.json();
          return res.status(200).json({ ...retryData, modelUsed: targetModel });
        }
      }

      return res.status(response.status).json({
        error: `NVIDIA API returned ${response.status}`,
        details: errText,
      });
    }
  } catch (err: any) {
    console.error('NVIDIA API call failed:', err.message);
    return res.status(500).json({
      error: err.name === 'AbortError' ? 'NVIDIA API timed out — please try again' : err.message,
    });
  }
}
