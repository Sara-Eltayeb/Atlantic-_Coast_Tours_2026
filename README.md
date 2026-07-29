# Atlantic Coast Tours AI Assistant

The static frontend reads the public Google Sheet and Open-Meteo directly in the browser. The LLM is wired through an OpenAI-compatible proxy configured in `llm-config.js`.

Set the proxy URL there:

```js
window.ATLANTIC_LLM_CONFIG = {
  endpoint: 'https://your-secure-proxy.example.com/v1/chat/completions',
  model: 'gpt-4o-mini'
};
```

The proxy owns the provider API key and must return:

```json
{ "choices": [{ "message": { "content": "..." } }] }
```

Do not put a provider secret in GitHub Pages. If the endpoint is unavailable, the app falls back to its live-data recommendation logic instead of inventing catalogue information.

## Gemini With Cloudflare Workers

1. Install Wrangler: `npm install -g wrangler`
2. Log in: `wrangler login`
3. From the `worker` folder, create the secret: `wrangler secret put GEMINI_API_KEY`
4. Deploy: `wrangler deploy`
5. Set the deployed Worker URL as `endpoint` in `llm-config.js`, for example `https://atlantic-coast-tours-ai.<your-account>.workers.dev`.

Update `ALLOWED_ORIGIN` in `worker/wrangler.toml` if your GitHub Pages URL differs. The Gemini key stays inside Cloudflare and is never sent to the browser.
