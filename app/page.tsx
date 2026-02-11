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
  Settings, User, LogOut, Plus, Trash2, Settings2, Bot, Stars,
  Globe, Code, Palette, MessageSquare, FileText, Rocket,
  Shield, Lock, Zap as Lightning, Wand2, Grid3X3, CheckCircle
} from 'lucide-react';

import { useAuth } from '@/lib/authContext';
import { 
  saveMessage, loadMessages, createChat, deleteChat, 
  getUserChats, initializeUser 
} from '@/lib/databaseService';
import { ChatSidebar } from '@/components/ChatSidebar';

// ────────────────────────────────────────────────
// AGENT SELECTION COMPONENTS
// ────────────────────────────────────────────────

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  capabilities: string[];
  strength: string;
  temperature: number;
  version: string;
  isActive: boolean;
}

const AGENTS: Agent[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'OpenAI\'s advanced reasoning engine with multimodal capabilities',
    icon: <Sparkles />,
    color: 'from-green-500 to-emerald-500',
    capabilities: ['Advanced Reasoning', 'Code Analysis', 'Deep Thinking', 'Research'],
    strength: 'Analytical',
    temperature: 0.7,
    version: '4.0',
    isActive: true
  },
  {
    id: 'gemini',
    name: 'Gemini',
    description: 'Google\'s advanced multimodal AI with reasoning capabilities',
    icon: <Brain />,
    color: 'from-purple-500 to-pink-500',
    capabilities: ['Reasoning', 'Analysis', 'Creativity', 'Problem Solving'],
    strength: 'Balanced',
    temperature: 0.7,
    version: '2.0',
    isActive: true
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'High-speed LLM inference with optimized performance',
    icon: <Code />,
    color: 'from-cyan-500 to-blue-500',
    capabilities: ['Code Generation', 'Debugging', 'Architecture', 'Optimization'],
    strength: 'Technical',
    temperature: 0.3,
    version: '1.5.2',
    isActive: false
  },
  {
    id: 'router',
    name: 'Router',
    description: 'Intelligent routing and orchestration engine',
    icon: <Palette />,
    color: 'from-fuchsia-500 to-purple-500',
    capabilities: ['Content Creation', 'Storytelling', 'Design Ideas', 'Brand Voice'],
    strength: 'Creative',
    temperature: 0.9,
    version: '1.2.0',
    isActive: false
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Anthropic\'s advanced language model with nuanced understanding',
    icon: <Grid3X3 />,
    color: 'from-emerald-500 to-teal-500',
    capabilities: ['Data Analysis', 'Research', 'Reports', 'Insights'],
    strength: 'Analytical',
    temperature: 0.4,
    version: '3.1',
    isActive: false
  },
  {
    id: 'llama',
    name: 'Llama',
    description: 'Meta\'s open-source language model for research and development',
    icon: <FileText />,
    color: 'from-amber-500 to-orange-500',
    capabilities: ['Research Papers', 'Citations', 'Analysis', 'Summarization'],
    strength: 'Academic',
    temperature: 0.5,
    version: '2.0.3',
    isActive: false
  },
  {
    id: 'mixtral',
    name: 'Mixtral',
    description: 'Mixture of experts model with enhanced security protocols',
    icon: <Shield />,
    color: 'from-red-500 to-rose-500',
    capabilities: ['Security Analysis', 'Privacy', 'Compliance', 'Auditing'],
    strength: 'Security',
    temperature: 0.2,
    version: '1.8.0',
    isActive: false
  }
];

