import React from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';

interface ChatMessageProps {
    message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isAssistant = message.role === 'assistant';

    return (
        <div className={`flex gap-4 message-animation ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className={`mt-1 flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-lg ${isAssistant
                    ? 'bg-gradient-to-br from-blue-600 to-purple-700'
                    : 'bg-zinc-800 border border-white/10'
                }`}>
                {isAssistant ? (
                    <Bot className="h-5 w-5 text-white" />
                ) : (
                    <User className="h-5 w-5 text-gray-300" />
                )}
            </div>

            <div className={`relative px-6 py-4 rounded-2xl max-w-[85%] md:max-w-[75%] shadow-md ${isAssistant
                    ? 'bg-white/5 border border-white/10 text-gray-100 rounded-tl-none'
                    : 'bg-blue-600 text-white rounded-tr-none'
                }`}>
                <ReactMarkdown
                    className="prose prose-invert max-w-none text-sm md:text-base prose-p:leading-relaxed prose-pre:bg-black/30 prose-pre:border prose-pre:border-white/10"
                >
                    {message.content}
                </ReactMarkdown>
            </div>
        </div>
    );
}
