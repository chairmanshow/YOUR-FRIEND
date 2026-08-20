import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Photos } from './pages/Photos';
import { Chat } from './pages/Chat';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'photos' | 'chat'>('home');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white font-sans antialiased">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="w-full">
        {activeTab === 'home' && <Home onSelectTab={(tab) => setActiveTab(tab)} />}
        {activeTab === 'photos' && <Photos />}
        {activeTab === 'chat' && <Chat />}
      </main>
    </div>
  );
};

export default App;
