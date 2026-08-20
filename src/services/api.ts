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
    return data.reply || 'Main sun rahi hoon! 😊';
  } catch (error) {
    console.error('API Call Error:', error);
    return 'Haan bolo na, thoda connection slow tha mera! 😊';
  }
}
