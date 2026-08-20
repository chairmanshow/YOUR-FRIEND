import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 👉 JUGAAD: Apni key seedha yahan daal do Vercel settings chhod kar
  const apiKey = atob("AQ.Ab8RN6Kt48vMRBmzyvUz5L2ARnFwBDWc5kO1u8aNXo1P3C5zRQ"); 

  const { messages } = req.body;
  const recentMessages = messages?.slice(-5).map((m: any) => `${m.sender === 'user' ? 'User' : 'Sapna'}: ${m.text}`).join('\n') || '';

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
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Main sun rahi hoon! 😊';
    
    return res.status(200).json({ reply });
  } catch (error: any) {
    return res.status(200).json({ reply: 'Network issue aa gaya.' });
  }
}
