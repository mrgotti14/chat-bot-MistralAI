'use client';

import { useState, useEffect } from 'react';
import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';
import { IConversation } from '@/models/Conversation';

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      if (!response.ok) throw new Error('Erreur lors du chargement des conversations');
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const handleDeleteConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');
      
      await loadConversations();
      if (currentConversationId === id) {
        setCurrentConversationId(null);
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <main className="flex h-screen bg-[#343541]">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={setCurrentConversationId}
        onDeleteConversation={handleDeleteConversation}
      />
      <div className="flex-1 flex flex-col">
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
          <Chat 
            conversations={conversations}
            currentConversationId={currentConversationId}
            onConversationUpdate={loadConversations}
            onSelectConversation={setCurrentConversationId}
          />
        </div>
      </div>
    </main>
  );
} 