export interface ChatMessage {
    role: 'user' | 'assitant' | 'system';
    content: (message: string) => string;
}

export interface AIService {
    name: string;
    generateQuery: (message: string) => Promise<string>;
}