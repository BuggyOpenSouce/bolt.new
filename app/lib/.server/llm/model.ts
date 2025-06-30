import { getAnthropicModel, getGeminiModel, getOpenRouterModel, getGroqModel } from './providers';

export type AIProvider = 'anthropic' | 'gemini' | 'openrouter' | 'groq';

export interface ModelConfig {
  provider: AIProvider;
  model?: string;
  apiKey: string;
}

export function getModel(config: ModelConfig) {
  const { provider, apiKey, model } = config;

  switch (provider) {
    case 'anthropic':
      return getAnthropicModel(apiKey);
    case 'gemini':
      return getGeminiModel(apiKey);
    case 'openrouter':
      return getOpenRouterModel(apiKey, model);
    case 'groq':
      return getGroqModel(apiKey, model);
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}