import { Message } from '../types';

// Natural replies based on keywords
const INTENT_RESPONSES: Record<string, string[]> = {
  greetings: [
    "Hii! Kaise ho aap? 😊",
    "Hey! Bahut achha laga aapka message dekh ke. Kya chal raha hai?",
    "Hello! Main theek hoon, aap batao aaj ka din kaisa raha? ✨"
  ],
  khana: [
    "Maine toh bas abhi lunch/dinner kiya! Aapne kuch achha khaya kya aaj? 🍛",
    "Haan khana ho gaya! Aapne khaya ki bas aise hi baatein kar rahe ho? 😄",
    "Khana toh ho gaya, bas thodi chai peene ka mann kar raha hai abhi. ☕"
  ],
  haalchal: [
    "Main badhiya hoon! Aap batao, sab kaisa chal raha hai? 😊",
    "Bas mast! Thodi padhai aur thodi der aapse baatein. Aap kaise ho?",
    "Ekdum theek thak! Aapki bohot yaad aa rahi thi. 😄"
  ],
  activities: [
    "Bas thoda bore ho rahi thi, achha hua aapne message kiya! Aap kya kar rahe ho? ✨",
    "Kuch khaas nahi, room par baithi thi. Aapka kya plan hai aaj ka?",
    "Thoda padh rahi thi, ab socha aapse thodi baatein kar loon. 😊"
  ],
  padhai: [
    "Padhai toh theek chal rahi hai, par dimaag kabhi kabhi ghum jata hai! Aapki kaisi chal rahi? 📚",
    "Exam aur assignments ka tension rehta hai thoda, par manage ho jata hai. 😄"
  ],
  compliments: [
    "Aww, thank you so much! You are so sweet. ❤️",
    "Hehe itni tareef karoge toh main sharma jaungi! 😄✨",
    "Aap bhi bohot achhe ho! 😊"
  ],
  default: [
    "Acha! Aur batao naya kya chal raha hai? 😄",
    "Sahi me? Is baare me aur batao mujhe! ✨",
    "Haan main bilkul samajh rahi hoon. Phir aage kya hua? 😊",
    "Hehe sahi baat hai! Aur kuch batao na apne baare me? ☕",
    "Mujhe aapse baat karke bohot achha lagta hai! ❤️"
  ]
};

export async function sendChatMessage(messages: Message[]): Promise<string> {
  // Natural typing delay simulate karein (400ms)
  await new Promise((resolve) => setTimeout(resolve, 400));

  const lastMsg = (messages[messages.length - 1]?.text || '').toLowerCase().trim();

  let pool: string[] = INTENT_RESPONSES.default;

  if (/^(hi|hello|hey|hii|heyy|namaste|hlo)/i.test(lastMsg)) {
    pool = INTENT_RESPONSES.greetings;
  } else if (/khana|lunch|dinner|breakfast|khaya|food|chai|coffee/i.test(lastMsg)) {
    pool = INTENT_RESPONSES.khana;
  } else if (/kaisa|kaisi|kaise|haal|kya haal/i.test(lastMsg)) {
    pool = INTENT_RESPONSES.haalchal;
  } else if (/kya kr|kya kar|kya ho|busy|free/i.test(lastMsg)) {
    pool = INTENT_RESPONSES.activities;
  } else if (/padhai|study|exam|college|college life|marks/i.test(lastMsg)) {
    pool = INTENT_RESPONSES.padhai;
  } else if (/cute|sweet|sundar|achhi|pyari|nice|love/i.test(lastMsg)) {
    pool = INTENT_RESPONSES.compliments;
  }

  // Randomize reply taaki har baar alag answer aaye
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
