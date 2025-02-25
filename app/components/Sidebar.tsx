'use client';

import { IConversation } from '@/models/Conversation';
import { signOut } from 'next-auth/react';

/**
 * Props for the Sidebar component
 * @interface SidebarProps
 * 
 * @property {boolean} isOpen - Controls sidebar visibility on mobile
 * @property {() => void} onClose - Function to close the sidebar
 * @property {IConversation[]} conversations - List of user's conversations
 * @property {string | null} currentConversationId - ID of the currently selected conversation
 * @property {(id: string) => void} onSelectConversation - Callback to select a conversation
 * @property {(id: string) => void} onDeleteConversation - Callback to delete a conversation
 */
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: IConversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

/**
 * Responsive sidebar with conversations list and actions
 * 
 * @component
 * @param {SidebarProps} props - Component props
 * @returns {JSX.Element} Sidebar with conversations list
 * 
 * Features:
 * - Scrollable conversations list
 * - New conversation creation
 * - Existing conversation selection
 * - Conversation deletion
 * - User sign out
 * - Responsive design (mobile overlay)
 * 
 * @example
 * ```tsx
 * <Sidebar
 *   isOpen={isSidebarOpen}
 *   onClose={() => setIsSidebarOpen(false)}
 *   conversations={userConversations}
 *   currentConversationId="123"
 *   onSelectConversation={(id) => handleSelect(id)}
 *   onDeleteConversation={(id) => handleDelete(id)}
 * />
 * ```
 */
export default function Sidebar({ 
  isOpen, 
  onClose, 
  conversations, 
  currentConversationId,
  onSelectConversation,
  onDeleteConversation 
}: SidebarProps) {
  const handleNewChat = () => {
    onSelectConversation('');
    onClose();
  };

  const handleSelectConversation = (id: string) => {
    onSelectConversation(id);
    onClose();
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await onDeleteConversation(id);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div className={`fixed md:static inset-y-0 left-0 z-30 bg-[#202123] w-[260px] transform transition-transform duration-300 md:transform-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col`}>
        <div className="p-2">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 p-3 text-white border border-white/20 rounded-md hover:bg-gray-500/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Nouvelle conversation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {conversations.map((conv) => (
            <div key={conv._id} className="group relative">
              <button
                onClick={() => handleSelectConversation(conv._id)}
                className={`w-full flex items-center gap-3 p-3 pr-8 rounded-md text-sm transition-colors text-left ${
                  currentConversationId === conv._id 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-300 hover:bg-gray-500/10'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
                <span className="truncate flex-1">{conv.title}</span>
              </button>
              <button
                onClick={(e) => handleDeleteConversation(e, conv._id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-700/50 text-gray-300 transition-all"
                title="Supprimer la conversation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-white/20 p-2">
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 p-3 text-sm rounded-md hover:bg-gray-500/10 transition-colors text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15" />
            </svg>
            Déconnexion
          </button>
        </div>
      </div>
    </>
  );
} 