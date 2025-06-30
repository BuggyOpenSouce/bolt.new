import { createOpenAI } from '@ai-sdk/openai';

export function getGroqModel(apiKey: string, model: string = 'llama-3.1-70b-versatile') {
  const groq = createOpenAI({
    apiKey,
    baseURL: 'https://api.groq.com/openai/v1',
  });

  return groq(model);
}