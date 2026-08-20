import React from 'react';
import { Camera, MessageSquare } from 'lucide-react';

interface HomeProps {
  onSelectTab: (tab: 'photos' | 'chat') => void;
}

export const Home: React.FC<HomeProps> = ({ onSelectTab }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 pt-12 pb-24 md:py-20 max-w-4xl mx-auto text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        Sapna is online & listening
      </div>

      <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
        Meet Your Friend
      </h1>
      <p className="text-lg md:text-xl text-slate-400 max-w-md mx-auto mb-10 font-normal">
        Someone is always here to listen.
      </p>

      {/* Two Main Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl px-2">
        <div
          onClick={() => onSelectTab('photos')}
          className="group relative cursor-pointer overflow-hidden rounded-3xl bg-slate-800/40 border border-slate-700/50 p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-pink-500/40 hover:shadow-2xl hover:shadow-pink-500/10 active:scale-95"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white mb-5 shadow-lg shadow-pink-500/25 group-hover:rotate-6 transition-transform">
            <Camera size={32} />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">📸 Photos</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Explore personal moments, stories, and shared photos in the gallery.
          </p>
        </div>

        <div
          onClick={() => onSelectTab('chat')}
          className="group relative cursor-pointer overflow-hidden rounded-3xl bg-slate-800/40 border border-slate-700/50 p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 active:scale-95"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white mb-5 shadow-lg shadow-indigo-500/25 group-hover:-rotate-6 transition-transform">
            <MessageSquare size={32} />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">💬 Chat / Call</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Talk about your day, share feelings, or have a relaxed voice call.
          </p>
        </div>
      </div>
    </div>
  );
};
