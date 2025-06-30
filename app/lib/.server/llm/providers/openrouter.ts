import { createOpenAI } from '@ai-sdk/openai';

export function getOpenRouterModel(apiKey: string, model: string = 'anthropic/claude-3.5-sonnet') {
  const openrouter = createOpenAI({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
  });

  return openrouter(model);
}