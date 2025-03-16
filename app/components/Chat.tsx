'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import MarkdownRenderer from './MarkdownRenderer';
import { type IConversation, type IMessage } from '@/models/Conversation';
import { useUsageLimits } from '../hooks/useUsageLimits';

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
 * Type for available model providers
 */
type ModelProvider = 'mistral' | 'ollama';

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
 * - Model selection between Mistral API and Ollama
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
  const [error, setError] = useState<string | null>(null);
  const [modelProvider, setModelProvider] = useState<ModelProvider>('mistral');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { usageLimits, refresh: refreshUsage } = useUsageLimits();

  // Check if user has access to premium models (Pro or Business tier)
  const hasPremiumAccess = usageLimits?.tier === 'pro' || usageLimits?.tier === 'business';

  // Reset to Mistral API if user doesn't have premium access but had selected Ollama
  useEffect(() => {
    if (!hasPremiumAccess && modelProvider === 'ollama') {
      setModelProvider('mistral');
    }
  }, [hasPremiumAccess, modelProvider]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [currentConversationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setError(null);
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
          conversationId: currentConversationId,
          modelProvider
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de l\'envoi du message');
      }
      
      const data = await response.json();
      
      if (!currentConversationId && data.conversationId) {
        onSelectConversation(data.conversationId);
      }
      
      await onConversationUpdate();
      await refreshUsage();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur:', err);
      // Restore the message if sending failed
      setMessage(messageToSend);
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
    <div className="relative flex flex-col h-full bg-[#1C1D1F]">
      {usageLimits && (
        <div className="absolute top-0 right-0 m-4 p-2 bg-[#2D2F31] rounded-lg text-sm text-gray-300 z-10">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <span>Messages restants aujourd'hui :</span>
              <span className="font-medium text-[#A435F0]">
                {usageLimits.limits.remaining.dailyMessages}
              </span>
              <span>/</span>
              <span>{usageLimits.limits.dailyMessageLimit}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Conversations actives :</span>
              <span className="font-medium text-[#A435F0]">
                {usageLimits.usage.activeConversations}
              </span>
              <span>/</span>
              <span>{usageLimits.limits.maxActiveConversations}</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-16 right-0 m-4 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 z-10">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-36">
        {(!currentConversationId || conversations.length === 0) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-10"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#A435F0] to-[#8710E0] text-transparent bg-clip-text mb-10">
              GottiAI Chat
            </h1>
            <div className="text-gray-400">
              <p className="text-lg mb-8">Comment puis-je vous aider aujourd'hui ?</p>
            </div>
          </motion.div>
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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="py-4"
            >
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="bg-gradient-to-r from-[#A435F0] to-[#8710E0] rounded-2xl px-4 py-2 max-w-[85%] shadow-lg"
                    >
                      <div className="text-white">
                        <MarkdownRenderer content={msg.content} />
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex gap-4 lg:gap-6">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-[#A435F0] to-[#8710E0] flex items-center justify-center shadow-lg"
                    >
                      <span className="text-white text-sm font-medium">G</span>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="min-w-0 flex-1 bg-[#2D2F31] p-4 rounded-xl shadow-lg text-white"
                    >
                      <MarkdownRenderer content={msg.content} />
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-4"
              >
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-r from-[#A435F0] to-[#8710E0] rounded-2xl px-4 py-2 max-w-[85%] shadow-lg">
                      <div className="text-white">
                        <MarkdownRenderer content={pendingMessage} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-4"
              >
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex gap-4 lg:gap-6">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-[#A435F0] to-[#8710E0] flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-medium">G</span>
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className="flex gap-2">
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                          }}
                          className="w-2 h-2 bg-[#A435F0] rounded-full"
                        />
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 1,
                            delay: 0.2,
                            repeat: Infinity,
                          }}
                          className="w-2 h-2 bg-[#A435F0] rounded-full"
                        />
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 1,
                            delay: 0.4,
                            repeat: Infinity,
                          }}
                          className="w-2 h-2 bg-[#A435F0] rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <div className="bg-gradient-to-t from-[#1C1D1F] via-[#1C1D1F]/90 to-transparent h-12" />
        <div className="bg-[#1C1D1F]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            {hasPremiumAccess ? (
              <div className="flex justify-center mb-2">
                <div className="inline-flex bg-[#2D2F31] rounded-lg p-1">
                  <button
                    onClick={() => setModelProvider('mistral')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      modelProvider === 'mistral' 
                        ? 'bg-[#A435F0] text-white' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Mistral API
                  </button>
                  <button
                    onClick={() => setModelProvider('ollama')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      modelProvider === 'ollama' 
                        ? 'bg-[#A435F0] text-white' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    Mistral 7B (Ollama)
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center mb-2">
                <span className="text-xs text-gray-400">
                  Passez à un abonnement Pro ou Entreprise pour accéder au modèle Mistral 7B (Ollama)
                </span>
              </div>
            )}
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
                    className="w-full bg-[#2D2F31] text-white rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-[#A435F0] border border-[#A435F0]/20 overflow-y-hidden transition-all"
                    style={{
                      minHeight: '44px',
                      maxHeight: '200px',
                      resize: 'none',
                      lineHeight: '1.5'
                    }}
                    disabled={isLoading}
                  />
                  <motion.button
                    type="submit"
                    disabled={isLoading || !message.trim()}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-2 bottom-1.5 p-2 text-[#A435F0] hover:text-[#8710E0] disabled:text-gray-400 disabled:hover:text-gray-400 disabled:opacity-40 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                  </motion.button>
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