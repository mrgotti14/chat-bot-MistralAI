'use client';

import { useState, useEffect, useRef } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import  { type IConversation, type IMessage } from '@/models/Conversation';

/**
 * Props for the Chat component
 * @interface ChatProps
 * 
 * @property {IConversation[]} conversations - List of user's conversations
 * @property {string | null} currentConversationId - ID of the active conversation
 * @property {() => Promise<void>} onConversationUpdate - Callback to update conversations list
 * @property {(id: string) => void} onSelectConversation - Callback to change active conversation
 * 
 * Note: Enter to send message, Shift+Enter for new line
 */
interface ChatProps {
  conversations: IConversation[];
  currentConversationId: string | null;
  onConversationUpdate: () => Promise<void>;
  onSelectConversation: (id: string) => void;
}

/**
 * Main chat interface with message history and input form
 * 
 * @component
 * @param {ChatProps} props - Component props
 * @returns {JSX.Element} Complete chat interface
 * 
 * Features:
 * - Message display with Markdown support
 * - Message sending with loading state
 * - Automatic new conversation creation
 * - Auto-scroll to new messages
 * - Responsive interface with textarea handling
 * - Typing and sending indicators
 * 
 * Special behaviors:
 * - Textarea auto-adjusts to content height
 * - Enter to send, Shift+Enter for new line
 * - Smooth scroll to new messages
 * - Loading animation while waiting for response
 * 
 * @example
 * ```tsx
 * <Chat
 *   conversations={userConversations}
 *   currentConversationId="123"
 *   onConversationUpdate={async () => await fetchConversations()}
 *   onSelectConversation={(id) => setCurrentConversation(id)}
 * />
 * ```
 */
export default function Chat({ 
  conversations,
  currentConversationId,
  onConversationUpdate,
  onSelectConversation
}: ChatProps) {
  const [message, setMessage] = useState('');
  const [pendingMessage, setPendingMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const messageToSend = message.trim();
    setPendingMessage(messageToSend);
    setMessage('');
    const textarea = e.target as HTMLFormElement;
    const textareaElement = textarea.querySelector('textarea');
    if (textareaElement) {
      textareaElement.style.height = '44px';
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageToSend,
          conversationId: currentConversationId 
        })
      });

      if (!response.ok) throw new Error('Erreur lors de l&apos;envoi du message');
      
      const data = await response.json();
      
      // Si c'est une nouvelle conversation, on met à jour l'ID immédiatement
      if (!currentConversationId && data.conversationId) {
        onSelectConversation(data.conversationId);
      }
      
      // Puis on met à jour la liste des conversations
      await onConversationUpdate();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
      setPendingMessage('');
    }
  };

  const getCurrentConversation = () => {
    if (!currentConversationId) return null;
    return conversations.find(conv => conv._id === currentConversationId);
  };


  const currentMessages = getCurrentConversation()?.messages || [];

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-36">
        {(!currentConversationId || conversations.length === 0) && (
          <div className="text-center py-10">
            <h1 className="text-4xl font-semibold text-gray-200 mb-10">Chat Mistral AI</h1>
            <div className="text-gray-400">
              <p className="text-lg mb-8">Comment puis-je vous aider aujourd&apos;hui ?</p>
            </div>
          </div>
        )}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(156, 163, 175, 0.3);
            border-radius: 20px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(156, 163, 175, 0.5);
          }
        `}</style>
        <div className="pb-4">
          {currentMessages.map((msg: IMessage, index: number) => (
            <div
              key={index}
              className="py-4"
            >
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="bg-blue-600 rounded-2xl px-4 py-2 max-w-[85%]">
                      <MarkdownRenderer content={msg.content} />
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4 lg:gap-6">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">M</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <MarkdownRenderer content={msg.content} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <>
              <div className="py-4">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-end">
                    <div className="bg-blue-600 rounded-2xl px-4 py-2 max-w-[85%]">
                      <MarkdownRenderer content={pendingMessage} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="py-4">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex gap-4 lg:gap-6">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">M</span>
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 z-10">
        <div className="bg-gradient-to-t from-[#343541] via-[#343541]/90 to-transparent h-12"></div>
        <div className="bg-[#343541]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-end">
                <div className="relative flex-1">
                  <textarea
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    placeholder="Envoyez un message..."
                    className="w-full bg-[#40414F] text-white rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-700/50 overflow-y-hidden"
                    style={{
                      minHeight: '44px',
                      maxHeight: '200px',
                      resize: 'none',
                      lineHeight: '1.5'
                    }}
                    disabled={isLoading}
                  />
                  <div className="absolute right-2 bottom-2">
                    <button
                      type="submit"
                      disabled={isLoading || !message.trim()}
                      className="p-2 text-gray-400 hover:text-gray-200 disabled:hover:text-gray-400 disabled:opacity-40 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-center text-xs text-gray-400">
                Appuyez sur Entrée pour envoyer, Maj+Entrée pour sauter une ligne
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 