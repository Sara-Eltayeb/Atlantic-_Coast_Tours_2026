/*
 * Configure this file only when you have a secure server-side LLM proxy.
 * Do not put an OpenAI, Anthropic or OpenRouter secret in this static site.
 * The proxy should accept { model, messages } and return an OpenAI-compatible
 * response: { choices: [{ message: { content: "..." } }] }.
 */
window.ATLANTIC_LLM_CONFIG = {
  endpoint: 'https://atlantic-coast-tours-ai-sara.workers.dev',
  model: 'gemini-2.0-flash'
};
