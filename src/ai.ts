import OpenAI from "openai";
import { buildPrompt } from "./promp";
import { env } from './config/env';

// const openai = new OpenAI({ apiKey: env.openAiApiKey }); // <- Open AI API
const openai = new OpenAI({ 
    apiKey: env.openRouteApiKey,
    baseURL: 'https://openrouter.ai/api/v1',
}); // <- Open Route API

export async function generateQuery(userMessage: string): Promise<string> {
    const response = await openai.chat.completions.create(
        /*{ // OpenAI API 
            model: 'gpt-5.4',
            max_tokens: 1024,
            messages: [
                {
                    role: "user",
                    content: buildPrompt(userMessage)
                }
            ]
        }*/
        {
            model: 'minimax/minimax-m2.5:free',
            max_tokens: 1024,
            messages: [
                {
                    role: "user",
                    content: buildPrompt(userMessage)
                }
            ]
        }
    );

    const result = response.choices[0]?.message.content;
    if (!result) throw new Error('Empty response from OpenAI');

    return result?.trim();
};

