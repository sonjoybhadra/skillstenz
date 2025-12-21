'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Layout from '@/components/Layout';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AIAssistantPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState({ queries: 0, limit: 10 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?redirect=/ai-assistant');
      return;
    }
    if (isAuthenticated) {
      fetchUsageStats();
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchUsageStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/ai/usage`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUsage({ queries: data.totalQueries || 0, limit: data.limit || 10 });
      }
    } catch (error) {
      console.error('Failed to fetch usage stats:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/ai/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: input })
      });

      const data = await response.json();

      if (response.ok) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        fetchUsageStats();
      } else {
        toast.error(data.message || 'Failed to get response');
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.message || 'Sorry, I encountered an error. Please try again.',
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('AI query error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Network error. Please check your connection and try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Explain React hooks',
    'How to use TypeScript with Next.js?',
    'Best practices for REST API design',
    'How to prepare for coding interviews?',
    'Explain async/await in JavaScript'
  ];

  if (authLoading) {
    return (
      <Layout showSidebar>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[var(--border-primary)] border-t-[var(--bg-accent)]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Header */}
        <div className="bg-[var(--bg-card)] border-b border-[var(--border-primary)] px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl">
                  🤖
                </span>
                AI Assistant
              </h1>
              <p className="text-[var(--text-secondary)] mt-1">Your personal coding and learning companion</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-[var(--text-secondary)]">Queries Used</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                    style={{ width: `${Math.min((usage.queries / usage.limit) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">
                  {usage.queries}/{usage.limit}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-4xl mx-auto mb-6">
                  🤖
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  Hi there! I&apos;m your AI Assistant
                </h2>
                <p className="text-[var(--text-secondary)] mb-8 max-w-md mx-auto">
                  Ask me anything about coding, career advice, or learning. I&apos;m here to help!
                </p>
                
                <div className="flex flex-wrap justify-center gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(prompt)}
                      className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-full text-sm text-[var(--text-secondary)] hover:border-[var(--bg-accent)] hover:text-[var(--text-accent)] transition-all"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isUser 
                          ? 'bg-[var(--bg-accent)] text-white' 
                          : 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                      }`}>
                        {message.isUser ? '👤' : '🤖'}
                      </div>
                      <div className={`rounded-2xl px-4 py-3 ${
                        message.isUser
                          ? 'bg-[var(--bg-accent)] text-white'
                          : 'bg-[var(--bg-card)] border border-[var(--border-primary)] text-[var(--text-primary)]'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.text}</p>
                        <p className={`text-xs mt-2 ${message.isUser ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0">
                        🤖
                      </div>
                      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                          </div>
                          <span className="text-[var(--text-secondary)] text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-[var(--bg-card)] border-t border-[var(--border-primary)] px-6 py-4">
          <div className="max-w-4xl mx-auto">
            {usage.queries >= usage.limit && (
              <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  You&apos;ve reached your daily query limit. Upgrade your plan for unlimited access.
                </p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={loading || usage.queries >= usage.limit}
                className="flex-1 px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:border-[var(--bg-accent)] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !input.trim() || usage.queries >= usage.limit}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
