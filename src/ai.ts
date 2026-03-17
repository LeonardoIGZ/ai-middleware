import OpenAI from "openai";
import {buildPrompt} from "./promp";
import { env } from './config/env';

const openai = new OpenAI({ apiKey: env.openAiApiKey });

export async function generateQuery(userMessage: string): Promise<string>  {
    const response = await openai.chat.completions.create({
        model: 'gpt-5.4',
        max_tokens: 1024,
        messages: [
            {
                role: "user",
                content: buildPrompt(userMessage)
            }
        ] 
    });

    const result = response.choices[0]?.message.content;
    if(!result) throw new Error('Empty response from OpenAI'); 
    
    return result?.trim();
};

