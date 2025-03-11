'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Chat from '../components/Chat';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import AddPassword from '../components/AddPassword';
import { IConversation } from '@/models/Conversation';

export default function ChatPage() {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(true);

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

  // Check if the user needs to set a password
  useEffect(() => {
    const checkPasswordStatus = async () => {
      try {
        setIsCheckingPassword(true);
        const response = await fetch('/api/auth/password/check');
        const data = await response.json();
        
        // Only show the modal if the user doesn't have a password
        if (!data.hasPassword) {
          setShowPasswordModal(true);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du mot de passe:', error);
      } finally {
        setIsCheckingPassword(false);
      }
    };

    if (session?.user) {
      checkPasswordStatus();
    }
  }, [session]);

  const handleDeleteConversation = async (id: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Error deleting conversation');
      
      await loadConversations();
      if (currentConversationId === id) {
        setCurrentConversationId(null);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
  };

  const handleRenameConversation = async (id: string, newTitle: string) => {
    try {
      const response = await fetch(`/api/conversations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTitle })
      });

      if (!response.ok) throw new Error('Error renaming conversation');
      
      await loadConversations();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (isCheckingPassword) {
    return (
      <div className="min-h-screen bg-[#343541] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      <main className="flex h-screen bg-[#343541]">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={setCurrentConversationId}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
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

      <Modal 
        isOpen={showPasswordModal} 
        onClose={() => {}}
      >
        <AddPassword onSuccess={handlePasswordSuccess} />
      </Modal>
    </>
  );
} 