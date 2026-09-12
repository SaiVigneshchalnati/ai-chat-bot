import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    isLoading: boolean;
    handleSubmit: (e: React.FormEvent) => void;
}

export function ChatInput({ input, setInput, isLoading, handleSubmit }: ChatInputProps) {
    return (
        <div className="p-4 md:p-6 bg-black/20 backdrop-blur-md border-t border-white/5">
            <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Message Shield AI..."
                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all shadow-inner"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:bg-gray-700 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/30"
                >
                    <Send className="h-5 w-5" />
                </button>
            </form>
            <p className="text-center text-xs text-gray-500 mt-2">
                AI usage can generate incorrect information. Verify important details.
            </p>
        </div>
    );
}
