'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
// 1. Import Syntax Highlighter components
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User,
  Trash2,
  Copy,
  Check,
  Zap,
  Globe
} from 'lucide-react';

// --- Components ---

const VantaBackground = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffectRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && vantaRef.current && !vantaEffectRef.current) {
      const initVanta = () => {
        if ((window as any).VANTA && (window as any).THREE) {
          try {
            vantaEffectRef.current = (window as any).VANTA.BIRDS({
              el: vantaRef.current,
              THREE: (window as any).THREE,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.0,
              minWidth: 200.0,
              scale: 1.0,
              scaleMobile: 1.0,
              birdSize: 1.5,
              quantity: 5,
              backgroundColor: 0x0f172a
            });
          } catch (error) {
            console.error('Failed to initialize Vanta Birds:', error);
          }
        } else {
          // Retry after a short delay if libraries aren't loaded yet
          setTimeout(initVanta, 100);
        }
      };
      
      initVanta();
    }

    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []);

  return <div ref={vantaRef} className="fixed inset-0 -z-10" />;
};

const ModelIcon = ({ model }: { model: string }) => {
  if (model === 'gemini') return <Sparkles className="w-4 h-4 text-purple-400" />;
  if (model === 'groq') return <Zap className="w-4 h-4 text-orange-400" />;
  return <Globe className="w-4 h-4 text-blue-400" />;
};