const AgentSelector = ({ 
  selectedAgent, 
  onSelectAgent,
  isExpanded,
  onToggleExpand 
}: { 
  selectedAgent: Agent;
  onSelectAgent: (agent: Agent) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) => {
  return (
    <div className="relative">
      {/* Compact View - Agent Button */}
      {!isExpanded ? (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggleExpand}
          className="
            flex items-center gap-3 px-4 py-3 rounded-2xl 
            bg-white/[0.05] border border-white/10 hover:border-white/30
            transition-all duration-300 group hover:bg-white/[0.08]
          "
        >
          {/* Agent Icon */}
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedAgent.color} flex items-center justify-center flex-shrink-0`}>
            <div className="text-white text-lg">{selectedAgent.icon}</div>
          </div>
          
          {/* Agent Info */}
          <div className="flex-1 text-left min-w-0">
            <div className="text-sm font-bold text-white truncate">
              {selectedAgent.name}
            </div>
            <p className="text-xs text-slate-400 truncate">
              {selectedAgent.strength}
            </p>
          </div>
          
          {/* Chevron */}
          <ChevronRight size={16} className="text-slate-500 group-hover:text-slate-300 flex-shrink-0" />
        </motion.button>
      ) : (
        // Expanded View - Agent Selector Grid
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="
            absolute top-0 left-0 right-0 z-50 rounded-2xl p-4
            bg-[#0a0a0a] border border-white/10 backdrop-blur-xl
            shadow-2xl shadow-black/80 min-w-[500px] max-w-2xl
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white">Select Neural Agent</h3>
              <p className="text-xs text-slate-400 mt-1">
                Choose specialized AI for your task
              </p>
            </div>
            <button
              onClick={onToggleExpand}
              className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
            >
              <ChevronLeft size={18} className="text-slate-400" />
            </button>
          </div>

          {/* Agent Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {AGENTS.map((agent) => (
              <motion.button
                key={agent.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onSelectAgent(agent);
                  onToggleExpand();
                }}
                className={`
                  relative p-4 rounded-xl text-left transition-all
                  ${selectedAgent.id === agent.id
                    ? `bg-gradient-to-br ${agent.color} opacity-20 border-2 border-white/30`
                    : 'bg-white/[0.05] border border-white/10 hover:border-white/20'
                  }
                `}
              >
                {/* Selected Indicator */}
                {selectedAgent.id === agent.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle size={16} className="text-emerald-400" />
                  </div>
                )}

                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center mb-2`}>
                  <div className="text-white text-sm">{agent.icon}</div>
                </div>

                {/* Name */}
                <div className="mb-2">
                  <span className="text-sm font-bold text-white">{agent.name}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-2 mb-2">
                  {agent.description}
                </p>

                {/* Strength */}
                <div className="flex items-center gap-1.5">
                  <Zap size={12} className="text-slate-400" />
                  <span className="text-xs text-slate-400">{agent.strength}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-white/10 pt-4 flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors">
              <Settings2 size={14} className="text-slate-400" />
              <span className="text-xs font-medium text-slate-300">Settings</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors">
              <Wand2 size={14} className="text-fuchsia-400" />
              <span className="text-xs font-medium text-slate-300">Custom</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const AgentStatusIndicator = ({ agent }: { agent: Agent }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/10">
      {/* Temperature Indicator */}
      <div className="flex items-center gap-2">
        <div className="relative w-16 h-2 rounded-full bg-white/[0.1] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${agent.temperature * 100}%` }}
            className={`absolute h-full rounded-full bg-gradient-to-r ${agent.color}`}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[8px] font-bold text-slate-400 mix-blend-overlay">
              {agent.temperature.toFixed(1)}
            </span>
          </div>
        </div>
        <span className="text-xs text-slate-400">Temp</span>
      </div>

      {/* Strength Indicator */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center">
            <Zap size={12} className={`
              ${agent.strength === 'Creative' ? 'text-fuchsia-400' : ''}
              ${agent.strength === 'Technical' ? 'text-cyan-400' : ''}
              ${agent.strength === 'Analytical' ? 'text-emerald-400' : ''}
            `} />
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-1 border border-white/10 rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-300">
            {agent.strength}
          </span>
          <span className="text-[10px] text-slate-500">Focus</span>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────
// UI SUB-COMPONENTS
// ────────────────────────────────────────────────

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
  const [selectedAgent, setSelectedAgent] = useState<Agent>(AGENTS[0]);
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [inputHeight, setInputHeight] = useState(56);
  const [agentSelectorExpanded, setAgentSelectorExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const agentSelectorRef = useRef<HTMLDivElement>(null);

  // Close agent selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (agentSelectorRef.current && !agentSelectorRef.current.contains(event.target as Node)) {
        setAgentSelectorExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      timestamp: Date.now(),
      agent: selectedAgent.id
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setInputHeight(56);

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
          agent: selectedAgent.id,
          model: selectedAgent.id === 'chatgpt' ? 'chatgpt' : 'gemini',
          history: messages 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.content) {
        throw new Error('No response content from API');
      }
      
      const assistantContent = data.content;
      
      const assistantMessage = { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: assistantContent, 
        timestamp: Date.now(),
        agent: selectedAgent.id
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

        if (authLoading) {
        return (
          <div className="h-screen bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505] flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full border-2 border-fuchsia-500/20 border-t-fuchsia-500"
            />
          </div>
        );
      }
      if (!authLoading && !user) {
      // This will trigger the useEffect to redirect
      return (
        <div className="h-screen bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505] flex items-center justify-center">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-slate-400"
          >
            Redirecting to login...
          </motion.div>
        </div>
      );
    }

  return (
    <div className="relative h-screen flex overflow-hidden bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505] text-slate-200">
      {/* Chat Sidebar */}
      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={(chatId) => setCurrentChatId(chatId)}
        onNewChat={() => {
          setMessages([]);
          setCurrentChatId(null);
        }}
        onDeleteChat={(chatId) => {
          if (user) deleteChat(user.uid, chatId);
          if (currentChatId === chatId) setCurrentChatId(null);
          setChats(chats.filter(c => c.id !== chatId));
        }}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        userId={user?.uid}
      />

      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Enhanced Header with Agent Selection */}
        <div className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-b from-black/80 via-black/60 to-transparent border-b border-white/10">
          <div className="flex items-center justify-between px-6 md:px-10 py-4">
            <div className="flex items-center gap-4">
              {/* History Button with Badge - Single Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 border border-fuchsia-500/20 hover:border-fuchsia-500/40 transition-all group"
                title={sidebarOpen ? "Hide History" : "Show History"}
              >
                <MessageSquare size={16} className="text-fuchsia-400 group-hover:text-fuchsia-300 transition-colors" />
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  {sidebarOpen ? 'Hide' : 'History'}
                </span>
                {chats.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-[10px] font-bold text-fuchsia-400">
                    {chats.length}
                  </span>
                )}
              </motion.button>
              
              {/* Agent Selector */}
              <div ref={agentSelectorRef} className="relative">
                <AgentSelector
                  selectedAgent={selectedAgent}
                  onSelectAgent={setSelectedAgent}
                  isExpanded={agentSelectorExpanded}
                  onToggleExpand={() => setAgentSelectorExpanded(!agentSelectorExpanded)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Agent Status Indicator */}
              <AgentStatusIndicator agent={selectedAgent} />

              <button
                onClick={() => router.push('/account')}
                className="p-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all hover:scale-105 group"
                title="Account settings"
              >
                <User size={20} className="text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </button>

              <button
                onClick={logout}
                className="p-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all hover:scale-105 group"
                title="Logout"
              >
                <LogOut size={20} className="text-slate-400 group-hover:text-red-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages with Agent Context */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-12 py-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto pb-32">
            <AnimatePresence mode="popLayout">
              {messages.length === 0 ? (
                <EmptyState selectedAgent={selectedAgent} />
              ) : (
                messages.map((msg) => (
                  <MessageBubble 
                    key={msg.id} 
                    msg={msg} 
                    isUser={msg.role === 'user'} 
                    agent={AGENTS.find(a => a.id === msg.agent) || AGENTS[0]}
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

        {/* Enhanced Input Section with Agent Context */}
        <div className="fixed bottom-0 inset-x-0 z-40 p-6 md:p-8 bg-gradient-to-t from-black via-black/95 to-transparent">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={false}
              animate={{ 
                boxShadow: isLoading 
                  ? `0 0 60px ${selectedAgent.color.split(' ')[0].replace('from-', 'rgba(').replace('-500', ',0.15)')}` 
                  : "0 0 20px rgba(0,0,0,0.3)" 
              }}
              className="relative group"
            >
              {/* Loading Animation with Agent Color */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ 
                      opacity: [0.2, 0.4, 0.2],
                      scale: [1, 1.02, 1],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className={`absolute -inset-[2px] bg-gradient-to-r ${selectedAgent.color} rounded-3xl blur-md z-0`}
                  />
                )}
              </AnimatePresence>

              <div className={`
                relative z-10 rounded-3xl p-2 flex items-end border transition-all duration-500
                ${isLoading 
                  ? `border-${selectedAgent.color.split(' ')[0].replace('from-', '').replace('-500', '')}/40 bg-gradient-to-r from-[#0a0a0a] to-[#0c0c0c]` 
                  : 'border-white/10 bg-gradient-to-r from-[#0a0a0a] to-[#080808] hover:border-white/20'}
              `}>
                {/* Agent-specific Actions */}
                <div className="flex items-center gap-2 pl-4 pb-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${selectedAgent.color}/20 border ${selectedAgent.color.split(' ')[0].replace('from-', 'border-').replace('-500', '/30')}`}>
                    {selectedAgent.icon}
                  </div>
                  
                  {/* Quick Capabilities */}
                  <div className="flex gap-1">
                    {selectedAgent.capabilities.slice(0, 2).map((cap, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-1 rounded-full bg-white/[0.05] text-slate-400"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
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
                  placeholder={isLoading 
                    ? `${selectedAgent.name} is processing your request...` 
                    : `Ask ${selectedAgent.name}... (Shift + Enter for new line)`}
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
                        ? `bg-gradient-to-r ${selectedAgent.color} text-white shadow-xl`
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

              {/* Enhanced Bottom Status Bar */}
              <div className="flex justify-between items-center mt-4 px-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ 
                        scale: isLoading ? [1, 1.2, 1] : 1,
                        opacity: isLoading ? [0.6, 1, 0.6] : 1
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${selectedAgent.color}`}
                    />
                    <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                      {isLoading ? 'AGENT PROCESSING' : `${selectedAgent.name.toUpperCase()} READY`}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-600 font-medium">
                      Strength:
                    </span>
                    <span className="text-[10px] font-bold text-slate-300">
                      {selectedAgent.strength}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500">
                    Temperature: {selectedAgent.temperature.toFixed(1)}
                  </span>
                  <button className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-medium">
                    Switch Agent
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

// Update MessageBubble to show agent
function MessageBubble({ msg, isUser, agent, onCopy, isCopied }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-8 group`}
    >
      {/* Header with Agent Info */}
      <div className={`flex items-center gap-3 mb-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isUser 
          ? 'bg-gradient-to-br from-cyan-500 to-cyan-600' 
          : `bg-gradient-to-br ${agent.color}`
        }`}>
          {isUser ? (
            <User size={16} className="text-white" />
          ) : (
            agent.icon
          )}
        </div>
        <div className="flex flex-col">
          <span className={`text-sm font-bold tracking-wide ${isUser ? 'text-cyan-400' : 'text-slate-300'}`}>
            {isUser ? 'You' : agent.name}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {!isUser && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.05] text-slate-400">
                {agent.strength}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className={`relative ${isUser ? 'max-w-[85%]' : 'max-w-[90%]'}`}>
        <div className={`
          relative px-6 py-5 rounded-3xl transition-all duration-500 backdrop-blur-sm
          ${isUser 
            ? 'bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20' 
            : `bg-gradient-to-r ${agent.color}/10 to-white/[0.01] border ${agent.color.split(' ')[0].replace('from-', 'border-').replace('-500', '/30')}`
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
              <Sparkles size={14} className={agent.color.includes('fuchsia') ? 'text-fuchsia-400' : 'text-cyan-400'} />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Update EmptyState to show agent capabilities
function EmptyState({ selectedAgent }: { selectedAgent: Agent }) {
  const suggestions = [
    `Explain ${selectedAgent.strength.toLowerCase()} concepts in simple terms`,
    `Help me with a ${selectedAgent.capabilities[0].toLowerCase()} task`,
    `Generate ${selectedAgent.strength.toLowerCase()} content about...`,
    `Analyze this using ${selectedAgent.name}'s capabilities`
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
    >
      {/* Animated Agent Logo */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="relative mb-8"
      >
        <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${selectedAgent.color}/20 border border-white/10 flex items-center justify-center shadow-2xl`}>
          <div className="absolute inset-4 rounded-2xl bg-gradient-to-br ${selectedAgent.color}/30 blur-xl" />
          <div className="relative z-10 text-white">
            {selectedAgent.icon}
          </div>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 rounded-3xl border border-white/10 border-t-transparent"
        />
      </motion.div>

      {/* Agent-specific Welcome */}
      <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-3">
        {selectedAgent.name} Active
      </h1>
      <p className="text-slate-400 text-sm font-medium tracking-wide mb-6 max-w-md">
        {selectedAgent.description}
      </p>

      {/* Agent Capabilities */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {selectedAgent.capabilities.map((capability, index) => (
          <motion.span
            key={index}
            whileHover={{ scale: 1.05 }}
            className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-slate-300"
          >
            {capability}
          </motion.span>
        ))}
      </div>

      {/* Agent-specific Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full mb-10">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 text-left group hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${selectedAgent.color}/10`}>
                <Zap size={16} className={`${selectedAgent.color.includes('fuchsia') ? 'text-fuchsia-400' : 'text-cyan-400'}`} />
              </div>
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                {suggestion}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Agent Stats */}
      <div className="flex items-center gap-6 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium">{selectedAgent.name} Online</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles size={12} className={selectedAgent.color.includes('fuchsia') ? 'text-fuchsia-500' : 'text-cyan-500'} />
          <span className="font-medium">v{selectedAgent.version}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${selectedAgent.color}`} />
          <span className="font-medium">Temp: {selectedAgent.temperature}</span>
        </div>
      </div>
    </motion.div>
  );
}