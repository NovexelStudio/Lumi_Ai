'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Copy, Check, Cpu, Command, LayoutGrid, RefreshCw 
} from 'lucide-react';

import { useAuth } from '@/lib/authContext';
import { 
  saveMessage, loadMessages, createChat, deleteChat, 
  getUserChats, initializeUser 
} from '@/lib/databaseService';

import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatHeader } from '@/components/ChatHeader';

// ────────────────────────────────────────────────
// UI SUB-COMPONENTS
// ────────────────────────────────────────────────

const NeuralBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020202]">
    {/* Animated Grid */}
    <motion.div 
      initial={{ backgroundPosition: "0 0" }}
      animate={{ backgroundPosition: ["0px 0px", "45px 45px"] }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 opacity-[0.12]"
      style={{
        backgroundImage: `linear-gradient(to right, #ffffff10 1px, transparent 1px), 
                          linear-gradient(to bottom, #ffffff10 1px, transparent 1px)`,
        backgroundSize: '45px 45px'
      }}
    />
    {/* Drifting Orbs */}
    <motion.div 
      animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1], x: [0, 30, 0] }}
      transition={{ duration: 15, repeat: Infinity }}
      className="absolute top-[-10%] left-[10%] w-[60%] h-[50%] bg-fuchsia-600/20 rounded-full blur-[120px]" 
    />
    <motion.div 
      animate={{ scale: [1.1, 1, 1.1], opacity: [0.05, 0.15, 0.05], x: [0, -30, 0] }}
      transition={{ duration: 20, repeat: Infinity }}
      className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px]" 
    />
  </div>
);

const MarkdownRenderer = ({ content }: { content: string }) => (
  <ReactMarkdown
    components={{
      code({ node, inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <div className="my-6 rounded-3xl overflow-hidden border border-white/5 bg-[#080808] shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3 bg-white/[0.03] border-b border-white/5">
              <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">{match[1]}</span>
            </div>
            <SyntaxHighlighter
              style={oneDark}
              language={match[1]}
              PreTag="div"
              customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent', fontSize: '0.85rem' }}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        ) : (
          <code className="bg-fuchsia-500/10 text-fuchsia-300 px-1.5 py-0.5 rounded font-mono text-sm border border-fuchsia-500/20">
            {children}
          </code>
        );
      },
      p: ({ children }) => <p className="mb-4 leading-[1.8] text-slate-300/90 font-medium">{children}</p>,
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
    const userMessage = { id: Date.now(), role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

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
        body: JSON.stringify({ message: input, model: selectedModel, history: messages }),
      });

      const data = await response.json();
      const assistantContent = data.content;
      
      const assistantMessage = { id: Date.now() + 1, role: 'assistant', content: assistantContent, timestamp: Date.now() };
      setMessages(prev => [...prev, assistantMessage]);
      await saveMessage(user.uid, chatId, assistantMessage);
      getUserChats(user.uid).then(setChats);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setIsLoading(false); 
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="relative h-screen flex overflow-hidden bg-[#020202] text-slate-200">
      <NeuralBackground />

      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={setCurrentChatId}
        onNewChat={async () => { setCurrentChatId(null); setMessages([]); }}
        onDeleteChat={async (id) => { 
          await deleteChat(user.uid, id); 
          getUserChats(user.uid).then(setChats); 
        }}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />

      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        <ChatHeader 
          selectedModel={selectedModel} 
          onModelChange={setSelectedModel} 
          onLogout={logout}
          onClearChat={() => { setMessages([]); setCurrentChatId(null); }}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-10 custom-scrollbar">
          <div className="max-w-3xl mx-auto pb-48">
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

        {/* INPUT SECTION WITH REACTIVE GLOW */}
        <div className="absolute bottom-0 inset-x-0 p-6 md:p-10 bg-gradient-to-t from-[#020202] via-[#020202]/90 to-transparent">
          <div className="max-w-3xl mx-auto">
            <div className="relative group">
              {/* Outer Glowing Ring during Loading */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.01, 1] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600/30 via-cyan-500/30 to-fuchsia-600/30 rounded-[2.2rem] blur-xl z-0"
                  />
                )}
              </AnimatePresence>

              <div className={`
                relative z-10 glass-card rounded-[2.2rem] p-2 flex items-end border transition-all duration-700
                ${isLoading 
                  ? 'border-fuchsia-500/40 bg-[#0a0a0a]/95 shadow-[0_0_40px_rgba(217,70,239,0.1)]' 
                  : 'border-white/5 bg-[#0a0a0a]/80 focus-within:border-white/20'}
              `}>
                <button className="p-4 mb-0.5 text-slate-500 hover:text-fuchsia-400 transition-colors">
                  <LayoutGrid size={18} />
                </button>

                <textarea
                  ref={inputRef}
                  value={input}
                  disabled={isLoading}
                  onChange={e => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={isLoading ? "LUMI is processing..." : "Initiate neural link..."}
                  rows={1}
                  className="flex-1 bg-transparent border-none outline-none px-2 py-4 text-white placeholder-slate-600 text-[15px] leading-relaxed resize-none font-medium custom-scrollbar"
                />

                <div className="flex items-center gap-2 pr-2 pb-1.5">
                  <button 
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    className={`relative overflow-hidden p-4 rounded-2xl transition-all duration-500 ${input.trim() ? 'bg-white text-black shadow-xl' : 'bg-white/5 text-slate-700 opacity-40'}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-600 to-cyan-500 opacity-0 hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 flex items-center justify-center">
                      {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
                    </div>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4 px-6">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-fuchsia-500 animate-pulse shadow-[0_0_8px_#d946ef]' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`} />
                  <span className="text-[9px] font-black tracking-widest uppercase text-slate-500">
                    {isLoading ? 'Neural_Syncing...' : 'System_Ready'}
                  </span>
                </div>
                <span className="text-[9px] font-black tracking-widest uppercase text-slate-700 italic">Lumi_v4.0.2</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MessageBubble({ msg, isUser, onCopy, isCopied }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-10 group`}>
      <span className={`text-[10px] font-black tracking-widest uppercase mb-2 ${isUser ? 'text-cyan-500/60' : 'text-slate-500'}`}>
        {isUser ? 'User_Signature' : 'Lumi_Response'}
      </span>
      <div className={`relative px-6 py-5 rounded-[2rem] border transition-all duration-500 ${isUser ? 'bg-white/[0.03] border-white/10' : 'bg-[#080808] border-white/5 shadow-2xl'}`}>
        <div className="text-[15px] leading-relaxed text-slate-200">
          <MarkdownRenderer content={msg.content} />
        </div>
        {!isUser && (
          <button onClick={onCopy} className="absolute top-4 -right-10 opacity-0 group-hover:opacity-100 transition-all text-slate-600 hover:text-white">
            {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        )}
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-[50vh] text-center">
      <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/10 flex items-center justify-center mb-6">
        <Cpu size={32} className="text-fuchsia-500" />
      </div>
      <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">Neural Link Established</h2>
      <p className="text-slate-500 text-[10px] font-bold tracking-[0.3em] uppercase mt-2">Awaiting Directives</p>
    </motion.div>
  );
}