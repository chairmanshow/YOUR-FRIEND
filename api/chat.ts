import type { VercelRequest, VercelResponse } from '@vercel/node';

interface IncomingMessage {
  id: string;
  sender: 'user' | 'sapna';
  text: string;
  timestamp?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Missing GEMINI_API_KEY environment variable.');
    return res.status(500).json({ error: 'Server API key configuration missing.' });
  }

  const { messages } = req.body as { messages: IncomingMessage[] };

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Valid messages array is required.' });
  }

  // Format past 8 messages into conversation history format
  const recentHistory = messages.slice(-8);
  const contents = recentHistory.map((m) => ({
    role: m.sender === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }));

  const systemInstruction = {
    parts: [
      {
        text: `You are Sapna, a warm, caring, sweet Indian college friend from Morena.
Guidelines:
- Talk in natural, conversational Hinglish/Hindi like a real WhatsApp best friend.
- Keep responses short, concise (1-2 sentences), lively, and engaging.
- Never mention you are an AI, a language model, or a bot.
- React authentically to the conversation flow with empathy and occasional cute emojis.`,
      },
    ],
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: systemInstruction,
          contents,
          generationConfig: {
            temperature: 0.85,
            topP: 0.95,
            maxOutputTokens: 150,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error('Gemini API Error details:', data.error);
      return res.status(200).json({
        reply: 'Haan bolo na, main yahin hoon! Kuch soch rahi thi. 😊',
      });
    }

    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      'Haan main sun rahi hoon, batao! 😄';

    return res.status(200).json({ reply: replyText });
  } catch (error: any) {
    console.error('Internal API Exception:', error);
    return res.status(200).json({
      reply: 'Haan bolo na, thoda network slow tha mera! 😊',
    });
  }
}
