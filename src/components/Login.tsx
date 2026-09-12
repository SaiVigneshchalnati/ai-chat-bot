import React, { useState } from 'react';
import { Shield, Github, Mail, ArrowRight } from 'lucide-react';
import { ParticleBackground } from './ParticleBackground';
import { UserProfile } from '../types';

interface LoginProps {
    onLogin: (user: UserProfile) => void;
}

export function Login({ onLogin }: LoginProps) {
    const [isLogin, setIsLogin] = useState(true);

    const handleSocialLogin = (provider: UserProfile['provider']) => {
        // Mock User Data based on provider
        const mockUsers: Record<string, UserProfile> = {
            google: {
                id: 'g_12345',
                name: 'Alex Chen',
                email: 'alex.chen@gmail.com',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150',
                provider: 'google'
            },
            facebook: {
                id: 'fb_67890',
                name: 'Sarah Jordan',
                email: 'sarah.j@facebook.com',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150',
                provider: 'facebook'
            },
            github: {
                id: 'gh_98765',
                name: 'Dev User',
                email: 'dev@github.com',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150',
                provider: 'github'
            },
            email: {
                id: 'e_54321',
                name: 'Email User',
                email: 'user@example.com',
                provider: 'email'
            }
        };

        const user = mockUsers[provider] || mockUsers['google'];
        onLogin(user);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black text-white selection:bg-purple-500/30">
            {/* Dynamic Particle Background */}
            <ParticleBackground />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-md p-6">

                {/* Logo & Header */}
                <div className="text-center mb-8 space-y-2">
                    <div className="inline-flex p-3 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl shadow-xl ring-1 ring-white/20 mb-4 animate-float">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-400">
                        Welcome to Shield AI
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {isLogin
                            ? "Sign in to continue your secure conversation"
                            : "Create an account to get started"}
                    </p>
                </div>

                {/* Card */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">

                    {/* Social Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => handleSocialLogin('google')}
                            className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-100 font-medium py-3 px-4 rounded-xl transition-all active:scale-[0.98]"
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        <button
                            onClick={() => handleSocialLogin('facebook')}
                            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-medium py-3 px-4 rounded-xl transition-all active:scale-[0.98]"
                        >
                            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                                <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v2.277h-2.67c-3.083 0-3.268 1.488-3.268 3.205v1.778h4.44l-1 3.667h-3.44v7.98h-2.529z" />
                            </svg>
                            Continue with Facebook
                        </button>

                        <button
                            onClick={() => handleSocialLogin('github')}
                            className="w-full flex items-center justify-center gap-3 bg-[#24292F] hover:bg-[#2c323b] text-white font-medium py-3 px-4 rounded-xl transition-all active:scale-[0.98]"
                        >
                            <Github className="h-5 w-5" />
                            Continue with GitHub
                        </button>
                    </div>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-black/40 text-gray-500 rounded">Or continue with email</span>
                        </div>
                    </div>

                    {/* Email Form (Visual Only) */}
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSocialLogin('email'); }}>
                        <div>
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                        {!isLogin && (
                            <div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all"
                                />
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 px-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                        >
                            {isLogin ? "Sign In" : "Create Account"}
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    {/* Toggle */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-400 text-sm">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all"
                            >
                                {isLogin ? "Sign up" : "Log in"}
                            </button>
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-xs text-gray-600">
                    <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
                </div>
            </div>
        </div>
    );
}
