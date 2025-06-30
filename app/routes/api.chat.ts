import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { MAX_RESPONSE_SEGMENTS, MAX_TOKENS } from '~/lib/.server/llm/constants';
import { CONTINUE_PROMPT } from '~/lib/.server/llm/prompts';
import { streamText, type Messages, type StreamingOptions } from '~/lib/.server/llm/stream-text';
import SwitchableStream from '~/lib/.server/llm/switchable-stream';
import type { AIProvider } from '~/lib/.server/llm/model';

export async function action(args: ActionFunctionArgs) {
  return chatAction(args);
}

interface ChatRequest {
  messages: Messages;
  apiKeys?: Record<AIProvider, string>;
  provider?: AIProvider;
  model?: string;
}

async function chatAction({ context, request }: ActionFunctionArgs) {
  const { messages, apiKeys, provider = 'anthropic', model } = await request.json<ChatRequest>();

  const stream = new SwitchableStream();

  try {
    const options: StreamingOptions = {
      toolChoice: 'none',
      onFinish: async ({ text: content, finishReason }) => {
        if (finishReason !== 'length') {
          return stream.close();
        }

        if (stream.switches >= MAX_RESPONSE_SEGMENTS) {
          throw Error('Cannot continue message: Maximum segments reached');
        }

        const switchesLeft = MAX_RESPONSE_SEGMENTS - stream.switches;

        console.log(`Reached max token limit (${MAX_TOKENS}): Continuing message (${switchesLeft} switches left)`);

        messages.push({ role: 'assistant', content });
        messages.push({ role: 'user', content: CONTINUE_PROMPT });

        const result = await streamText({
          messages,
          env: context.cloudflare.env,
          options,
          apiKeys,
          provider,
          model,
        });

        return stream.switchSource(result.toAIStream());
      },
    };

    const result = await streamText({
      messages,
      env: context.cloudflare.env,
      options,
      apiKeys,
      provider,
      model,
    });

    stream.switchSource(result.toAIStream());

    return new Response(stream.readable, {
      status: 200,
      headers: {
        contentType: 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.log(error);

    if (error instanceof Error && error.message.includes('API key')) {
      throw new Response(JSON.stringify({ error: error.message }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    throw new Response(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
}