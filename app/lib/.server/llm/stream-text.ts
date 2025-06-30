import { streamText as _streamText, convertToCoreMessages } from 'ai';
import { getAPIKey } from '~/lib/.server/llm/api-key';
import { getModel, type AIProvider, type ModelConfig } from '~/lib/.server/llm/model';
import { MAX_TOKENS } from './constants';
import { getSystemPrompt } from './prompts';

interface ToolResult<Name extends string, Args, Result> {
  toolCallId: string;
  toolName: Name;
  args: Args;
  result: Result;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolResult<string, unknown, unknown>[];
}

export type Messages = Message[];

export type StreamingOptions = Omit<Parameters<typeof _streamText>[0], 'model'>;

interface StreamTextOptions {
  messages: Messages;
  env: Env;
  options?: StreamingOptions;
  apiKeys?: Record<AIProvider, string>;
  provider?: AIProvider;
  model?: string;
}

export function streamText({ messages, env, options, apiKeys, provider = 'anthropic', model }: StreamTextOptions) {
  // Use custom API key if provided, otherwise fall back to environment
  const apiKey = apiKeys?.[provider] || getAPIKey(env, provider);
  
  if (!apiKey) {
    throw new Error(`No API key found for provider: ${provider}`);
  }

  const modelConfig: ModelConfig = {
    provider,
    apiKey,
    model,
  };

  const modelInstance = getModel(modelConfig);

  const streamOptions: Parameters<typeof _streamText>[0] = {
    model: modelInstance,
    system: getSystemPrompt(),
    maxTokens: MAX_TOKENS,
    messages: convertToCoreMessages(messages),
    ...options,
  };

  // Add provider-specific headers
  if (provider === 'anthropic') {
    streamOptions.headers = {
      'anthropic-beta': 'max-tokens-3-5-sonnet-2024-07-15',
    };
  }

  return _streamText(streamOptions);
}