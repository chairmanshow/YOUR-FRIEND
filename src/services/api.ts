import { Message } from '../types';

export async function sendChatMessage(messages: Message[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return "API key Vercel me VITE_GEMINI_API_KEY ke naam se missing hai!";
  }

  const recent = messages.slice(-5);
  const context = recent
    .map((m) => `${m.sender === 'user' ? 'User' : 'Sapna'}: ${m.text}`)
    .join('\n');

  const promptText = `You are Sapna, a cute, sweet, caring Indian college friend. Reply naturally in short casual Hindi/Hinglish (1-2 lines). Keep it warm and realistic like WhatsApp chatting.

Conversation:
${context}

Sapna:`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
        }),
      }
    );

    const json = await res.json();

    if (json.error) {
      console.error("Gemini Error Detail:", json.error);
      return `API Error: ${json.error.message}`;
    }

    return json.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Main sun rahi hoon! 😊";
  } catch (err: any) {
    console.error("Fetch Exception:", err);
    return "Connection error, please try again!";
  }
}
