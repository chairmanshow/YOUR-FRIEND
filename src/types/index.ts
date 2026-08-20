export interface Message {
  id: string;
  sender: 'user' | 'sapna';
  text: string;
  timestamp: string;
}

export interface PhotoItem {
  id: string;
  url: string;
  title: string;
  date: string;
}

export interface CharacterProfile {
  name: string;
  city: string;
  state: string;
  personality: string;
  facts: Record<string, string>;
}
