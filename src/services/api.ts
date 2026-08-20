export async function sendMessageToAI(userMessage: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return "Arey, API key connect nahi hui abhi! Vercel me VITE_GEMINI_API_KEY check karo.";
  }

  const prompt = `You are Sapna, a sweet, caring, warm college girl friend from Morena. 
Chat naturally like a real human best friend on WhatsApp in Hindi / Hinglish.
Rules:
- Give short, natural 1-2 sentence replies.
- Never sound robotic.
- User says: "${userMessage}"`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Haan sun rahi hoon, bolo! 😊";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Haan bolo na, main yahin hoon! Kuch sochne lagi thi. 😊";
  }
}

export default { sendMessageToAI };
