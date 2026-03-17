import OpenAI from "openai";
import { buildPrompt } from '../prompt';
import { AIService } from '../../types';
import { env } from '../config/env';

const groq = new OpenAI({
    apiKey: env.groqApiKey,
    baseURL: 'https://api.groq.com/openai/v1',
});

export const groqService: AIService = {
    name: 'Groq',
    async generateQuery(message: string): Promise<string> {
        const response = await groq.chat.completions.create(
            {
                model: 'llama-3.1-8b-instant',
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
        if (!result) throw new Error('Empty response from Groq');

        return result?.trim();
    }
};

