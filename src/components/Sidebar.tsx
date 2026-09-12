import React from 'react';
import { Plus, MessageSquare, Trash2, Clock, LogOut } from 'lucide-react';
import { UserProfile, ChatSession } from '../types';

// Use a subset of ChatSession for history items or just use ChatSession
type HistoryItem = ChatSession;

interface SidebarProps {
    isOpen: boolean;
    history: HistoryItem[];
    currentSessionId: string | null;
    onNewChat: () => void;
    onLoadChat: (id: string) => void;
    onDeleteChat: (id: string, e: React.MouseEvent) => void;
    toggleSidebar: () => void;
    user: UserProfile | null;
    onLogout: () => void;
}

export function Sidebar({
    isOpen,
    history,
    currentSessionId,
    onNewChat,
    onLoadChat,
    onDeleteChat,
    toggleSidebar,
    user,
    onLogout
}: SidebarProps) {

    // Group history by date (simple implementation)
    const groupedHistory = history.reduce((acc, item) => {
        const date = new Date(item.timestamp).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(item);
        return acc;
    }, {} as Record<string, HistoryItem[]>);

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={toggleSidebar}
            />

            {/* Hover Trigger Zone (Desktop Only) */}
            <div
                className={`fixed top-0 bottom-0 left-0 w-4 z-40 hidden md:block ${isOpen ? 'pointer-events-none' : ''}`}
                onMouseEnter={() => {
                    if (!isOpen) toggleSidebar();
                }}
            />

            {/* Sidebar Container */}
            <div
                onMouseLeave={() => {
                    if (isOpen) toggleSidebar();
                }}
                className={`
        fixed md:relative z-30 h-full flex flex-col
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0 md:w-0 overflow-hidden'}
        bg-black/40 backdrop-blur-xl border-r border-white/10
      `}>

                {/* New Chat Button */}
                <div className="p-4">
                    <button
                        onClick={() => {
                            onNewChat();
                            if (window.innerWidth < 768) toggleSidebar();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 group"
                    >
                        <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                        <span className="font-medium whitespace-nowrap">New Chat</span>
                    </button>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {Object.entries(groupedHistory).length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500 text-sm whitespace-nowrap">
                            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No chat history</p>
                        </div>
                    ) : (
                        Object.entries(groupedHistory).map(([date, items]) => (
                            <div key={date} className="px-2">
                                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-2 whitespace-nowrap">
                                    {date === new Date().toLocaleDateString() ? 'Today' : date}
                                </h3>
                                <div className="space-y-1">
                                    {items.sort((a, b) => b.timestamp - a.timestamp).map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => {
                                                onLoadChat(item.id);
                                                if (window.innerWidth < 768) toggleSidebar();
                                            }}
                                            className={`
                        group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors max-w-full
                        ${currentSessionId === item.id
                                                    ? 'bg-white/10 text-white'
                                                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}
                      `}
                                        >
                                            <MessageSquare className="h-4 w-4 flex-shrink-0" />
                                            <span className="text-sm truncate flex-1">{item.title}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDeleteChat(item.id, e);
                                                }}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-all"
                                                title="Delete chat"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* User / Footer */}
                <div className="p-4 border-t border-white/5">
                    {user && (
                        <div className="flex items-center gap-3 px-2">
                            <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-medium text-white shadow-lg">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                    user.name.charAt(0)
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                <p className="text-xs text-gray-400 truncate capitalize">{user.provider}</p>
                            </div>
                            <button
                                onClick={onLogout}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Sign out"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
