'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Sun, 
  Moon, 
  Trash2,
  Zap,
  Brain,
  BookOpen,
  Copy
} from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string; id: number; timestamp: Date }[]>([
    { id: 1, role: 'assistant', content: "Hello! I'm **Lumi**, your intelligent AI assistant. I can help with explanations, research, creative tasks, and much more! ✨\n\nWhat would you like to work on today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const messageCount = useRef(2);

  useEffect(() => {
    setMounted(true);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClearChat = () => {
    setMessages([
      { 
        id: messageCount.current++, 
        role: 'assistant', 
        content: "Chat cleared! I'm ready to help with your next question. What would you like to know? 🎯",
        timestamp: new Date()
      }
    ]);
  };

  const quickPrompts = [
    { icon: <BookOpen size={16} />, text: "Explain a complex concept" },
    { icon: <Brain size={16} />, text: "Help with coding" },
    { icon: <Zap size={16} />, text: "Write a summary" },
    { icon: <Sparkles size={16} />, text: "Brainstorm ideas" }
  ];

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { 
      id: messageCount.current++, 
      role: 'user', 
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages.map(({ role, content }) => ({ role, content })) }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setMessages(prev => [...prev, { 
        id: messageCount.current++, 
        role: 'assistant', 
        content: data.content,
        timestamp: new Date()
      }]);
    } catch (error: any) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        id: messageCount.current++, 
        role: 'assistant', 
        content: `I encountered an error: ${error.message}. Please try again!`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // Optionally, show a toast or something, but for now, just copy
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-indigo-950 transition-all duration-500">
      <div className="max-w-4xl mx-auto p-3 md:p-6 flex flex-col h-screen gap-3 md:gap-4">
        {/* Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, rotateX: [5, 0] }}
          transition={{ duration: 0.6, rotateX: { type: "spring", stiffness: 200 } }}
          className="glass-effect rounded-2xl p-3 md:p-6 shadow-2xl bg-slate-900/60 backdrop-blur-xl border border-purple-500/20 shadow-purple-500/10"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear", scale: { duration: 2, repeat: Infinity } }}
                className="relative"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 animate-pulse-slow shadow-lg shadow-pink-500/50" />
              </motion.div>
              
              <div>
                <h1 className="text-xl md:text-3xl font-black tracking-tighter">
                  <motion.span
                    animate={{ scale: [1, 1.05, 1], textShadow: ["0 0 0px #8b5cf6", "0 0 10px #8b5cf6", "0 0 0px #8b5cf6"] }}
                    transition={{ duration: 4, textShadow: { duration: 2, repeat: Infinity } }}
                    className="bg-gradient-to-r from-purple-400 via-pink-400 to-violet-400 bg-clip-text text-transparent"
                  >
                    LUMI
                  </motion.span>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block ml-2"
                  >
                    ✨
                  </motion.span>
                </h1>
                <p className="text-xs md:text-sm uppercase tracking-wider text-purple-300 mt-1">
                  Intelligent AI Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearChat}
                className="px-2 md:px-3 py-1 md:py-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 text-purple-300 text-xs md:text-sm font-medium flex items-center gap-1 md:gap-2 transition-all hover:shadow-md hover:bg-gradient-to-r hover:from-purple-900 hover:to-violet-900 border border-purple-500/30 hover:border-purple-400/50"
              >
                <Trash2 size={16} />
                Clear Chat
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center transition-all shadow-lg border border-purple-500/30 shadow-purple-500/10"
              >
                {theme === 'dark' ? 
                  <Sun className="w-5 h-5 text-yellow-500" /> : 
                  <Moon className="w-5 h-5 text-gray-700" />
                }
              </motion.button>
            </div>
          </div>

          {/* Quick Prompts */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2"
          >
            {quickPrompts.map((prompt, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuickPrompt(prompt.text)}
                className="p-2 md:p-3 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-purple-500/20 text-sm text-purple-200 flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-purple-500/20 hover:bg-gradient-to-br hover:from-purple-900/60 hover:to-violet-900/60 hover:border-purple-400/40"
              >
                {prompt.icon}
                <span className="truncate">{prompt.text}</span>
              </motion.button>
            ))}
          </motion.div>
        </motion.header>

        {/* Chat Messages */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1 overflow-y-auto scrollbar-custom rounded-2xl p-3 md:p-6 bg-gradient-to-br from-slate-900/40 to-slate-950/40 backdrop-blur-xl border border-purple-500/10 shadow-inner shadow-purple-500/5"
        >
          <AnimatePresence mode="popLayout">
            <div className="space-y-4 md:space-y-6">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: message.role === 'user' ? 100 : -100 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    mass: 1,
                    delay: index * 0.15,
                    scale: { type: "spring", stiffness: 500, damping: 30 }
                  }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
                >
                  {/* AI Avatar */}
                  {message.role === 'assistant' && (
                    <motion.div 
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="hidden sm:flex flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 items-center justify-center shadow-lg shadow-purple-500/25"
                    >
                      <Bot className="w-5 h-5 text-white" />
                    </motion.div>
                  )}

                  {/* Message Bubble */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className={`max-w-[90%] md:max-w-[75%] rounded-2xl p-3 md:p-5 shadow-lg relative overflow-hidden ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-br from-purple-600 to-violet-700 text-white rounded-br-none shadow-lg shadow-purple-500/25' 
                        : 'bg-gradient-to-br from-slate-800 to-slate-900 text-purple-100 border border-purple-500/20 rounded-bl-none shadow-lg shadow-purple-500/10'
                    }`}
                  >
                    {/* Decorative elements */}
                    {message.role === 'user' && (
                      <motion.div
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                          scale: { duration: 3, repeat: Infinity }
                        }}
                        className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 opacity-30 shadow-lg shadow-pink-500/30"
                      />
                    )}

                    {/* Message content */}
                    <div className="relative z-10">
                      <div className={`prose prose-invert max-w-none text-sm md:text-base leading-relaxed ${message.role === 'assistant' ? 'font-serif text-purple-50' : 'font-sans text-purple-50'}`}>
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                      
                      {/* Timestamp and actions */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-purple-500/20">
                        <span className="text-xs text-purple-400">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleCopyMessage(message.content)}
                          className="p-1 rounded-md hover:bg-purple-900/50 transition-colors"
                          title="Copy message"
                        >
                          <Copy size={14} className="text-purple-400" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Message indicator */}
                    <div className={`absolute bottom-2 right-3 text-xs opacity-60 ${
                      message.role === 'user' ? 'text-purple-200' : 'text-purple-300'
                    }`}>
                      {message.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                    </div>
                  </motion.div>

                  {/* User Avatar */}
                  {message.role === 'user' && (
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="hidden sm:flex flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 items-center justify-center shadow-lg shadow-violet-500/25"
                    >
                      <User className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start gap-3"
                >
                    <div className="hidden sm:flex flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 items-center justify-center shadow-lg shadow-purple-500/25">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="rounded-2xl rounded-bl-none p-3 md:p-5 bg-gradient-to-br from-slate-800 to-slate-900 text-purple-100 border border-purple-500/20 shadow-lg shadow-purple-500/10">
                    <div className="flex items-center gap-2 text-purple-300">
                      <div className="typing-indicator">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </AnimatePresence>
        </motion.div>

        {/* Input Form */}
        <motion.form 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          onSubmit={sendMessage}
          className="glass-effect rounded-2xl p-3 md:p-4 shadow-2xl border border-purple-500/20 bg-slate-900/60 backdrop-blur-xl shadow-purple-500/10"
        >
          <div className="flex gap-3">
            <motion.div 
              whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(148, 163, 184, 0.5)" }}
              className="flex-1 relative"
            >
              <textarea
                ref={inputRef as any}
                className="w-full outline-none bg-transparent px-3 md:px-4 py-2 md:py-4 text-purple-50 placeholder-purple-400 text-sm md:text-base rounded-xl border border-purple-500/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all resize-none"
                value={input}
                placeholder="Ask Lumi anything about your studies..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(e as any);
                  }
                }}
                disabled={isLoading}
                rows={1}
                style={{ minHeight: '40px', maxHeight: '120px' }}
              />
              
              {/* Character count */}
              {input.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -bottom-6 left-0 text-xs text-purple-400"
                >
                  {input.length}/2000
                </motion.div>
              )}
            </motion.div>
            
            <motion.button
              type="submit"
              disabled={isLoading || !input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 md:px-6 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2 shadow-purple-500/25"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={18} />
                </motion.div>
              ) : (
                <>
                  <Send size={18} />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </motion.button>
          </div>
          
          {/* Tips */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center"
          >
            <p className="text-xs text-purple-400">
              💡 Pro tip: Press <kbd className="px-1 md:px-2 py-1 bg-purple-900/60 rounded text-xs">Enter</kbd> to send, <kbd className="px-1 md:px-2 py-1 bg-purple-900/60 rounded text-xs">Shift</kbd> + <kbd className="px-1 md:px-2 py-1 bg-purple-900/60 rounded text-xs">Enter</kbd> for new line
            </p>
          </motion.div>
        </motion.form>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-purple-400 pb-3 md:pb-4"
        >
          <p>
            Lumi AI • Powered by Gemini • {new Date().getFullYear()} • 
            <span className="mx-2">✨</span>
            Your intelligent learning companion
          </p>
        </motion.footer>
      </div>
    </div>
  );
}