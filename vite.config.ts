import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey =
    env.NVIDIA_API_KEY ||
    env.VITE_NVIDIA_API_KEY ||
    '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';

  return {
    plugins: [
      react(),
      {
        name: 'api-chat-dev-middleware',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

            if (req.method === 'OPTIONS') {
              res.statusCode = 200;
              res.end();
              return;
            }

            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            let bodyStr = '';
            req.on('data', (chunk) => {
              bodyStr += chunk;
            });

            req.on('end', async () => {
              try {
                const body = JSON.parse(bodyStr || '{}');
                const models = body.model
                  ? [body.model, 'meta/llama-3.2-11b-vision-instruct', 'deepseek-ai/deepseek-v4.1-flash']
                  : ['meta/llama-3.2-11b-vision-instruct', 'deepseek-ai/deepseek-v4.1-flash'];

                let success = false;
                for (const m of models) {
                  try {
                    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${apiKey}`,
                      },
                      body: JSON.stringify({
                        model: m,
                        messages: body.messages || [{ role: 'user', content: 'Hello' }],
                        temperature: body.temperature ?? 0.2,
                        max_tokens: body.max_tokens ?? 2500,
                      }),
                    });

                    if (response.ok) {
                      const data = await response.json();
                      res.setHeader('Content-Type', 'application/json');
                      res.statusCode = 200;
                      res.end(JSON.stringify({ ...data, modelUsed: m }));
                      success = true;
                      break;
                    }
                  } catch (e: any) {
                    console.warn(`Dev middleware model ${m} error:`, e.message);
                  }
                }

                if (!success) {
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'All NVIDIA models failed to respond' }));
                }
              } catch (err: any) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
            });
          });
        },
      },
    ],
    server: {
      port: 5173,
      host: true,
    },
  };
});
