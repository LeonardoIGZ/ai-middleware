import OpenAI from "openai";
import { buildPrompt } from '../prompt';
import { AIService } from '../../types';
import { env } from '../config/env';

const gemini = new OpenAI({
    apiKey: env.geminiApiKey,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

export const geminiService: AIService = {
    name: 'Gemini',
    async generateQuery(message: string): Promise<string> {
        const response = await gemini.chat.completions.create(
            {
                model: 'gemini-3-flash-preview',
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
        if (!result) throw new Error('Empty response from Gemini');

        return result?.trim();
    }
};