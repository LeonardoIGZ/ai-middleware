import OpenAI from 'openai';
import { buildPrompt } from '../prompt';
import { AIService } from '../../types';
import { env } from '../config/env';

const openRoute = new OpenAI({
    apiKey: env.openRouteApiKey,
    baseURL: 'https://openrouter.ai/api/v1',
});

export const openRouterService: AIService = {
    name: 'OpenRouter',
    async generateQuery(message: string): Promise<string> {
        const response = await openRoute.chat.completions.create(
            {
                model: 'openai/gpt-oss-120b',
                max_tokens: 1024,
                messages: [
                    {
                        role: "user",
                        content: buildPrompt(message)
                    }
                ]
            }
        );

        const result = response.choices[0]?.message.content;
        if (!result) throw new Error('Empty response from OpenRouter');

        return result?.trim();
    }

};
