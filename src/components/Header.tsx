import React from 'react';
import { Shield, Menu, User } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
    user: UserProfile | null;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export function Header({ user, isSidebarOpen, toggleSidebar }: HeaderProps) {
    return (
        <header className="glass border-b-0 z-10 px-6 py-4 flex items-center justify-between sticky top-0">
            <div className="flex items-center gap-3">
                <button
                    onClick={toggleSidebar}
                    className="p-2 -ml-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                    <Menu className="h-6 w-6" />
                </button>

                <div className="p-2 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl shadow-lg ring-1 ring-white/20">
                    <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Shield AI
                    </h1>
                    <p className="text-xs text-gray-400">Secure Artificial Intelligence</p>
                </div>
            </div>
            <div className="flex gap-2">
                {/* User Avatar */}
                {user && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                        <div className="h-6 w-6 rounded-full overflow-hidden bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-medium">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                                user.name.charAt(0)
                            )}
                        </div>
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors hidden md:block">
                            {user.name}
                        </span>
                    </div>
                )}
                {!user && (
                    <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center ring-1 ring-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                        <User className="h-4 w-4 text-gray-400" />
                    </div>
                )}
            </div>
        </header>
    );
}
