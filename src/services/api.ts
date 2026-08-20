import { Message } from '../types';

export async function sendChatMessage(messages: Message[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return "Arey, API key connect nahi hui abhi! Vercel me VITE_GEMINI_API_KEY check karo.";
  }

  // Last 6 messages ka context build karein
  const recentMessages = messages.slice(-6);
  const conversationContext = recentMessages
    .map((m) => `${m.sender === 'user' ? 'User' : 'Sapna'}: ${m.text}`)
    .join('\n');

  const systemPrompt = `You are Sapna, a real, caring, sweet Indian college girl friend.
Chat in natural Hindi / Hinglish like an authentic best friend on WhatsApp.
Rules:
- Give short (1-2 sentences), sweet, and natural replies.
- Never sound robotic or like an AI assistant.
- React directly to the latest conversation context.

Conversation history:
${conversationContext}

Sapna's reply:`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
        }),
      }
    );

    const data = await response.json();
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      'Haan sun rahi hoon na, bolo! 😊'
    );
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Haan bolo, main yahin hoon! Kuch soch rahi thi. 😊';
  }
}
