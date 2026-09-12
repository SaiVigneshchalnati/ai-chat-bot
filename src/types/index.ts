export interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    provider: 'google' | 'github' | 'facebook' | 'email';
}

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatSession {
    id: string;
    title: string;
    timestamp: number;
    messages: Message[];
}
