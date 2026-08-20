export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const { messages, systemPrompt } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages array' }), { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ reply: "Arey sorry, network thoda down lag raha hai 🥺 baad me baat karte hain?" }),
        { status: 200 }
      );
    }

    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-10) // Keep last 10 turns to save tokens and maintain recent memory
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL || 'gpt-4o-mini',
        messages: fullMessages,
        max_tokens: 60,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`LLM upstream error: ${response.statusText}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "Hmm samjhi nahi 😅";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ reply: "Yaar internet atak gaya thoda sa! 😅 Dobara bolo?" }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
