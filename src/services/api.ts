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

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return data.reply || 'Haan sun rahi hoon, bolo! 😊';
  } catch (error) {
    console.error('Failed to communicate with chat backend:', error);
    return 'Haan bolo, main yahin hoon! Kuch keh rahe the? 😊';
  }
}
