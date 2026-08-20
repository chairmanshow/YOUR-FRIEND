import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, ArrowLeft, Smile, Mic } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'sapna';
  text: string;
  time: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'sapna',
      text: 'Hii! 😊 Kaisi chal rahi hai tumhari padhai aur din?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      time: currentTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error('API Key missing');
      }

      const systemPrompt = `You are Sapna, a real, sweet, caring Indian college girl friend. 
You speak in warm, natural everyday conversational Hinglish/Hindi (just like chatting on WhatsApp).
Rules:
- Keep your answers short (1 to 2 short sentences max).
- Sound 100% human, casual, empathetic, and sweet. Never sound like a robot or assistant.
- Use cute, natural emojis sparingly.
- User says: "${userText}"`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
          }),
        }
      );

      const data = await response.json();
      const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 'Main sun rahi hoon na, bolo! 😊';

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'sapna',
        text: botText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'sapna',
        text: 'Haan bolo, main yahin hoon! Kuch soch rahi thi. 😊',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-slate-950 text-slate-100 shadow-2xl border-x border-slate-800">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur border-b border-slate-800 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md">
              S
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
          </div>
          <div>
            <h2 className="font-semibold text-sm leading-tight text-slate-100">Sapna</h2>
            <p className="text-xs text-emerald-400 font-medium">Online & listening</p>
          </div>
        </div>
        <button className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition">
          <Phone className="w-4 h-4" />
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{m.time}</span>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/60 border border-slate-800 w-fit px-3 py-1.5 rounded-full animate-pulse">
            <span>Sapna typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-slate-900/90 backdrop-blur border-t border-slate-800 flex items-center gap-2"
      >
        <div className="flex-1 flex items-center bg-slate-950 border border-slate-800 rounded-full px-3 py-1.5 focus-within:border-indigo-500 transition">
          <Smile className="w-5 h-5 text-slate-500 mr-2 cursor-pointer hover:text-slate-300" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-transparent border-none outline-none text-sm text-slate-100 placeholder-slate-500"
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white shadow-lg transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
