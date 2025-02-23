'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import MarkdownRenderer from './MarkdownRenderer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Conversation {
  id: string;
  messages: Message[];
  title: string;
  date: string;
}

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string>(
    searchParams.get('id') || new Date().toISOString()
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const conversationId = searchParams.get('id');
    if (conversationId) {
      setCurrentConversationId(conversationId);
      const savedMessages = localStorage.getItem(`chat_${conversationId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([]);
      }
    } else {
      setMessages([]);
      setCurrentConversationId(new Date().toISOString());
    }
  }, [searchParams]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        `chat_${currentConversationId}`,
        JSON.stringify(messages)
      );

      
      const title = messages[0].content.slice(0, 30) + '...';
      const conversation: Conversation = {
        id: currentConversationId,
        messages,
        title,
        date: new Date().toISOString().split('T')[0],
      };
      const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
      const existingIndex = conversations.findIndex(
        (c: Conversation) => c.id === currentConversationId
      );

      if (existingIndex >= 0) {
        conversations[existingIndex] = conversation;
      } else {
        conversations.unshift(conversation);
      }

      localStorage.setItem('conversations', JSON.stringify(conversations));
    }
  }, [messages, currentConversationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: input
        }),
      });

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setInput(textarea.value);
    
    
    textarea.style.height = 'auto';
    
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-36">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <h1 className="text-4xl font-semibold text-gray-200 mb-10">Chat Mistral AI</h1>
            <div className="text-gray-400">
              <p className="text-lg mb-8">Comment puis-je vous aider aujourd'hui ?</p>
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
          {messages.map((message, index) => (
            <div
              key={index}
              className="py-4"
            >
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {message.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="bg-blue-600 rounded-2xl px-4 py-2 max-w-[85%]">
                      <MarkdownRenderer content={message.content} />
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4 lg:gap-6">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">M</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <MarkdownRenderer content={message.content} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
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
                    value={input}
                    onChange={handleTextareaInput}
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
                      disabled={isLoading || !input.trim()}
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