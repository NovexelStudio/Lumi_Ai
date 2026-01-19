'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, MessageSquare, Clock, Edit2, Check, X, Menu, Command, 
  Layers, Search, Filter, Archive, Star, Pin, MoreVertical, 
  ChevronRight, Hash, Lock, Globe, Users, Database, Cpu,
  Zap, Sparkles, Brain, Terminal, FolderOpen, FolderClosed
} from 'lucide-react';
import { Chat, renameChat } from '@/lib/databaseService';

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  isLoading?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  userId?: string;
  onUpdateChat?: (chatId: string, title: string) => void;
}

export function ChatSidebar({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isLoading = false,
  open: externalOpen,
  onOpenChange,
  userId,
  onUpdateChat,
}: ChatSidebarProps) {
  const [isDesktop, setIsDesktop] = useState(true);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pinned' | 'recent'>('all');
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['recent']);

  // Use external open state if provided, otherwise default to true
  const open = externalOpen !== undefined ? externalOpen : true;
  
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange?.(newOpen);
  };

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSaveRename = async (chatId: string) => {
    if (!userId || !editingTitle.trim()) return;
    try {
      await renameChat(userId, chatId, editingTitle.trim());
      onUpdateChat?.(chatId, editingTitle.trim());
      setEditingChatId(null);
    } catch (err) { console.error(err); }
  };

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev =>
      prev.includes(folder)
        ? prev.filter(f => f !== folder)
        : [...prev, folder]
    );
  };

  const filteredChats = chats.filter(chat => {
    if (searchQuery) {
      return chat.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (activeFilter === 'pinned') return (chat as any).pinned;
    if (activeFilter === 'recent') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return new Date(chat.updatedAt) > sevenDaysAgo;
    }
    return true;
  });

  const recentChats = filteredChats.filter(chat => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(chat.updatedAt) > sevenDaysAgo;
  });

  const olderChats = filteredChats.filter(chat => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(chat.updatedAt) <= sevenDaysAgo;
  });

  return (
    <>
      {/* Backdrop Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => handleOpenChange(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>

      {/* MAIN SIDEBAR PANEL */}
      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: open ? 0 : -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-[#030303] via-[#050505] to-[#030303] border-r border-white/5 z-40 flex flex-col shadow-2xl shadow-black/50"
      >
        {/* SIDEBAR HEADER - Neural Interface Panel */}
        <div className="p-6 space-y-6 border-b border-white/5 bg-gradient-to-b from-black/30 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center"
              >
                <Database size={18} className="text-white" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Neural Logs</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h2 className="text-sm font-black text-white tracking-tight">Memory Banks</h2>
              </div>
            </div>
            <AnimatePresence>
              {open && !isDesktop && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => handleOpenChange(false)}
                  className="p-2 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-colors"
                >
                  <X size={16} className="text-slate-400" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-fuchsia-500 transition-colors" size={16} />
            <input
              type="text"
              placeholder="Search neural logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-fuchsia-500/50 focus:bg-white/[0.03] transition-all placeholder:text-slate-600 placeholder:font-medium"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-xs font-bold text-slate-400 mb-1">Active</div>
              <div className="text-lg font-black text-white">{chats.length}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-xs font-bold text-slate-400 mb-1">Today</div>
              <div className="text-lg font-black text-white">
                {chats.filter(c => new Date(c.updatedAt).toDateString() === new Date().toDateString()).length}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="text-xs font-bold text-slate-400 mb-1">Size</div>
              <div className="text-lg font-black text-white">
                {(chats.length * 2.5).toFixed(1)}MB
              </div>
            </div>
          </div>
        </div>

        {/* NEW CHAT BUTTON - Neural Activation */}
        <div className="p-4 border-b border-white/5">
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { onNewChat(); handleOpenChange(false); }}
            className="w-full group py-3.5 rounded-xl bg-gradient-to-r from-fuchsia-600/20 via-fuchsia-600/10 to-cyan-500/10 border border-fuchsia-500/20 hover:border-fuchsia-500/40 transition-all flex items-center justify-center gap-3 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Zap size={16} className="relative z-10 text-fuchsia-500" />
            <span className="relative z-10 text-[11px] font-black tracking-[0.1em] uppercase text-white">
              Initialize New Link
            </span>
            <ChevronRight size={14} className="relative z-10 text-slate-400 group-hover:text-white transition-colors ml-auto" />
          </motion.button>
        </div>

        {/* FILTER TABS */}
        <div className="px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/5">
            {['all', 'recent', 'pinned'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/20 text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* CHAT LIST AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 space-y-4">
          {isLoading ? (
            <div className="h-40 flex items-center justify-center">
              <div className="relative">
                <div className="w-8 h-8 border-2 border-fuchsia-500/30 border-t-fuchsia-500 animate-spin rounded-full" />
                <div className="absolute inset-0 w-8 h-8 border-2 border-cyan-500/30 border-b-cyan-500 animate-spin rounded-full animation-delay-[-0.45s]" />
              </div>
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center p-6">
              <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-4">
                <MessageSquare size={20} className="text-slate-600" />
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">
                {searchQuery ? 'No logs found' : 'No neural logs yet'}
              </p>
              <p className="text-xs text-slate-600">
                {searchQuery ? 'Try different keywords' : 'Start a new conversation'}
              </p>
            </div>
          ) : (
            <>
              {/* Recent Chats Folder */}
              {recentChats.length > 0 && (
                <div className="space-y-2">
                  <button
                    onClick={() => toggleFolder('recent')}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {expandedFolders.includes('recent') ? (
                      <FolderOpen size={14} />
                    ) : (
                      <FolderClosed size={14} />
                    )}
                    <span>Recent Logs</span>
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-white/[0.03]">
                      {recentChats.length}
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {expandedFolders.includes('recent') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        {recentChats.map((chat) => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={currentChatId === chat.id}
                            editingChatId={editingChatId}
                            editingTitle={editingTitle}
                            hoveredChatId={hoveredChatId}
                            onSelectChat={() => { onSelectChat(chat.id); handleOpenChange(false); }}
                            onEditStart={() => { setEditingChatId(chat.id); setEditingTitle(chat.title); }}
                            onSaveEdit={() => handleSaveRename(chat.id)}
                            onDeleteChat={() => onDeleteChat(chat.id)}
                            setHoveredChatId={setHoveredChatId}
                            setEditingTitle={setEditingTitle}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Older Chats Folder */}
              {olderChats.length > 0 && (
                <div className="space-y-2">
                  <button
                    onClick={() => toggleFolder('older')}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {expandedFolders.includes('older') ? (
                      <FolderOpen size={14} />
                    ) : (
                      <FolderClosed size={14} />
                    )}
                    <span>Archive</span>
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-white/[0.03]">
                      {olderChats.length}
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {expandedFolders.includes('older') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        {olderChats.map((chat) => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={currentChatId === chat.id}
                            editingChatId={editingChatId}
                            editingTitle={editingTitle}
                            hoveredChatId={hoveredChatId}
                            onSelectChat={() => { onSelectChat(chat.id); handleOpenChange(false); }}
                            onEditStart={() => { setEditingChatId(chat.id); setEditingTitle(chat.title); }}
                            onSaveEdit={() => handleSaveRename(chat.id)}
                            onDeleteChat={() => onDeleteChat(chat.id)}
                            setHoveredChatId={setHoveredChatId}
                            setEditingTitle={setEditingTitle}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </div>

        {/* SIDEBAR FOOTER - System Status */}
        <div className="p-4 border-t border-white/5 bg-gradient-to-t from-black/30 to-transparent">
          <div className="space-y-4">
            {/* Storage Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Neural Storage</span>
                <span className="text-xs font-black text-slate-300">64%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '64%' }}
                  className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500"
                />
              </div>
            </div>

            {/* System Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Interface Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Brain size={10} className="text-fuchsia-500" />
                <span className="text-[10px] font-black text-slate-300">v4.2.1</span>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => handleOpenChange(false)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-30 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  editingChatId: string | null;
  editingTitle: string;
  hoveredChatId: string | null;
  onSelectChat: () => void;
  onEditStart: () => void;
  onSaveEdit: () => void;
  onDeleteChat: () => void;
  setHoveredChatId: (id: string | null) => void;
  setEditingTitle: (title: string) => void;
}

function ChatItem({
  chat,
  isActive,
  editingChatId,
  editingTitle,
  hoveredChatId,
  onSelectChat,
  onEditStart,
  onSaveEdit,
  onDeleteChat,
  setHoveredChatId,
  setEditingTitle,
}: ChatItemProps) {
  const isEditing = editingChatId === chat.id;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`relative group rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/5 border border-fuchsia-500/20' 
          : 'hover:bg-white/[0.02] border border-transparent hover:border-white/5'
      }`}
      onMouseEnter={() => setHoveredChatId(chat.id)}
      onMouseLeave={() => setHoveredChatId(null)}
    >
      {/* Active State Glow */}
      {isActive && (
        <motion.div 
          layoutId="sidebar-active"
          className="absolute -left-1 top-2 bottom-2 w-1 bg-gradient-to-b from-fuchsia-500 to-cyan-500 rounded-r-full shadow-[0_0_10px_#d946ef]"
        />
      )}

      <button
        onClick={onSelectChat}
        className="w-full text-left py-3.5 px-4 flex flex-col gap-1.5"
      >
        {isEditing ? (
          <input
            autoFocus
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            onBlur={onSaveEdit}
            onKeyDown={(e) => e.key === 'Enter' && onSaveEdit()}
            className="bg-transparent border-b border-fuchsia-500 text-[13px] font-bold outline-none text-white w-full"
          />
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                isActive ? 'bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20' : 'bg-white/[0.03]'
              }`}>
                <MessageSquare size={12} className={isActive ? 'text-white' : 'text-slate-500'} />
              </div>
              <span className={`text-[13px] font-bold truncate flex-1 ${
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              }`}>
                {chat.title || 'Untitled Directive'}
              </span>
            </div>
            
            <div className="flex items-center justify-between pl-8">
              <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase">
                {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/[0.03] text-slate-500">
                {chat.messageCount || 0} messages
              </span>
            </div>
          </>
        )}
      </button>

      {/* Action Buttons */}
      <AnimatePresence>
        {(hoveredChatId === chat.id || isActive) && !isEditing && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-black/60 backdrop-blur-xl border border-white/5 rounded-lg overflow-hidden shadow-lg"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); onEditStart(); }}
              className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-white/5 transition-all"
              title="Rename"
            >
              <Edit2 size={12} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); }}
              className="p-2 text-slate-500 hover:text-yellow-400 hover:bg-white/5 transition-all"
              title="Pin"
            >
              <Pin size={12} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDeleteChat(); }}
              className="p-2 text-slate-500 hover:text-rose-500 hover:bg-white/5 transition-all"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}