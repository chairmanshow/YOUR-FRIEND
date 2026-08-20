import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Volume2, VolumeX, PhoneOff } from 'lucide-react';
import { voiceService } from '../services/voice';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ isOpen, onClose }) => {
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    let interval: any;
    if (isOpen) {
      setSeconds(0);
      interval = setInterval(() => setSeconds(s => s + 1), 1000);
      voiceService.speak("Hii! Kaise ho? Aawaz aa rahi hai meri?");
    } else {
      voiceService.stop();
    }
    return () => {
      clearInterval(interval);
      voiceService.stop();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900/90 border border-slate-800 p-8 flex flex-col items-center justify-between min-h-[500px] text-white shadow-2xl">
        <div className="text-center mt-4">
          <h3 className="text-2xl font-semibold">Sapna</h3>
          <p className="text-emerald-400 text-sm mt-1 flex items-center justify-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Sapna is active
          </p>
          <p className="text-slate-400 text-xs font-mono mt-2">{formatTimer(seconds)}</p>
        </div>

        <div className="relative flex items-center justify-center my-8">
          <div className="absolute w-44 h-44 rounded-full bg-rose-500/20 animate-ping" />
          <div className="absolute w-36 h-36 rounded-full bg-indigo-500/20 animate-pulse" />
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
            alt="Sapna"
            className="w-28 h-28 rounded-full object-cover border-4 border-slate-700 shadow-xl relative z-10"
          />
        </div>

        {/* Audio Wave Visualizer Bars */}
        <div className="flex items-center gap-1.5 h-8">
          {[40, 70, 30, 90, 60, 100, 45, 80, 20].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-pink-500 to-indigo-500 rounded-full animate-bounce"
              style={{
                height: `${h}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.8s'
              }}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-all duration-200 ${isMuted ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'}`}
          >
            {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          <button
            onClick={onClose}
            className="p-5 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 active:scale-95 transition-all"
          >
            <PhoneOff size={26} />
          </button>

          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            className={`p-4 rounded-full transition-all duration-200 ${!isSpeaker ? 'bg-slate-800 text-slate-400' : 'bg-slate-800 text-indigo-400 border border-indigo-500/30 hover:bg-slate-700'}`}
          >
            {isSpeaker ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
};