export default function ChatPage() {
  // --- State ---
  const [messages, setMessages] = useState<{ role: string; content: string; id: number; timestamp: Date }[]>([
    { 
      id: 1, 
      role: 'assistant', 
      content: "👋 **Hello! I'm Lumi.**\n\nI can help you write code, analyze text, or just chat. Try asking me for a Python script or HTML example!",
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageCount = useRef(2);

  // --- Effects ---
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

  // --- Handlers ---
  const handleClearChat = () => {
    setMessages([
      { 
        id: messageCount.current++, 
        role: 'assistant', 
        content: "🧹 **Chat cleared.**\n\nReady for a fresh start!",
        timestamp: new Date()
      }
    ]);
  };

  const handleCopy = async (content: string, id: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  async function sendMessage(e?: React.FormEvent) {
    if (e) e.preventDefault();
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

    if (inputRef.current) inputRef.current.style.height = 'auto';

    try {
      const requestBody = {
        messages: messages.concat(userMessage).map(({ role, content }) => ({ role, content })),
        model: selectedModel
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch');
      if (!data.content) throw new Error('No content received');

      setMessages(prev => [...prev, { 
        id: messageCount.current++, 
        role: 'assistant', 
        content: data.content,
        timestamp: new Date()
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        id: messageCount.current++, 
        role: 'assistant', 
        content: `❌ **Error:** ${error?.message || 'Something went wrong.'}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  if (!mounted) return null;

  return (
    <div className="relative flex flex-col h-screen overflow-hidden text-sm md:text-base font-sans selection:bg-purple-500/30">
      <VantaBackground />

      {/* --- Header --- */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-shrink-0 h-14 sm:h-16 md:h-20 flex items-center justify-between px-3 sm:px-4 md:px-8 border-b border-purple-500/20 bg-gradient-to-r from-slate-900/80 via-purple-950/40 to-slate-900/80 backdrop-blur-xl z-50 hover:border-purple-500/40 transition-colors duration-300"
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative group flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-40 group-hover:opacity-80 transition-opacity duration-500" />
            <motion.div 
              className="relative w-8 sm:w-9 md:w-10 h-8 sm:h-9 md:h-10 bg-slate-900 rounded-xl border border-purple-500/40 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              animate={{ boxShadow: ['0 0 20px rgba(168, 85, 247, 0.3)', '0 0 30px rgba(168, 85, 247, 0.6)', '0 0 20px rgba(168, 85, 247, 0.3)'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                <Sparkles className="w-4 sm:w-4.5 md:w-5 h-4 sm:h-4.5 md:h-5 text-purple-400" />
              </motion.div>
            </motion.div>
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-base sm:text-lg md:text-xl tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent truncate">
              Lumi AI
            </h1>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="relative flex h-1.5 sm:h-2 w-1.5 sm:w-2 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 sm:h-2 w-1.5 sm:w-2 bg-green-500"></span>
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-medium text-slate-400 whitespace-nowrap">Online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearChat}
            className="p-2 sm:p-2.5 rounded-lg text-slate-400 hover:text-white transition-colors touch-manipulation"
            title="Clear Chat"
          >
            <Trash2 className="w-5 h-5 sm:w-5 sm:h-5" />
          </motion.button>
        </div>
      </motion.header>

      {/* --- Chat Area --- */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 sm:p-4 md:p-6 scroll-smooth">
        <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto space-y-4 sm:space-y-5 md:space-y-6 pb-4">
          <AnimatePresence mode="popLayout">
            {messages.map((m, idx) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20, scale: 0.95, x: m.role === 'user' ? 50 : -50 }}
                animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85, x: m.role === 'user' ? 100 : -100 }}
                transition={{ type: "spring", stiffness: 400, damping: 30, delay: idx === 0 ? 0.3 : idx * 0.05 }}
                className={`flex gap-2 sm:gap-3 md:gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                whileHover={{ scale: 1.01 }}
              >
                {/* Avatar */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, delay: idx === 0 ? 0.2 : 0 }}
                  className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-xl border border-white/20 ${
                  m.role === 'assistant' 
                    ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500' 
                    : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                }`}
                  whileHover={{ scale: 1.15, boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)' }}>
                  {m.role === 'assistant' ? (
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                      <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                    </motion.div>
                  ) : (
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                  )}
                </motion.div>

                {/* Message Bubble */}
                <motion.div 
                  className={`relative group max-w-[90%] sm:max-w-[85%] md:max-w-[75%]`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx === 0 ? 0.4 : 0.1 }}
                >
                  {idx === 0 && m.role === 'assistant' && (
                    <>
                      <motion.div 
                        className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-lg blur-lg"
                        animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </>
                  )}
                  <div className={`relative px-0 py-1 rounded-lg transition-all duration-300 hover:bg-white/5 ${
                    m.role === 'user'
                      ? 'text-white'
                      : 'text-slate-200'
                  }`}>
                    {/* 2. Custom Renderers for Code Blocks */}
                    <div className={`prose prose-invert prose-xs sm:prose-sm md:prose-base max-w-none leading-relaxed text-xs sm:text-sm md:text-base ${idx === 0 && m.role === 'assistant' ? 'relative z-10' : ''}`}>
                      <ReactMarkdown
                        components={{
                          code({node, inline, className, children, ...props}: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <div className="relative rounded-lg overflow-hidden my-4 shadow-lg border border-white/10">
                                {/* Optional: Code Header */}
                                <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-slate-950/50 border-b border-white/5 gap-2">
                                  <span className="text-[10px] sm:text-xs text-slate-400 font-mono lowercase truncate">{match[1]}</span>
                                  <button 
                                    onClick={() => handleCopy(String(children), m.id)}
                                    className="text-[10px] sm:text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 flex-shrink-0 touch-manipulation"
                                  >
                                    {copiedId === m.id ? <Check size={12} /> : <Copy size={12} />}
                                    <span className="hidden sm:inline">{copiedId === m.id ? "Copied" : "Copy"}</span>
                                  </button>
                                </div>
                                <SyntaxHighlighter
                                  style={dracula}
                                  language={match[1]}
                                  PreTag="div"
                                  customStyle={{ margin: 0, padding: '1.5rem', background: 'rgba(15, 23, 42, 0.5)' }}
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              </div>
                            ) : (
                              <code className={`${className} bg-slate-700/50 px-1.5 py-0.5 rounded text-pink-300 font-mono text-xs sm:text-sm`} {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>

                  <motion.div 
                    className={`flex items-center gap-1 sm:gap-2 mt-1 sm:mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity px-1 text-[9px] sm:text-[10px] ${
                    m.role === 'user' ? 'justify-end flex-row-reverse' : 'justify-start'
                  }`}
                    initial={{ y: 5, opacity: 0 }}
                    whileHover={{ y: 0 }}
                  >
                    <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium">
                      {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="flex gap-4"
            >
              <motion.div 
                className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl flex-shrink-0"
                animate={{ scale: [1, 1.1, 1], boxShadow: ['0 0 10px rgba(168, 85, 247, 0.3)', '0 0 25px rgba(168, 85, 247, 0.6)', '0 0 10px rgba(168, 85, 247, 0.3)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                </motion.div>
              </motion.div>
              <div className="flex gap-2 sm:gap-4 items-center min-w-0">
                <div className="flex gap-1.5 flex-shrink-0">
                  <motion.div className="typing-dot" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity }} />
                  <motion.div className="typing-dot" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                  <motion.div className="typing-dot" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text uppercase tracking-widest truncate">Generating...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* --- Input Area --- */}
      <div className="flex-shrink-0 p-3 sm:p-4 md:p-6 z-40 bg-slate-950/40 border-t border-purple-500/10">
        <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto">
          <motion.div 
            className="relative overflow-hidden transition-all duration-300 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-950/80 border border-purple-500/20 shadow-2xl focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:border-purple-500/40 hover:border-purple-500/30"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.01 }}
          >
            {/* Toolbar */}
            <motion.div 
              className="flex items-center justify-center px-2 sm:px-4 pt-3 sm:pt-4 pb-2 sm:pb-3 overflow-x-auto scrollbar-hide"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                {[
                  { value: 'gemini', label: '🚀 Gemini', color: 'from-purple-600 to-blue-600' },
                  { value: 'groq', label: '⚡ Groq', color: 'from-orange-500 to-red-600' },
                  { value: 'openrouter', label: '🤖 Router', color: 'from-blue-600 to-cyan-600' }
                ].map((model) => (
                  <motion.button
                    key={model.value}
                    onClick={() => setSelectedModel(model.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all duration-300 touch-manipulation whitespace-nowrap ${
                      selectedModel === model.value
                        ? `bg-gradient-to-r ${model.color} text-white shadow-lg shadow-purple-500/50 border border-white/20`
                        : 'bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:border-slate-600 hover:bg-slate-800/80'
                    }`}
                  >
                    {model.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Textarea */}
            <motion.div 
              className="flex items-end gap-1.5 sm:gap-2 p-2 sm:p-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.textarea
                ref={inputRef as any}
                value={input}
                onChange={handleInputResize}
                onKeyDown={handleKeyDown}
                placeholder="Ask Lumi anything..."
                disabled={isLoading}
                rows={1}
                className="flex-1 max-h-[200px] bg-gradient-to-br from-slate-800/40 to-slate-900/40 text-slate-200 placeholder-slate-500/60 px-3 py-2 sm:py-3 focus:outline-none focus:bg-slate-800/60 resize-none scrollbar-hide text-sm sm:text-base rounded-lg border border-transparent focus:border-purple-500/30 transition-all duration-300"
                whileFocus={{ scale: 1.01 }}
              />
              
              <motion.button
                onClick={(e) => sendMessage(e)}
                disabled={!input.trim() || isLoading}
                whileHover={input.trim() && !isLoading ? { scale: 1.1, boxShadow: '0 0 20px rgba(168, 85, 247, 0.8)' } : {}}
                whileTap={{ scale: 0.9 }}
                className={`p-2 sm:p-3 rounded-xl mb-0 sm:mb-0.5 flex items-center justify-center transition-all duration-300 font-semibold flex-shrink-0 touch-manipulation ${
                  input.trim() && !isLoading 
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white shadow-xl shadow-purple-900/40 border border-purple-400/50' 
                    : 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-700/30'
                }`}
              >
                {isLoading ? (
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </motion.button>
            </motion.div>
          </motion.div>
          
          <div className="text-center mt-2 sm:mt-3">
            <p className="text-[9px] sm:text-[10px] text-slate-500 px-2">
              Lumi AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}