import OpenAI from 'openai';
import { buildPrompt } from '../prompt';
import { AIService } from '../../types';
import { env } from '../config/env';

const cerebras = new OpenAI({
    apiKey: env.cerebrasApiKey,
    baseURL: 'https://api.cerebras.ai/v1'
});

export const cerebrasService: AIService = {
    name: 'Cerebras',
    async generateQuery(message: string): Promise<string> {
        const response = await cerebras.chat.completions.create(
            {
                model: 'llama3.1-8b',
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
        if (!result) throw new Error('Empty response from Cerebras');

        return result?.trim();
    }
};