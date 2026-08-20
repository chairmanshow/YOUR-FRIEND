import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.Gemini_API_Key || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: 'Error: Backend me API key nahi mili!' });
  }

  const { messages } = req.body;
  const lastUserMsg = messages?.[messages.length - 1]?.text || 'Hello';

  const prompt = `You are Sapna, a cute, sweet, caring Indian college friend. Reply naturally in 1-2 short sentences in Hindi/Hinglish like on WhatsApp. User: "${lastUserMsg}"`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(200).json({ reply: `Gemini Error: ${data.error.message}` });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Main sun rahi hoon! 😊';
    return res.status(200).json({ reply });
  } catch (error: any) {
    return res.status(200).json({ reply: `Fetch Error: ${error.message}` });
  }
}
