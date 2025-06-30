import { createGoogleGenerativeAI } from '@ai-sdk/google';

export function getGeminiModel(apiKey: string) {
  const google = createGoogleGenerativeAI({
    apiKey,
  });

  return google('gemini-1.5-pro-latest');
}