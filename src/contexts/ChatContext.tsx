import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define chat message interface
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

// Define chat interface
export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

// Define chat context interface
interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  loading: boolean;
  error: string | null;
  createChat: (title?: string) => Promise<Chat>;
  selectChat: (chatId: string) => Promise<void>;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => Promise<ChatMessage>;
  updateChatTitle: (title: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<boolean>;
  clearAllChats: () => Promise<void>;
}

// Create context with default values
const ChatContext = createContext<ChatContextType>({
  chats: [],
  currentChat: null,
  loading: false,
  error: null,
  createChat: async () => ({ id: '', title: '', messages: [], createdAt: 0, updatedAt: 0 }),
  selectChat: async () => {},
  addMessage: async () => ({ id: '', role: 'user', content: '', timestamp: 0 }),
  updateChatTitle: async () => {},
  deleteChat: async () => false,
  clearAllChats: async () => {},
});

// Provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load chat history on mount
  useEffect(() => {
    const loadChats = async () => {
      try {
        setLoading(true);
        
        // Get chats from the main process
        const chats = await window.electronAPI.loadChatHistory();
        setChats(chats);
        
        // Set current chat to the most recent one if available
        if (chats.length > 0) {
          setCurrentChat(chats[0]);
        }
        
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };
    
    loadChats();
  }, []);

  // Create a new chat
  const createChat = async (title: string = 'New Chat'): Promise<Chat> => {
    try {
      setLoading(true);
      
      // Create chat in the main process
      const chat = await window.electronAPI.createChat(title);
      
      // Update state
      setChats([chat, ...chats]);
      setCurrentChat(chat);
      
      setLoading(false);
      
      return chat;
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      throw error;
    }
  };

  // Select a chat
  const selectChat = async (chatId: string): Promise<void> => {
    try {
      const chat = chats.find(chat => chat.id === chatId);
      
      if (chat) {
        setCurrentChat(chat);
      } else {
        throw new Error(`Chat ${chatId} not found`);
      }
    } catch (error) {
      setError((error as Error).message);
      throw error;
    }
  };

  // Add a message to the current chat
  const addMessage = async (message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ChatMessage> => {
    try {
      if (!currentChat) {
        throw new Error('No chat selected');
      }
      
      setLoading(true);
      
      // Add message in the main process
      const newMessage = await window.electronAPI.addChatMessage(currentChat.id, message);
      
      setCurrentChat(prevChat => {
        if (!prevChat) return prevChat;
        const updatedChat = {
          ...prevChat,
          messages: [...prevChat.messages, newMessage],
          updatedAt: Date.now(),
        };
        return updatedChat;
      });
      
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === currentChat.id
            ? {
                ...chat,
                messages: [...chat.messages, newMessage],
                updatedAt: Date.now(),
              }
            : chat
        )
      );
      
      setLoading(false);
      
      return newMessage;
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      throw error;
    }
  };

  // Update the title of the current chat
  const updateChatTitle = async (title: string): Promise<void> => {
    try {
      if (!currentChat) {
        throw new Error('No chat selected');
      }
      
      setLoading(true);
      
      // Update title in the main process
      await window.electronAPI.updateChatTitle(currentChat.id, title);
      
      // Update state
      const updatedChat = {
        ...currentChat,
        title,
        updatedAt: Date.now(),
      };
      
      setCurrentChat(updatedChat);
      setChats(chats.map(chat => chat.id === updatedChat.id ? updatedChat : chat));
      
      setLoading(false);
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      throw error;
    }
  };

  // Delete a chat
  const deleteChat = async (chatId: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Delete chat in the main process
      const success = await window.electronAPI.deleteChat(chatId);
      
      if (success) {
        // Update state
        const updatedChats = chats.filter(chat => chat.id !== chatId);
        setChats(updatedChats);
        
        // If the deleted chat was the current chat, select a new one
        if (currentChat && currentChat.id === chatId) {
          setCurrentChat(updatedChats.length > 0 ? updatedChats[0] : null);
        }
      }
      
      setLoading(false);
      
      return success;
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      return false;
    }
  };

  // Clear all chats
  const clearAllChats = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Clear all chats in the main process
      await window.electronAPI.clearAllChats();
      
      // Update state
      setChats([]);
      setCurrentChat(null);
      
      setLoading(false);
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      throw error;
    }
  };

  // Context value
  const value = {
    chats,
    currentChat,
    loading,
    error,
    createChat,
    selectChat,
    addMessage,
    updateChatTitle,
    deleteChat,
    clearAllChats,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Custom hook to use the chat context
export const useChat = () => useContext(ChatContext);