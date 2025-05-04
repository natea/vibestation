import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define provider and model types
export type Provider = 'anthropic' | 'openai';

export interface Model {
  id: string;
  name: string;
  maxTokens: number;
  enabled: boolean;
}

export interface ProviderInfo {
  id: Provider;
  name: string;
  enabled: boolean;
}

// Define message interface
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

// Define AI context interface
interface AIContextType {
  providers: ProviderInfo[];
  models: Model[];
  currentProvider: Provider;
  currentModel: string;
  loading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<string>;
  setProvider: (provider: Provider, modelId: string) => void;
}

// Create context with default values
const AIContext = createContext<AIContextType>({
  providers: [],
  models: [],
  currentProvider: 'anthropic',
  currentModel: '',
  loading: false,
  error: null,
  sendMessage: async () => '',
  setProvider: () => {},
});

// Provider component
export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [currentProvider, setCurrentProvider] = useState<Provider>('anthropic');
  const [currentModel, setCurrentModel] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load providers and models on mount
  useEffect(() => {
    const loadProviders = async () => {
      try {
        setLoading(true);
        
        // Get providers from the main process
        const providers = await window.electronAPI.loadProviders();
        setProviders(providers);
        
        // Get current provider and model
        const { provider, model } = await window.electronAPI.getCurrentProvider();
        setCurrentProvider(provider as Provider);
        setCurrentModel(model);
        
        // Load models for the current provider
        const models = await window.electronAPI.loadModels(provider);
        setModels(models);
        
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };
    
    loadProviders();
  }, []);

  // Load models when provider changes
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoading(true);
        
        // Load models for the current provider
        const models = await window.electronAPI.loadModels(currentProvider);
        setModels(models);
        
        // Set default model if none selected
        if (!currentModel && models.length > 0) {
          setCurrentModel(models[0].id);
          await window.electronAPI.setProvider(currentProvider, models[0].id);
        }
        
        setLoading(false);
      } catch (error) {
        setError((error as Error).message);
        setLoading(false);
      }
    };
    
    loadModels();
  }, [currentProvider]);

  // Set provider and model
  const handleSetProvider = async (provider: Provider, modelId: string) => {
    try {
      setLoading(true);
      
      // Set provider and model in the main process
      await window.electronAPI.setProvider(provider, modelId);
      
      setCurrentProvider(provider);
      setCurrentModel(modelId);
      
      setLoading(false);
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
    }
  };

  // Send message to AI
  const sendMessage = async (message: string): Promise<string> => {
    try {
      setLoading(true);
      setError(null);
      
      // Send message to the main process
      const response = await window.electronAPI.sendMessage(message);
      
      setLoading(false);
      
      if (response.error) {
        setError(response.error);
        return '';
      }
      
      return response.response;
    } catch (error) {
      setError((error as Error).message);
      setLoading(false);
      return '';
    }
  };

  // Context value
  const value = {
    providers,
    models,
    currentProvider,
    currentModel,
    loading,
    error,
    sendMessage,
    setProvider: handleSetProvider,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};

// Custom hook to use the AI context
export const useAI = () => useContext(AIContext);