import { Anthropic } from '@anthropic-ai/sdk';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

// Define provider types
export type Provider = 'anthropic' | 'openai';

// Define model interface
export interface Model {
  id: string;
  name: string;
  maxTokens: number;
  enabled: boolean;
}

// Define provider interface
export interface ProviderConfig {
  enabled: boolean;
  models: Model[];
}

// Define AI config interface
export interface AIConfig {
  providers: {
    anthropic: ProviderConfig;
    openai: ProviderConfig;
  };
  defaultProvider: Provider;
  defaultModel: string;
}

// Define message interface
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Define tool call interface
export interface ToolCall {
  id: string;
  type: string;
  name: string;
  args: any;
}

// Define tool result interface
export interface ToolResult {
  toolCallId: string;
  result: any;
}

// AI Service class
export class AIService {
  private config: AIConfig;
  private anthropic: Anthropic | null = null;
  private openai: OpenAI | null = null;
  private currentProvider: Provider;
  private currentModel: string;

  constructor() {
    // Load config
    const configPath = path.join(process.cwd(), 'config', 'ai.config.json');
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    
    // Set default provider and model
    this.currentProvider = this.config.defaultProvider;
    this.currentModel = this.config.defaultModel;
    
    // Initialize providers
    this.initProviders();
  }

  // Initialize AI providers
  private initProviders() {
    // Initialize Anthropic if enabled
    if (this.config.providers.anthropic.enabled) {
      try {
        this.anthropic = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY || '',
        });
        console.log('Anthropic provider initialized');
      } catch (error) {
        console.error('Failed to initialize Anthropic provider:', error);
      }
    }
    
    // Initialize OpenAI if enabled
    if (this.config.providers.openai.enabled) {
      try {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY || '',
        });
        console.log('OpenAI provider initialized');
      } catch (error) {
        console.error('Failed to initialize OpenAI provider:', error);
      }
    }
  }

  // Get available providers
  public getProviders(): { id: Provider; name: string; enabled: boolean }[] {
    return [
      { id: 'anthropic', name: 'Anthropic', enabled: this.config.providers.anthropic.enabled },
      { id: 'openai', name: 'OpenAI', enabled: this.config.providers.openai.enabled },
    ];
  }

  // Get available models for a provider
  public getModels(provider: Provider): Model[] {
    return this.config.providers[provider].models;
  }

  // Set current provider and model
  public setProvider(provider: Provider, modelId: string) {
    this.currentProvider = provider;
    this.currentModel = modelId;
  }

  // Get current provider and model
  public getCurrentProvider(): { provider: Provider; model: string } {
    return {
      provider: this.currentProvider,
      model: this.currentModel,
    };
  }

  // Send a message to the AI
  public async sendMessage(
    messages: Message[],
    onToolCall?: (toolCall: ToolCall) => Promise<any>
  ): Promise<{ response: string; toolCalls: ToolCall[] }> {
    switch (this.currentProvider) {
      case 'anthropic':
        return this.sendMessageToAnthropic(messages, onToolCall);
      case 'openai':
        return this.sendMessageToOpenAI(messages, onToolCall);
      default:
        throw new Error(`Unsupported provider: ${this.currentProvider}`);
    }
  }

  // Send a message to Anthropic
  private async sendMessageToAnthropic(
    messages: Message[],
    onToolCall?: (toolCall: ToolCall) => Promise<any>
  ): Promise<{ response: string; toolCalls: ToolCall[] }> {
    if (!this.anthropic) {
      throw new Error('Anthropic provider not initialized');
    }

    try {
      const response = await this.anthropic.messages.create({
        model: this.currentModel,
        messages: messages,
        max_tokens: 4096,
      });

      // TODO: Handle tool calls from Anthropic
      // This is a placeholder for when Anthropic supports tool calls
      return {
        response: response.content[0].text,
        toolCalls: [],
      };
    } catch (error) {
      console.error('Error sending message to Anthropic:', error);
      throw error;
    }
  }

  // Send a message to OpenAI
  private async sendMessageToOpenAI(
    messages: Message[],
    onToolCall?: (toolCall: ToolCall) => Promise<any>
  ): Promise<{ response: string; toolCalls: ToolCall[] }> {
    if (!this.openai) {
      throw new Error('OpenAI provider not initialized');
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: this.currentModel,
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        max_tokens: 4096,
      });

      // TODO: Handle tool calls from OpenAI
      // This is a placeholder for OpenAI tool calls
      return {
        response: response.choices[0].message.content || '',
        toolCalls: [],
      };
    } catch (error) {
      console.error('Error sending message to OpenAI:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const aiService = new AIService();