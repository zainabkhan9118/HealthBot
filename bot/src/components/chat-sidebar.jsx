import React, { useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, MessageCircle, Trash } from 'lucide-react';
import ChatContext from '@/context/ChatContext';
import { format } from 'date-fns';

export function ChatSidebar() {
  const { chats, activeChat, setActiveChat, addChat, deleteChat } = useContext(ChatContext);
  const [isOpen, setIsOpen] = useState(true);

  // Function to get the first user message or fallback to default title
  const getChatTitle = (messages) => {
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (firstUserMessage) {
      // Truncate long messages
      return firstUserMessage.content.length > 25 
        ? firstUserMessage.content.substring(0, 25) + '...' 
        : firstUserMessage.content;
    }
    return 'New Chat';
  };

  // Function to format the date
  const formatDate = (date) => {
    if (!date) return '';
    const chatDate = new Date(date);
    return format(chatDate, 'MMM d, yyyy');
  };

  const handleAddChat = () => {
    addChat();
  };

  const handleSelectChat = (chatId) => {
    setActiveChat(chatId);
  };

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation(); // Prevent triggering the chat selection
    deleteChat(chatId);
  };

  return (
    <div className="h-screen border-r border-[#E6E6FA] bg-white/80 backdrop-blur-sm w-64 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#E6E6FA]">
        <Button 
          onClick={handleAddChat} 
          className="w-full bg-[#9B7EDC] hover:bg-[#8B6AD1] text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`mb-2 p-2 rounded-md cursor-pointer flex justify-between items-center ${
              activeChat === chat.id 
                ? 'bg-[#E6E6FA] text-[#9B7EDC]' 
                : 'hover:bg-gray-100'
            }`}
            onClick={() => handleSelectChat(chat.id)}
          >
            <div className="flex flex-col overflow-hidden">
              <div className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="font-medium text-sm truncate">
                  {getChatTitle(chat.messages)}
                </span>
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {formatDate(chat.createdAt)}
              </span>
            </div>
            
            {/* Only show delete button if we have more than one chat */}
            {chats.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="opacity-50 hover:opacity-100 hover:bg-red-100 hover:text-red-500 p-1 h-auto"
                onClick={(e) => handleDeleteChat(e, chat.id)}
              >
                <Trash className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatSidebar;
