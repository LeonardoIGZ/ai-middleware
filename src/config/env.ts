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
    openAiApiKey: requireEnv('OPENAI_API_KEY'),
    appApiKey: requireEnv('APP_API_KEY'),
    port: process.env.PORT ?? '3000',
};
