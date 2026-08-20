const handleSendMessage = async (userText: string) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY is missing!");
    return;
  }

  try {
    const prompt = `You are Sapna, a caring, sweet, friendly girl from Morena. Speak in natural Hindi / Hinglish. Keep replies short (1-2 sentences). User says: "${userText}"`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (botReply) {
      // Append botReply to your chat messages state
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }
  } catch (err) {
    console.error("Gemini API error:", err);
  }
};
