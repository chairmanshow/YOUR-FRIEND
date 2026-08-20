import { Message } from '../types';

export async function sendChatMessage(messages: Message[]): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('Backend Error:', data.error);
      return `Backend issue: ${data.error}`;
    }

    return data.reply || 'Haan sun rahi hoon, bolo! 😊';
  } catch (error: any) {
    console.error('Fetch Error:', error);
    return 'Connection issue: API route unreachable';
  }
}
