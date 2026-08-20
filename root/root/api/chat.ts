import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS & Preflight handling
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Teeno possible naam check kar raha hai taaki key miss na ho
  const apiKey = process.env.GEMINI_API_KEY || process.env.Gemini_API_Key || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: 'Vercel Error: API Key environment variables me nahi mili!' });
  }

  const { messages } = req.body;
  if (!messages || messages.length === 0) {
    return res.status(200).json({ reply: 'Vercel Error: Koi message data receive nahi hua.' });
  }

  // Pichle 5 messages ka context
  const recentMessages = messages.slice(-5).map((m: any) => `${m.sender === 'user' ? 'User' : 'Sapna'}: ${m.text}`).join('\n');
  
  const prompt = `You are Sapna, a sweet Indian college friend. Reply in 1-2 natural Hinglish sentences.
Conversation:
${recentMessages}

Sapna:`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    // Agar Google se error aayi toh exact error screen par dikhayega
    if (data.error) {
      return res.status(200).json({ reply: `Gemini API Error: ${data.error.message}` });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Main sun rahi hoon! 😊';
    return res.status(200).json({ reply });
  } catch (error: any) {
    return res.status(200).json({ reply: `Server Fetch Error: ${error.message}` });
  }
}
