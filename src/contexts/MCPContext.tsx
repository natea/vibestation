import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define server type
export type ServerType = 'stdio' | 'sse';

// Define server interface
export interface Server {
  name: string;
  type: ServerType;
  connected: boolean;
}

// Define tool interface
export interface Tool {
  name: string;
  description: string;
  inputSchema: any;
}

// Define MCP context interface
interface MCPContextType {
  servers: Server[];
  tools: { serverName: string; tool: Tool }[];
  serverTools: Map<string, Tool[]>;
  loading: boolean;
  error: string | null;
  executeTool: (serverName: string, toolName: string, args: any) => Promise<any>;
  accessResource: (serverName: string, uri: string) => Promise<any>;
}

// Create context with default values
const MCPContext = createContext<MCPContextType>({
  servers: [],
  tools: [],
  serverTools: new Map(),
  loading: false,
  error: null,
  executeTool: async () => ({}),
  accessResource: async () => ({}),
});

// Provider component
export const MCPProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [servers, setServers] = useState<Server[]>([]);
  const [tools, setTools] = useState<{ serverName: string; tool: Tool }[]>([]);
  const [serverTools, setServerTools] = useState<Map<string, Tool[]>>(new Map());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load servers and tools on mount
  useEffect(() => {
    const loadServers = async () => {
      try {
        setLoading(true);
        
        // Get servers from the main process
        const servers = await window.electronAPI.listMcpServers();
        setServers(servers);
        
        // Load tools for each server
        const allTools: { serverName: string; tool: Tool }[] = [];
        const serverToolsMap = new Map<string, Tool[]>();
        
        for (const server of servers) {
          if (server.connected) {
            const tools = await window.electronAPI.listMcpTools(server.name);
            serverToolsMap.set(server.name, tools);
            
            for (const tool of tools) {
              allTools.push({ serverName: server.name, tool });
            }
          }
        }
        
        setTools(allTools);
        setServerTools(serverToolsMap);
        
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };
    
    loadServers();
  }, []);

  // Execute a tool
  const executeTool = async (serverName: string, toolName: string, args: any): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      
      // Execute tool in the main process
      const result = await window.electronAPI.executeMcpTool(serverName, toolName, args);
      
      setLoading(false);
      
      if (result.error) {
        setError(result.error);
        return { error: result.error };
      }
      
      return result;
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      return { error: (error as Error).message };
    }
  };

  // Access a resource
  const accessResource = async (serverName: string, uri: string): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      
      // Access resource in the main process
      const result = await window.electronAPI.accessMcpResource(serverName, uri);
      
      setLoading(false);
      
      if (result.error) {
        setError(result.error);
        return { error: result.error };
      }
      
      return result;
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      return { error: (error as Error).message };
    }
  };

  // Context value
  const value = {
    servers,
    tools,
    serverTools,
    loading,
    error,
    executeTool,
    accessResource,
  };

  return <MCPContext.Provider value={value}>{children}</MCPContext.Provider>;
};

// Custom hook to use the MCP context
export const useMCP = () => useContext(MCPContext);