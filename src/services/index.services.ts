import { cerebrasService } from './cerebras';
import { groqService } from './groq';
import { openRouterService } from './openrouter';
import { geminiService } from './gemini';

// available services
export const services = [
    geminiService,
    groqService,
    cerebrasService,
    openRouterService
];