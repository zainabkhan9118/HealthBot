import { createContext, useState, useEffect } from 'react';

const ChatContext = createContext({
  activeChat: null,
  chats: [],
  setActiveChat: () => {},
  addChat: () => {},
  updateChat: () => {},
  deleteChat: () => {},
});

export const ChatProvider = ({ children }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [chats, setChats] = useState([]);

  // Initialize with a default chat if none exists
  useEffect(() => {
    if (chats.length === 0) {
      const newChat = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [{
          role: 'assistant',
          content: 'Hi there! I\'m MIND, your mental wellness companion. How are you feeling today?'
        }],
        createdAt: new Date()
      };
      setChats([newChat]);
      setActiveChat(newChat.id);
    }
  }, []);

  const addChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{
        role: 'assistant',
        content: 'Hi there! I\'m MIND, your mental wellness companion. How are you feeling today?'
      }],
      createdAt: new Date()
    };
    setChats(prev => [...prev, newChat]);
    setActiveChat(newChat.id);
    return newChat;
  };

  const updateChat = (chatId, updatedChat) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, ...updatedChat } : chat
    ));
  };

  const deleteChat = (chatId) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    
    // If we're deleting the active chat, set the first available chat as active
    if (activeChat === chatId && chats.length > 1) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      setActiveChat(remainingChats[0]?.id || null);
    }
    
    // If we're deleting the last chat, create a new one
    if (chats.length === 1) {
      addChat();
    }
  };

  const value = {
    activeChat,
    setActiveChat,
    chats,
    addChat,
    updateChat,
    deleteChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
