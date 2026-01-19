'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Menu, Cpu, ChevronDown, Zap, BrainCircuit, User, Activity } from 'lucide-react';
import { AI_MODELS, getModelIcon } from '@/lib/aiModels';
import { useAuth } from '@/lib/authContext';

export function ChatHeader({
  selectedModel,
  onModelChange,
  onToggleSidebar,
  showModelSelector = true,
}: any) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useAuth();

  const currentModel = AI_MODELS.find(m => m.id === selectedModel);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex-shrink-0 h-20 flex items-center justify-between px-6 md:px-10 border-b border-white/5 bg-[#020202]/80 backdrop-blur-3xl z-50 relative"
    >
      {/* LEFT: Branding & Sidebar Toggle */}
      <div className="flex items-center gap-6">
        {onToggleSidebar && (
          <button 
            onClick={onToggleSidebar} 
            className="lg:hidden p-2 rounded-xl bg-white/5 text-slate-400 hover:text-fuchsia-500 transition-all border border-white/5"
          >
            <Menu size={18} />
          </button>
        )}
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => router.push('/')}>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-[#080808] border border-white/10 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-105">
              <Cpu size={18} className="text-fuchsia-500 group-hover:animate-pulse" />
            </div>
            <div className="absolute -inset-1 bg-fuchsia-500/10 blur-lg rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="hidden sm:flex flex-col">
            <h1 className="text-sm font-black tracking-[0.3em] text-white uppercase italic leading-none">
              LUMI<span className="text-fuchsia-500 ml-1">v4</span>
            </h1>
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.4em] mt-1">Core_Interface</span>
          </div>
        </div>
      </div>

      {/* CENTER: HUD Engine Selector */}
      {showModelSelector && currentModel && (
        <div className="absolute left-1/2 -translate-x-1/2" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`
              relative group flex items-center gap-4 px-6 py-2.5 rounded-full border transition-all duration-500
              ${isDropdownOpen 
                ? 'bg-fuchsia-500/5 border-fuchsia-500/40 shadow-[0_0_40px_rgba(217,70,239,0.15)]' 
                : 'bg-white/[0.02] border-white/5 hover:border-white/20'}
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg grayscale group-hover:grayscale-0 transition-all">{getModelIcon(selectedModel)}</span>
              <div className="flex flex-col items-start leading-tight">
                <span className="text-[8px] font-black tracking-[0.3em] text-slate-500 uppercase">Neural_Engine</span>
                <span className="text-[11px] font-bold text-white uppercase tracking-widest">{currentModel.name}</span>
              </div>
            </div>
            <ChevronDown size={12} className={`text-slate-600 transition-transform duration-500 ${isDropdownOpen ? 'rotate-180 text-fuchsia-500' : ''}`} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-80 p-2 bg-[#080808]/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.9)] z-50"
              >
                <div className="grid grid-cols-1 gap-1">
                  {AI_MODELS.map((model) => {
                    const isSelected = selectedModel === model.id;
                    return (
                      <button
                        key={model.id}
                        onClick={() => { onModelChange(model.id); setIsDropdownOpen(false); }}
                        className={`
                          flex items-center justify-between p-4 rounded-2xl transition-all duration-300
                          ${isSelected 
                            ? 'bg-white/[0.05] border border-white/10' 
                            : 'hover:bg-white/[0.02] border border-transparent'}
                        `}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-xl">{getModelIcon(model.id)}</span>
                          <div className="text-left">
                            <p className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-fuchsia-400' : 'text-slate-300'}`}>
                              {model.name}
                            </p>
                            <p className="text-[8px] text-slate-600 font-bold uppercase tracking-tighter mt-0.5">
                              {model.id.includes('flash') ? 'Rapid_Sync' : 'Deep_Synthesis'}
                            </p>
                          </div>
                        </div>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 shadow-[0_0_8px_#d946ef]" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* RIGHT: Status & User */}
      <div className="flex items-center gap-6">
        <div className="hidden xl:flex items-center gap-3 px-4 py-2 border-x border-white/5">
          <Activity size={12} className="text-emerald-500 animate-pulse" />
          <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">System_Stable</span>
        </div>

        <button 
          onClick={() => router.push('/account')}
          className="group flex items-center gap-4 transition-all"
        >
          <div className="flex flex-col items-end leading-none">
            <span className="text-[10px] font-black text-white tracking-tight uppercase italic group-hover:text-fuchsia-400 transition-colors">
              {user?.displayName?.split(' ')[0] || 'Operator'}
            </span>
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">Status: Online</span>
          </div>

          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-white/10 to-transparent p-[1px] group-hover:from-fuchsia-500 transition-all">
              <div className="w-full h-full rounded-[11px] bg-[#020202] flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                ) : (
                  <User size={18} className="text-slate-700 group-hover:text-white transition-colors" />
                )}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-[3px] border-[#020202]" />
          </div>
        </button>
      </div>
    </motion.header>
  );
}