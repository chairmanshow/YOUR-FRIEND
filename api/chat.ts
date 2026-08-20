
export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const { messages, systemPrompt } = await req.json();
    const apiKey = (process as any).env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ reply: "Arey sorry, network down hai 🥺 baad me baat karein?" }),
        { status: 200 }
      );
    }

    const contents = messages.slice(-10).map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: contents,
          generationConfig: { maxOutputTokens: 60, temperature: 0.7 }
        })
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Hmm samjhi nahi 😅";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ reply: "Internet atak gaya thoda sa! 😅 Dobara bolo?" }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
