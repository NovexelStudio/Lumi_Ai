'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Copy, Check, Cpu, Command, LayoutGrid, RefreshCw,
  Sparkles, Zap, Brain, ChevronLeft, ChevronRight, MoreVertical,
  Settings, User, LogOut, Plus, Trash2
} from 'lucide-react';

import { useAuth } from '@/lib/authContext';
import { 
  saveMessage, loadMessages, createChat, deleteChat, 
  getUserChats, initializeUser 
} from '@/lib/databaseService';

import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatHeader } from '@/components/ChatHeader';

// ────────────────────────────────────────────────
// ENHANCED UI COMPONENTS
// ────────────────────────────────────────────────

const NeuralBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505]">
    {/* Animated Grid with Gradient */}
    <motion.div 
      initial={{ backgroundPosition: "0 0" }}
      animate={{ backgroundPosition: ["0px 0px", "60px 60px"] }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 opacity-[0.15]"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(168,85,247,0.1) 1px, transparent 1px), 
                          linear-gradient(to bottom, rgba(168,85,247,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }}
    />
    
    {/* Animated Particles */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-[1px] h-[1px] bg-cyan-500/40 rounded-full"
        initial={{
          x: Math.random() * 100 + 'vw',
          y: Math.random() * 100 + 'vh',
        }}
        animate={{
          x: [null, Math.random() * 100 + 'vw'],
          y: [null, Math.random() * 100 + 'vh'],
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{
          duration: Math.random() * 10 + 10,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    ))}
    
    {/* Gradient Orbs */}
    <motion.div 
      animate={{ 
        scale: [1, 1.2, 1],
        opacity: [0.08, 0.15, 0.08],
        x: [0, 40, 0],
        y: [0, -20, 0]
      }}
      transition={{ duration: 18, repeat: Infinity }}
      className="absolute top-[-15%] left-[15%] w-[50%] h-[50%] bg-gradient-to-br from-fuchsia-600/30 via-transparent to-transparent rounded-full blur-[180px]" 
    />
    <motion.div 
      animate={{ 
        scale: [1.2, 1, 1.2],
        opacity: [0.05, 0.12, 0.05],
        x: [0, -40, 0],
        y: [0, 20, 0]
      }}
      transition={{ duration: 22, repeat: Infinity }}
      className="absolute bottom-[-15%] right-[15%] w-[50%] h-[50%] bg-gradient-to-tl from-cyan-600/20 via-transparent to-transparent rounded-full blur-[180px]" 
    />
  </div>
);

const MarkdownRenderer = ({ content }: { content: string }) => (
  <ReactMarkdown
    components={{
      code({ node, inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <div className="my-8 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0c0c0c] to-[#080808] shadow-2xl shadow-black/50">
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-white/[0.03] to-transparent border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/60" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                  <div className="w-2 h-2 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">{match[1]}</span>
              </div>
              <button className="text-slate-500 hover:text-slate-300 transition-colors">
                <Copy size={14} />
              </button>
            </div>
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              customStyle={{ 
                margin: 0, 
                padding: '1.75rem', 
                background: 'transparent', 
                fontSize: '0.875rem',
                lineHeight: '1.6'
              }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        ) : (
          <code className="relative bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/5 text-fuchsia-300 px-2 py-1 rounded-lg font-mono text-sm border border-white/10 shadow-inner">
            {children}
          </code>
        );
      },
      p: ({ children }) => <p className="mb-5 leading-[1.85] text-slate-300/95 font-medium tracking-wide">{children}</p>,
      h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4 mt-6 tracking-tight">{children}</h1>,
      h2: ({ children }) => <h2 className="text-xl font-bold text-white mb-3 mt-5 tracking-tight">{children}</h2>,
      h3: ({ children }) => <h3 className="text-lg font-bold text-white mb-2 mt-4 tracking-tight">{children}</h3>,
      ul: ({ children }) => <ul className="mb-5 pl-5 space-y-2">{children}</ul>,
      li: ({ children }) => <li className="text-slate-300/90 flex items-start">
        <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500/60 mt-2 mr-3 flex-shrink-0" />
        {children}
      </li>,
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-fuchsia-500/40 pl-5 py-2 my-6 bg-gradient-to-r from-white/[0.02] to-transparent italic text-slate-400">
          {children}
        </blockquote>
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);

// ────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ────────────────────────────────────────────────

export default function ChatPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini');
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [inputHeight, setInputHeight] = useState(56);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, streamingContent, scrollToBottom]);

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth');
    if (user) {
      initializeUser(user.uid);
      getUserChats(user.uid).then(setChats);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && currentChatId) {
      loadMessages(user.uid, currentChatId).then(setMessages);
    }
  }, [currentChatId, user]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !user) return;
    
    const userMessage = { 
      id: Date.now(), 
      role: 'user', 
      content: input, 
      timestamp: Date.now() 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setInputHeight(56); // Reset input height

    try {
      let chatId = currentChatId;
      if (!chatId) {
        chatId = await createChat(user.uid);
        setCurrentChatId(chatId);
      }
      await saveMessage(user.uid, chatId, userMessage);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: input, 
          model: selectedModel, 
          history: messages 
        }),
      });

      const data = await response.json();
      const assistantContent = data.content;
      
      const assistantMessage = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: assistantContent, 
        timestamp: Date.now() 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      await saveMessage(user.uid, chatId, assistantMessage);
      getUserChats(user.uid).then(setChats);
    } catch (err) { 
      console.error('Error sending message:', err); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    const newHeight = Math.min(e.target.scrollHeight, 200);
    e.target.style.height = `${newHeight}px`;
    setInputHeight(newHeight);
  };

  if (authLoading || !user) return (
    <div className="h-screen bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505] flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 rounded-full border-2 border-fuchsia-500/20 border-t-fuchsia-500"
      />
    </div>
  );

  return (
    <div className="relative h-screen flex overflow-hidden bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505] text-slate-200">
      <NeuralBackground />

      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onNewChat={async () => { 
          setCurrentChatId(null); 
          setMessages([]); 
        }}
        onDeleteChat={async (id) => { 
          await deleteChat(user.uid, id); 
          getUserChats(user.uid).then(setChats); 
        }}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />

      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Floating Header */}
        <div className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-b from-black/80 via-black/60 to-transparent border-b border-white/10">
          <div className="flex items-center justify-between px-6 md:px-10 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all hover:scale-105"
              >
                {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                <span className="text-sm font-bold tracking-wider text-slate-300">
                  Lumi v4.2.1
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="appearance-none bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm font-medium tracking-wide text-slate-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 focus:border-fuchsia-500/50"
                >
                  <option value="gemini" className="bg-[#0a0a0a]">Gemini Pro</option>
                  <option value="gpt4" className="bg-[#0a0a0a]">GPT-4 Turbo</option>
                  <option value="claude" className="bg-[#0a0a0a]">Claude 3</option>
                </select>
                <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 text-fuchsia-500/60" size={16} />
              </div>

              <button
                onClick={logout}
                className="p-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all hover:scale-105 group"
              >
                <LogOut size={20} className="text-slate-400 group-hover:text-red-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-12 py-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto pb-32">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                <EmptyState />
              ) : (
                messages.map((msg) => (
                  <MessageBubble 
                    key={msg.id} 
                    msg={msg} 
                    isUser={msg.role === 'user'} 
                    onCopy={() => {
                      navigator.clipboard.writeText(msg.content);
                      setCopiedId(msg.id);
                      setTimeout(() => setCopiedId(null), 1500);
                    }}
                    isCopied={copiedId === msg.id}
                  />
                ))
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Section */}
        <div className="fixed bottom-0 inset-x-0 z-40 p-6 md:p-8 bg-gradient-to-t from-black via-black/95 to-transparent">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={false}
              animate={{ 
                boxShadow: isLoading 
                  ? "0 0 60px rgba(217,70,239,0.15), 0 0 30px rgba(6,182,212,0.1)" 
                  : "0 0 20px rgba(0,0,0,0.3)" 
              }}
              className="relative group"
            >
              {/* Loading Animation Border */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ 
                      opacity: [0.2, 0.4, 0.2],
                      scale: [1, 1.02, 1],
                      rotate: [0, 180, 360]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute -inset-[2px] bg-gradient-to-r from-fuchsia-600 via-cyan-500 to-fuchsia-600 rounded-3xl blur-md z-0"
                  />
                )}
              </AnimatePresence>

              <div className={`
                relative z-10 rounded-3xl p-2 flex items-end border transition-all duration-500
                ${isLoading 
                  ? 'border-fuchsia-500/40 bg-gradient-to-r from-[#0a0a0a] to-[#0c0c0c] shadow-2xl shadow-fuchsia-500/10' 
                  : 'border-white/10 bg-gradient-to-r from-[#0a0a0a] to-[#080808] hover:border-white/20'}
              `}>
                {/* Input Actions */}
                <div className="flex items-center gap-2 pl-4 pb-3">
                  <button className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-all hover:scale-110">
                    <Brain size={18} className="text-fuchsia-500/60" />
                  </button>
                  <button className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-all hover:scale-110">
                    <Sparkles size={18} className="text-cyan-500/60" />
                  </button>
                </div>

                {/* Text Area */}
                <textarea
                  ref={inputRef}
                  value={input}
                  disabled={isLoading}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={isLoading ? "Processing neural patterns..." : "Enter your query... (Shift + Enter for new line)"}
                  rows={1}
                  style={{ height: `${inputHeight}px` }}
                  className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-white placeholder-slate-500 text-[15px] leading-relaxed resize-none font-medium tracking-wide custom-scrollbar"
                />

                {/* Send Button */}
                <div className="pr-2 pb-2">
                  <motion.button 
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      relative overflow-hidden p-4 rounded-2xl transition-all duration-500 
                      ${input.trim() && !isLoading
                        ? 'bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white shadow-xl shadow-fuchsia-500/30'
                        : 'bg-white/[0.03] text-slate-600 border border-white/10'
                      }
                    `}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <RefreshCw size={18} />
                      </motion.div>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                        <Send size={18} className="relative z-10" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Bottom Status Bar */}
              <div className="flex justify-between items-center mt-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ 
                        scale: isLoading ? [1, 1.2, 1] : 1,
                        opacity: isLoading ? [0.6, 1, 0.6] : 1
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className={`w-2 h-2 rounded-full ${isLoading ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-500' : 'bg-emerald-500'}`}
                    />
                    <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                      {isLoading ? 'SYNCING NEURAL NETWORK' : 'SYSTEM READY'}
                    </span>
                  </div>
                  
                  <span className="text-[10px] text-slate-600 font-medium">
                    {messages.length} messages
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <button className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium">
                    Clear Context
                  </button>
                  <button className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium">
                    Export Chat
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MessageBubble({ msg, isUser, onCopy, isCopied }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-8 group`}
    >
      {/* Header */}
      <div className={`flex items-center gap-3 mb-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-gradient-to-br from-cyan-500 to-cyan-600' : 'bg-gradient-to-br from-fuchsia-500 to-purple-600'}`}>
          {isUser ? (
            <User size={16} className="text-white" />
          ) : (
            <Cpu size={16} className="text-white" />
          )}
        </div>
        <div className="flex flex-col">
          <span className={`text-sm font-bold tracking-wide ${isUser ? 'text-cyan-400' : 'text-fuchsia-400'}`}>
            {isUser ? 'You' : 'Lumi AI'}
          </span>
          <span className="text-xs text-slate-500">
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Message Content */}
      <div className={`relative ${isUser ? 'max-w-[85%]' : 'max-w-[90%]'}`}>
        <div className={`
          relative px-6 py-5 rounded-3xl transition-all duration-500 backdrop-blur-sm
          ${isUser 
            ? 'bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 shadow-xl shadow-cyan-500/5' 
            : 'bg-gradient-to-r from-white/[0.03] to-white/[0.01] border border-white/10 shadow-2xl shadow-black/30'
          }
        `}>
          <div className="text-[15px] leading-relaxed tracking-wide">
            <MarkdownRenderer content={msg.content} />
          </div>
        </div>

        {/* Action Buttons */}
        {!isUser && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute -left-12 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <button
              onClick={onCopy}
              className="p-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all hover:scale-110"
            >
              {isCopied ? (
                <Check size={14} className="text-emerald-500" />
              ) : (
                <Copy size={14} className="text-slate-400" />
              )}
            </button>
            <button className="p-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all hover:scale-110">
              <Sparkles size={14} className="text-fuchsia-400" />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function EmptyState() {
  const suggestions = [
    "Explain quantum computing in simple terms",
    "Write a Python script for data analysis",
    "Help me plan a workout routine",
    "Generate creative ideas for a blog post"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
    >
      {/* Animated Logo */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative mb-8"
      >
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-fuchsia-500/20 via-transparent to-cyan-500/20 border border-white/10 flex items-center justify-center shadow-2xl shadow-fuchsia-500/10">
          <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-fuchsia-500/30 to-cyan-500/30 blur-xl" />
          <Cpu size={40} className="relative z-10 text-white" />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 rounded-3xl border border-fuchsia-500/30 border-t-transparent"
        />
      </motion.div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3 bg-gradient-to-r from-white via-white to-fuchsia-200 bg-clip-text text-transparent">
        Lumi Neural Interface
      </h1>
      <p className="text-slate-400 text-sm font-medium tracking-wide mb-8 max-w-md">
        Advanced AI assistant ready to process your queries with enhanced neural capabilities
      </p>

      {/* Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full mb-10">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 text-left group hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10">
                <Zap size={16} className="text-fuchsia-400" />
              </div>
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                {suggestion}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium">System Online</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={12} className="text-fuchsia-500" />
          <span className="font-medium">v4.2.1</span>
        </div>
        <div className="flex items-center gap-2">
          <Cpu size={12} className="text-cyan-500" />
          <span className="font-medium">Neural AI</span>
        </div>
      </div>
    </motion.div>
  );
}