const corsHeaders = (origin, allowedOrigin) => ({
  'Access-Control-Allow-Origin': origin === allowedOrigin ? origin : allowedOrigin,
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
});

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN);

    if (request.method === 'OPTIONS') return new Response(null, { headers });
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'POST only' }), { status: 405, headers });
    }

    try {
      const body = await request.json();
      const messages = Array.isArray(body.messages) ? body.messages : [];
      const system = messages.find(message => message.role === 'system')?.content || '';
      const contents = messages
        .filter(message => message.role !== 'system')
        .map(message => ({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(message.content || '') }]
        }));

      const model = body.model || 'gemini-2.0-flash';
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents,
            generationConfig: { temperature: 0.3, maxOutputTokens: 700 }
          })
        }
      );

      const data = await geminiResponse.json();
      if (!geminiResponse.ok) return new Response(JSON.stringify(data), { status: 502, headers });

      const content = data.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('') || '';
      return new Response(JSON.stringify({ choices: [{ message: { role: 'assistant', content } }] }), { headers });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Unable to process the request' }), { status: 400, headers });
    }
  }
};
