import { ipcMain } from 'electron';
import { aiService } from '../services/ai/ai-service';
import { mcpService } from '../services/mcp/mcp-service';
import { chatStorage } from '../services/storage/chat-storage';

// Register all IPC handlers
export function registerIpcHandlers(): void {
  // AI API handlers
  registerAiHandlers();
  
  // MCP API handlers
  registerMcpHandlers();
  
  // Chat history API handlers
  registerChatHandlers();
  
  // Settings API handlers
  registerSettingsHandlers();
  
  console.log('IPC handlers registered');
}

// Register AI API handlers
function registerAiHandlers(): void {
  // Send a message to the AI
  ipcMain.handle('ai:send-message', async (event, message: string) => {
    try {
      const messages = [{ role: 'user', content: message }];
      
      const response = await aiService.sendMessage(messages, async (toolCall) => {
        // Handle tool calls
        try {
          const result = await mcpService.executeTool(
            toolCall.name.split('.')[0], // Server name
            toolCall.name.split('.')[1], // Tool name
            toolCall.args
          );
          
          return result;
        } catch (error) {
          console.error('Error executing tool:', error);
          return { error: (error as Error).message };
        }
      });
      
      return response;
    } catch (error) {
      console.error('Error sending message to AI:', error);
      return { error: (error as Error).message };
    }
  });
  
  // Get available AI providers
  ipcMain.handle('ai:get-providers', () => {
    return aiService.getProviders();
  });
  
  // Get available models for a provider
  ipcMain.handle('ai:get-models', (event, provider: string) => {
    return aiService.getModels(provider as any);
  });
  
  // Set current provider and model
  ipcMain.handle('ai:set-provider', (event, provider: string, modelId: string) => {
    aiService.setProvider(provider as any, modelId);
    return true;
  });
  
  // Get current provider and model
  ipcMain.handle('ai:get-current-provider', () => {
    return aiService.getCurrentProvider();
  });
}

// Register MCP API handlers
function registerMcpHandlers(): void {
  // List MCP servers
  ipcMain.handle('mcp:list-servers', () => {
    return mcpService.getServers();
  });
  
  // List tools for a server
  ipcMain.handle('mcp:list-tools', (event, serverName: string) => {
    return mcpService.getServerTools(serverName);
  });
  
  // Execute a tool
  ipcMain.handle('mcp:execute-tool', async (event, serverName: string, toolName: string, args: any) => {
    try {
      const result = await mcpService.executeTool(serverName, toolName, args);
      return result;
    } catch (error) {
      console.error('Error executing tool:', error);
      return { error: (error as Error).message };
    }
  });
  
  // Access a resource
  ipcMain.handle('mcp:access-resource', async (event, serverName: string, uri: string) => {
    try {
      const resource = await mcpService.accessResource(serverName, uri);
      return resource;
    } catch (error) {
      console.error('Error accessing resource:', error);
      return { error: (error as Error).message };
    }
  });
}

// Register chat history API handlers
function registerChatHandlers(): void {
  // Load chat history
  ipcMain.handle('chat:load-history', () => {
    return chatStorage.getAllChats();
  });
  
  // Get a specific chat
  ipcMain.handle('chat:get-chat', (event, chatId: string) => {
    return chatStorage.getChat(chatId);
  });
  
  // Create a new chat
  ipcMain.handle('chat:create', (event, title?: string) => {
    return chatStorage.createChat(title);
  });
  
  // Add a message to a chat
  ipcMain.handle('chat:add-message', (event, chatId: string, message: any) => {
    return chatStorage.addMessage(chatId, message);
  });
  
  // Update a chat title
  ipcMain.handle('chat:update-title', (event, chatId: string, title: string) => {
    chatStorage.updateChatTitle(chatId, title);
    return true;
  });
  
  // Delete a chat
  ipcMain.handle('chat:delete', (event, chatId: string) => {
    return chatStorage.deleteChat(chatId);
  });
  
  // Clear all chats
  ipcMain.handle('chat:clear-all', () => {
    chatStorage.clearAllChats();
    return true;
  });
}

// Register settings API handlers
function registerSettingsHandlers(): void {
  // TODO: Implement settings storage
  
  // Load settings
  ipcMain.handle('settings:load', () => {
    return {}; // Placeholder
  });
  
  // Save settings
  ipcMain.handle('settings:save', (event, settings: any) => {
    return true; // Placeholder
  });
}