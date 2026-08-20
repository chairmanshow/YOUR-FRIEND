import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.Gemini_API_Key || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({ reply: 'Vercel me API Key missing hai!' });
  }

  const { messages } = req.body || {};
  const recentHistory = (messages || []).slice(-6);
  const context = recentHistory
    .map((m: any) => `${m.sender === 'user' ? 'User' : 'Sapna'}: ${m.text}`)
    .join('\n');

  const prompt = `You are Sapna, a cute, sweet Indian college friend. Reply naturally in 1-2 short casual sentences in Hindi/Hinglish like on WhatsApp.
Conversation:
${context}

Sapna:`;

  // Google ke latest models ki list
  const models = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-2.0-flash'];
  let lastError = '';

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const data = await response.json();

      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return res.status(200).json({
          reply: data.candidates[0].content.parts[0].text.trim(),
        });
      }

      if (data?.error) {
        lastError = data.error.message;
      }
    } catch (e: any) {
      lastError = e.message;
    }
  }

  return res.status(200).json({ reply: `Gemini Error: ${lastError}` });
}
