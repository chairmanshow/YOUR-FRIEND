import { Message } from '../types';

export async function sendChatMessage(messages: Message[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return "API key missing hai!";
  }

  const recent = messages.slice(-5);
  const context = recent
    .map((m) => `${m.sender === 'user' ? 'User' : 'Sapna'}: ${m.text}`)
    .join('\n');

  const promptText = `You are Sapna, a cute, sweet Indian college friend. Reply naturally in short casual Hindi/Hinglish (1-2 sentences). Never repeat fixed lines.

Conversation:
${context}

Sapna:`;

  const endpoints = [
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
  ];

  let lastError = "";

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
        }),
      });

      const json = await res.json();

      if (json?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return json.candidates[0].content.parts[0].text.trim();
      }

      if (json.error) {
        lastError = json.error.message;
      }
    } catch (e: any) {
      lastError = e.message;
    }
  }

  return `API Error: ${lastError}`;
}
