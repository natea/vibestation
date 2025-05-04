import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // AI API
  sendMessage: (message: string) => ipcRenderer.invoke('ai:send-message', message),
  loadProviders: () => ipcRenderer.invoke('ai:get-providers'),
  loadModels: (provider: string) => ipcRenderer.invoke('ai:get-models', provider),
  getCurrentProvider: () => ipcRenderer.invoke('ai:get-current-provider'),
  setProvider: (provider: string, modelId: string) =>
    ipcRenderer.invoke('ai:set-provider', provider, modelId),
  
  // MCP API
  listMcpServers: () => ipcRenderer.invoke('mcp:list-servers'),
  listMcpTools: (serverName: string) => ipcRenderer.invoke('mcp:list-tools', serverName),
  executeMcpTool: (serverName: string, toolName: string, args: any) =>
    ipcRenderer.invoke('mcp:execute-tool', serverName, toolName, args),
  accessMcpResource: (serverName: string, uri: string) =>
    ipcRenderer.invoke('mcp:access-resource', serverName, uri),
  
  // Chat history API
  loadChatHistory: () => ipcRenderer.invoke('chat:load-history'),
  createChat: (title?: string) => ipcRenderer.invoke('chat:create', title),
  addChatMessage: (chatId: string, message: any) =>
    ipcRenderer.invoke('chat:add-message', chatId, message),
  updateChatTitle: (chatId: string, title: string) =>
    ipcRenderer.invoke('chat:update-title', chatId, title),
  deleteChat: (chatId: string) => ipcRenderer.invoke('chat:delete', chatId),
  clearAllChats: () => ipcRenderer.invoke('chat:clear-all'),
  
  // App settings API
  loadSettings: () => ipcRenderer.invoke('settings:load'),
  saveSettings: (settings: any) => ipcRenderer.invoke('settings:save', settings),
});

// Log when preload script has loaded
console.log('Preload script loaded');