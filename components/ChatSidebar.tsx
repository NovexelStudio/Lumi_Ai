'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, MessageSquare, Clock, Edit2, Check, X, Menu, Command, Layers } from 'lucide-react';
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
  const [internalOpen, setInternalOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null);

  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  
  const handleOpenChange = (newOpen: boolean) => {
    setInternalOpen(newOpen);
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

  return (
    <>
      {/* MOBILE TRIGGER - Neon Minimalist Button */}
      {!open && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => handleOpenChange(true)}
          className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-2xl bg-[#080808] border border-white/10 text-fuchsia-500 shadow-2xl md:hidden flex items-center justify-center"
        >
          <Menu size={20} />
        </motion.button>
      )}

      {/* MAIN SIDEBAR PANEL */}
      <motion.aside
        initial={{ x: -320 }}
        animate={{ x: isDesktop || open ? 0 : -320 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed md:static inset-y-0 left-0 w-72 bg-[#030303] border-r border-white/5 z-40 flex flex-col"
      >
        {/* SIDEBAR HEADER */}
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center">
                <Layers size={14} className="text-fuchsia-500" />
              </div>
              <span className="text-[9px] font-black tracking-[0.4em] text-slate-500 uppercase">Neural_Logs</span>
            </div>
            {open && !isDesktop && (
              <button onClick={() => handleOpenChange(false)} className="text-slate-600 hover:text-white">
                <X size={16} />
              </button>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { onNewChat(); handleOpenChange(false); }}
            className="w-full group py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-fuchsia-500/30 transition-all flex items-center justify-center gap-3"
          >
            <Plus size={14} className="text-fuchsia-500" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white">Initialize Link</span>
          </motion.button>
        </div>

        {/* CHAT LIST AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-2">
          {isLoading ? (
            <div className="h-20 flex items-center justify-center">
              <div className="w-4 h-4 border border-fuchsia-500/30 border-t-fuchsia-500 animate-spin rounded-full" />
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {chats.map((chat) => {
                const isActive = currentChatId === chat.id;
                return (
                  <motion.div
                    key={chat.id}
                    layout
                    className={`relative group rounded-xl transition-all duration-300 ${
                      isActive ? 'bg-white/[0.05] shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]' : 'hover:bg-white/[0.02]'
                    }`}
                    onMouseEnter={() => setHoveredChatId(chat.id)}
                    onMouseLeave={() => setHoveredChatId(null)}
                  >
                    {/* Active State Marker */}
                    {isActive && (
                      <motion.div 
                        layoutId="sidebar-active"
                        className="absolute left-0 top-3 bottom-3 w-[2px] bg-fuchsia-500 rounded-r-full shadow-[0_0_10px_#d946ef]"
                      />
                    )}

                    <button
                      onClick={() => { onSelectChat(chat.id); handleOpenChange(false); }}
                      className="w-full text-left py-4 px-5 flex flex-col gap-1.5"
                    >
                      {editingChatId === chat.id ? (
                        <input
                          autoFocus
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={() => handleSaveRename(chat.id)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(chat.id)}
                          className="bg-transparent border-b border-fuchsia-500 text-[13px] font-bold outline-none text-white w-full"
                        />
                      ) : (
                        <>
                          <span className={`text-[12px] font-bold tracking-tight truncate ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                            {chat.title || 'Untitled_Directive'}
                          </span>
                          <span className="text-[8px] font-black tracking-[0.2em] text-slate-600 uppercase">
                            TS // {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                          </span>
                        </>
                      )}
                    </button>

                    {/* ACTIONS - Floating Tactical Module */}
                    <AnimatePresence>
                      {(hoveredChatId === chat.id || isActive) && editingChatId !== chat.id && (
                        <motion.div 
                          initial={{ opacity: 0, x: 5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 5 }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-black/60 backdrop-blur-xl border border-white/5 rounded-lg overflow-hidden"
                        >
                          <button 
                            onClick={(e) => { e.stopPropagation(); setEditingChatId(chat.id); setEditingTitle(chat.title); }}
                            className="p-2 text-slate-500 hover:text-cyan-400 hover:bg-white/5 transition-all"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                            className="p-2 text-slate-500 hover:text-rose-500 hover:bg-white/5 transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* SIDEBAR FOOTER */}
        <div className="p-6 border-t border-white/5 bg-[#050505]/50 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Command size={10} className="text-slate-600" />
              <span className="text-[8px] font-black tracking-[0.5em] text-slate-600 uppercase">Operator_Ready</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
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