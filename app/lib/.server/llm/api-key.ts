import type { AIProvider } from './model';

export function getAPIKey(cloudflareEnv: Env, provider: AIProvider = 'anthropic') {
  /**
   * The `cloudflareEnv` is only used when deployed or when previewing locally.
   * In development the environment variables are available through `env`.
   */
  switch (provider) {
    case 'anthropic':
      return process.env.ANTHROPIC_API_KEY || cloudflareEnv.ANTHROPIC_API_KEY;
    case 'gemini':
      return process.env.GOOGLE_API_KEY || cloudflareEnv.GOOGLE_API_KEY;
    case 'openrouter':
      return process.env.OPENROUTER_API_KEY || cloudflareEnv.OPENROUTER_API_KEY;
    case 'groq':
      return process.env.GROQ_API_KEY || cloudflareEnv.GROQ_API_KEY;
    default:
      return process.env.ANTHROPIC_API_KEY || cloudflareEnv.ANTHROPIC_API_KEY;
  }
}