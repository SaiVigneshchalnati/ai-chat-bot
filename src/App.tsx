import React, { useState, useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Sidebar } from './components/Sidebar';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Message, ChatSession, UserProfile } from './types';

// Initialize Gemini AI with the correct API version
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Login State
  const [user, setUser] = useState<UserProfile | null>(null);

  // Sidebar & History State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    // Check login status
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(history));
  }, [history]);

  // Handle Login
  const handleLogin = (user: UserProfile) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  // Handle Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Save current session messages to history
  useEffect(() => {
    if (!currentSessionId && messages.length > 0) {
      // Create new session if none exists but messages exist
      const newId = Date.now().toString();
      const firstMessage = messages[0].content.slice(0, 30) + (messages[0].content.length > 30 ? '...' : '');
      const newSession: ChatSession = {
        id: newId,
        title: firstMessage || 'New Chat',
        timestamp: Date.now(),
        messages: messages
      };
      setHistory(prev => [newSession, ...prev]);
      setCurrentSessionId(newId);
    } else if (currentSessionId) {
      // Update existing session
      setHistory(prev => prev.map(session =>
        session.id === currentSessionId
          ? { ...session, messages: messages }
          : session
      ));
    }
  }, [messages, currentSessionId]);

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setInput('');
  };

  const handleLoadChat = (id: string) => {
    const session = history.find(s => s.id === id);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(session.id);
    }
  };

  const handleDeleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      handleNewChat();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

      // Initialize empty assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      const result = await model.generateContentStream(userMessage);

      let fullText = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;

        // Update the last message (assistant's placeholder) with new accumulated text
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'assistant') {
            lastMessage.content = fullText;
          }
          return newMessages;
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        // If we added a placeholder, update it. If not (error before stream), add one.
        if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'assistant') {
          newMessages[newMessages.length - 1].content = `Error details: ${error.message || error}`;
        } else {
          newMessages.push({ role: 'assistant', content: `Error details: ${error.message || error}` });
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen text-white overflow-hidden selection:bg-purple-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        history={history}
        currentSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onLoadChat={handleLoadChat}
        onDeleteChat={handleDeleteChat}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        user={user}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col h-full min-w-0 transition-all duration-300">
        <Header
          user={user}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Main Chat Area */}
        <main className="flex-1 overflow-hidden relative container mx-auto max-w-5xl p-4 md:p-6 flex flex-col gap-4">

          <div className="glass flex-1 rounded-2xl flex flex-col overflow-hidden shadow-2xl ring-1 ring-white/5 relative">

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-6">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative h-24 w-24 bg-black rounded-full flex items-center justify-center ring-1 ring-white/10">
                      <Bot className="h-12 w-12 text-blue-400" />
                    </div>
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h2 className="text-2xl font-bold text-white">How can I help you?</h2>
                    <p className="text-gray-400">I'm here to assist with your questions, code, and creative tasks. Just type below to begin.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 pb-4">
                  {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
                  ))}

                  {isLoading && (
                    <div className="flex gap-4 message-animation">
                      <div className="mt-1 h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center shadow-lg">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Thinking</span>
                        <div className="typing-indicator">
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                          <span className="typing-dot"></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-4" />
                </div>
              )}
            </div>

            {/* Input Area */}
            <ChatInput
              input={input}
              setInput={setInput}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;