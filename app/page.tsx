'use client';

import { useState } from 'react';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col bg-[#343541]">
        <div className="md:hidden p-2">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 hover:bg-gray-500/10 rounded-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <Chat />
        </div>
      </div>
    </main>
  );
}
