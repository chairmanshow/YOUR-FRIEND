import React from 'react';
import { Image as ImageIcon, MessageCircle, Home as HomeIcon } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'photos' | 'chat';
  setActiveTab: (tab: 'home' | 'photos' | 'chat') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-slate-900/70 backdrop-blur-md border-b border-slate-800/80 z-40 items-center justify-between px-8">
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer font-semibold text-lg bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
        >
          Meet Your Friend
        </div>
        <nav className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-full border border-slate-700/40">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${activeTab === 'home' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${activeTab === 'photos' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Photos
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Chat
          </button>
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 flex items-center justify-around z-40 px-4">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 text-xs transition ${activeTab === 'home' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          <HomeIcon size={20} />
          <span>Home</span>
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`flex flex-col items-center gap-1 text-xs transition ${activeTab === 'photos' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          <ImageIcon size={20} />
          <span>Photos</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center gap-1 text-xs transition ${activeTab === 'chat' ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}
        >
          <MessageCircle size={20} />
          <span>Chat</span>
        </button>
      </nav>
    </>
  );
};
