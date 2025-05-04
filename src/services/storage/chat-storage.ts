import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

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

// Chat Storage class
export class ChatStorage {
  private storagePath: string;
  private chats: Map<string, Chat> = new Map();

  constructor() {
    // Set storage path
    this.storagePath = path.join(app.getPath('userData'), 'chats');
    
    // Create storage directory if it doesn't exist
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
    }
    
    // Load chats
    this.loadChats();
  }

  // Load all chats from storage
  private loadChats(): void {
    try {
      const files = fs.readdirSync(this.storagePath);
      
      for (const file of files) {
        if (file.endsWith('.json')) {
          try {
            const chatId = file.replace('.json', '');
            const chatData = fs.readFileSync(path.join(this.storagePath, file), 'utf-8');
            const chat = JSON.parse(chatData) as Chat;
            
            this.chats.set(chatId, chat);
          } catch (error) {
            console.error(`Error loading chat from ${file}:`, error);
          }
        }
      }
      
      console.log(`Loaded ${this.chats.size} chats from storage`);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  }

  // Save a chat to storage
  private saveChat(chatId: string): void {
    try {
      const chat = this.chats.get(chatId);
      
      if (chat) {
        const chatPath = path.join(this.storagePath, `${chatId}.json`);
        fs.writeFileSync(chatPath, JSON.stringify(chat, null, 2), 'utf-8');
      }
    } catch (error) {
      console.error(`Error saving chat ${chatId}:`, error);
    }
  }

  // Create a new chat
  public createChat(title: string = 'New Chat'): Chat {
    const chatId = Date.now().toString();
    
    const chat: Chat = {
      id: chatId,
      title,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    this.chats.set(chatId, chat);
    this.saveChat(chatId);
    
    return chat;
  }

  // Get a chat by ID
  public getChat(chatId: string): Chat | undefined {
    return this.chats.get(chatId);
  }

  // Get all chats
  public getAllChats(): Chat[] {
    return Array.from(this.chats.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  // Add a message to a chat
  public addMessage(chatId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
    const chat = this.chats.get(chatId);
    
    if (!chat) {
      throw new Error(`Chat ${chatId} not found`);
    }
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      ...message,
      timestamp: Date.now(),
    };
    
    chat.messages.push(newMessage);
    chat.updatedAt = Date.now();
    
    this.saveChat(chatId);
    
    return newMessage;
  }

  // Update a chat title
  public updateChatTitle(chatId: string, title: string): void {
    const chat = this.chats.get(chatId);
    
    if (!chat) {
      throw new Error(`Chat ${chatId} not found`);
    }
    
    chat.title = title;
    chat.updatedAt = Date.now();
    
    this.saveChat(chatId);
  }

  // Delete a chat
  public deleteChat(chatId: string): boolean {
    const chat = this.chats.get(chatId);
    
    if (!chat) {
      return false;
    }
    
    try {
      const chatPath = path.join(this.storagePath, `${chatId}.json`);
      
      if (fs.existsSync(chatPath)) {
        fs.unlinkSync(chatPath);
      }
      
      this.chats.delete(chatId);
      
      return true;
    } catch (error) {
      console.error(`Error deleting chat ${chatId}:`, error);
      return false;
    }
  }

  // Clear all chats
  public clearAllChats(): void {
    try {
      for (const chatId of this.chats.keys()) {
        this.deleteChat(chatId);
      }
      
      this.chats.clear();
    } catch (error) {
      console.error('Error clearing all chats:', error);
    }
  }
}

// Export a singleton instance
export const chatStorage = new ChatStorage();