interface ElectronAPI {
  // AI API
  sendMessage: (message: string) => Promise<any>;
  loadProviders: () => Promise<any[]>;
  loadModels: (provider: string) => Promise<any[]>;
  getCurrentProvider: () => Promise<{ provider: string; model: string }>;
  setProvider: (provider: string, modelId: string) => Promise<boolean>;
  
  // MCP API
  listMcpServers: () => Promise<any[]>;
  listMcpTools: (serverName: string) => Promise<any[]>;
  executeMcpTool: (serverName: string, toolName: string, args: any) => Promise<any>;
  accessMcpResource: (serverName: string, uri: string) => Promise<any>;
  
  // Chat history API
  loadChatHistory: () => Promise<any[]>;
  createChat: (title?: string) => Promise<any>;
  addChatMessage: (chatId: string, message: any) => Promise<any>;
  updateChatTitle: (chatId: string, title: string) => Promise<boolean>;
  deleteChat: (chatId: string) => Promise<boolean>;
  clearAllChats: () => Promise<boolean>;
  
  // App settings API
  loadSettings: () => Promise<any>;
  saveSettings: (settings: any) => Promise<boolean>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};