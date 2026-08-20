import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Smile, Mic } from 'lucide-react';
import { Message } from '../types';
import { sendChatMessage } from '../services/api';
import { TypingIndicator } from '../components/TypingIndicator';
import { CallModal } from '../components/CallModal';

const QUICK_EMOJIS = ['😊', '😄', '✨', '❤️', '☕', '😂', '🥺'];

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'sapna',
      text: 'Hii 😄 kya kar rahe ho?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput('');
    setShowEmojiPicker(false);
    setIsTyping(true);

    // Natural typing delay simulation (600ms - 1200ms)
    setTimeout(async () => {
      const replyText = await sendChatMessage(updated);
      const sapnaMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'sapna',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, sapnaMessage]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto pt-0 md:pt-16 pb-16 md:pb-4">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between sticky top-0 md:top-16 z-20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Sapna"
              className="w-10 h-10 rounded-full object-cover border border-slate-700"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base leading-tight">Sapna</h3>
            <p className="text-xs text-emerald-400 flex items-center gap-1 font-normal">
              Sapna is active
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCallOpen(true)}
          className="p-2.5 rounded-full bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition shadow-sm"
          title="Voice Call"
        >
          <Phone size={19} />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                  alt="Sapna"
                  className="w-7 h-7 rounded-full object-cover border border-slate-700/50 mb-1"
                />
              )}
              <div
                className={`max-w-[78%] md:max-w-[65%] px-4 py-2.5 rounded-2xl shadow-sm text-sm ${
                  isUser
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-sm'
                    : 'bg-slate-800/90 text-slate-100 border border-slate-700/40 rounded-bl-sm'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <span
                  className={`block text-[10px] mt-1 text-right ${
                    isUser ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {/* Bottom Input Area */}
      <div className="p-3 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 relative">
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-4 bg-slate-800/95 border border-slate-700 p-2 rounded-2xl flex gap-2 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setInput((prev) => prev + emoji);
                  setShowEmojiPicker(false);
                }}
                className="text-lg p-1.5 hover:scale-125 transition"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-slate-400 hover:text-slate-200 transition"
          >
            <Smile size={22} />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-slate-800/80 border border-slate-700/60 rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition placeholder-slate-500"
          />

          <button
            onClick={() => setIsCallOpen(true)}
            className="p-2 text-slate-400 hover:text-indigo-400 transition"
            title="Send Voice Message"
          >
            <Mic size={22} />
          </button>

          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 rounded-full text-white shadow-md transition active:scale-95"
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <CallModal isOpen={isCallOpen} onClose={() => setIsCallOpen(false)} />
    </div>
  );
};
