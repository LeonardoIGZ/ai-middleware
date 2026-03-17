import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is not defined. Check your .env file and project root.`);
    }

    return value;
}

export const env = {
    geminiApiKey: requireEnv('GEMINI_API_KEY'),
    openRouteApiKey: requireEnv('OPENROUTE_API_KEY'),
    groqApiKey: requireEnv('GROQ_API_KEY'),
    cerebrasApiKey: requireEnv('CEREBRAS_API_KEY'),
    appApiKey: requireEnv('APP_API_KEY'),
    port: process.env.PORT ?? '3000',
};
