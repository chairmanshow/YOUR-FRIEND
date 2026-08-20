import { Message } from '../types';
import { buildSystemPrompt } from '../config/character';

export async function sendChatMessage(messages: Message[]): Promise<string> {
  const payload = {
    systemPrompt: buildSystemPrompt(),
    messages: messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    })),
  };

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    return data.reply;
  } catch {
    // Graceful offline fallback simulation
    const fallbacks = [
      "Haa bilkul! 😄",
      "Aur batao, sab kaisa chal raha hai? 😌",
      "Arey sach me? 😂",
      "Main abhi aayi, 2 min ruko ☕",
      "Sahi baat hai yaar! ✨"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}
