'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Menu, Cpu, ChevronDown, Zap, BrainCircuit, User, Activity, 
  Settings, Bell, Shield, Network, Battery, Wifi, Globe,
  Sparkles, Brain, Cctv, Satellite, Terminal, Lock,
  Maximize2, Minimize2, Moon, Sun, Clock, HardDrive
} from 'lucide-react';
import { AI_MODELS, getModelIcon } from '@/lib/aiModels';
import { useAuth } from '@/lib/authContext';

export function ChatHeader({
  selectedModel,
  onModelChange,
  onToggleSidebar,
  onToggleFullscreen,
  onToggleTheme,
  showModelSelector = true,
  isFullscreen = false,
  isDarkMode = true,
}: any) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [networkLatency, setNetworkLatency] = useState<number>(24);
  const [cpuUsage, setCpuUsage] = useState<number>(42);
  const [memoryUsage, setMemoryUsage] = useState<number>(68);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useAuth();

  const currentModel = AI_MODELS.find(m => m.id === selectedModel);

  // Simulate system stats
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkLatency(prev => Math.max(8, prev + (Math.random() - 0.5) * 4));
      setCpuUsage(prev => Math.max(20, Math.min(80, prev + (Math.random() - 0.5) * 6)));
      setMemoryUsage(prev => Math.max(40, Math.min(90, prev + (Math.random() - 0.5) * 3)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (statsRef.current && !statsRef.current.contains(e.target as Node)) {
        setIsStatsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPerformanceColor = (value: number) => {
    if (value < 40) return 'text-emerald-500';
    if (value < 70) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getPerformanceBg = (value: number) => {
    if (value < 40) return 'bg-emerald-500/20';
    if (value < 70) return 'bg-amber-500/20';
    return 'bg-rose-500/20';
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex-shrink-0 h-20 flex items-center justify-between px-6 md:px-10 border-b border-white/5 bg-gradient-to-b from-[#020202]/90 via-[#050505]/80 to-[#020202]/90 backdrop-blur-3xl z-50 relative"
    >
      {/* Enhanced Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/5 via-transparent to-cyan-500/5" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* LEFT: Branding & Controls */}
      <div className="flex items-center gap-6 relative z-10">
        {onToggleSidebar && (
          <button 
            onClick={onToggleSidebar} 
            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-fuchsia-500 hover:border-fuchsia-500/30 transition-all hover:scale-105 group"
          >
            <Menu size={18} className="group-hover:animate-pulse" />
          </button>
        )}
        
        <motion.div 
          className="flex items-center gap-4 group cursor-pointer" 
          onClick={() => router.push('/')}
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 bg-gradient-to-r from-fuchsia-500/20 via-cyan-500/20 to-fuchsia-500/20 rounded-2xl blur-sm"
            />
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#080808] to-[#060606] border border-white/10 flex items-center justify-center shadow-2xl">
              <Brain size={20} className="text-fuchsia-500" />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500"
              />
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-[0.2em] text-white uppercase leading-none">
                LUMI<span className="text-fuchsia-500 ml-1">CORE</span>
              </h1>
              <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-500 font-black">
                v4.2.1
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Neural Interface Active
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CENTER: Enhanced Model Selector & Stats */}
      {showModelSelector && currentModel && (
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 relative z-10">
          {/* Model Selector */}
          <div ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`
                relative group flex items-center gap-4 px-6 py-3 rounded-2xl border transition-all duration-500
                ${isDropdownOpen 
                  ? 'bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 border-fuchsia-500/40 shadow-2xl shadow-fuchsia-500/10' 
                  : 'bg-gradient-to-r from-white/[0.02] to-white/[0.01] border-white/10 hover:border-fuchsia-500/30 hover:shadow-xl'}
              `}
            >
              {/* Animated Background */}
              <motion.div
                animate={isDropdownOpen ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/20 via-cyan-500/20 to-fuchsia-500/20 rounded-2xl blur-sm"
              />

              <div className="flex items-center gap-4 relative z-10">
                <div className={`w-10 h-10 rounded-xl ${isDropdownOpen ? 'bg-fuchsia-500/20' : 'bg-white/[0.03]'} flex items-center justify-center`}>
                  <span className="text-xl grayscale-0">{getModelIcon(selectedModel)}</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[9px] font-black tracking-[0.3em] text-slate-500 uppercase">Active Engine</span>
                  <span className="text-sm font-bold text-white tracking-tight">{currentModel.name}</span>
                </div>
              </div>
              <ChevronDown 
                size={14} 
                className={`relative z-10 text-slate-600 transition-all duration-500 ${isDropdownOpen ? 'rotate-180 text-fuchsia-500 scale-110' : 'group-hover:text-white'}`} 
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-96 p-4 bg-gradient-to-b from-[#080808] to-[#060606] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-50"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase">Neural Engines</h3>
                      <Sparkles size={14} className="text-fuchsia-500" />
                    </div>
                    
                    {AI_MODELS.map((model) => {
                      const isSelected = selectedModel === model.id;
                      return (
                        <motion.button
                          key={model.id}
                          whileHover={{ scale: 1.02, x: 2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => { onModelChange(model.id); setIsDropdownOpen(false); }}
                          className={`
                            w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300
                            ${isSelected 
                              ? 'bg-gradient-to-r from-fuchsia-500/20 to-cyan-500/10 border border-fuchsia-500/20' 
                              : 'hover:bg-white/[0.02] border border-transparent'}
                          `}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${isSelected ? 'bg-fuchsia-500/20' : 'bg-white/[0.03]'} flex items-center justify-center`}>
                              <span className="text-2xl">{getModelIcon(model.id)}</span>
                            </div>
                            <div className="text-left">
                              <div className="flex items-center gap-2 mb-1">
                                <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                  {model.name}
                                </p>
                                {(model as any).beta && (
                                  <span className="text-[8px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold">
                                    BETA
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 font-medium">
                                {model.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {isSelected && (
                              <motion.div
                                layoutId="active-engine"
                                className="w-2 h-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500"
                              />
                            )}
                            <div className="text-right">
                              <div className={`text-xs font-bold ${getPerformanceColor((model as any).speed)}`}>
                                {(model as any).speed}ms
                              </div>
                              <div className="text-[10px] text-slate-500">
                                Latency
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Stats Button */}
          <div ref={statsRef} className="relative">
            <button
              onClick={() => setIsStatsOpen(!isStatsOpen)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-fuchsia-500/30 hover:bg-white/[0.03] transition-all group"
            >
              <Activity size={16} className="text-emerald-500 group-hover:animate-pulse" />
              <div className="text-left">
                <div className="text-[10px] font-bold text-slate-400">System</div>
                <div className="text-xs font-black text-white">{cpuUsage}%</div>
              </div>
            </button>

            <AnimatePresence>
              {isStatsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute top-full mt-4 right-0 w-80 p-4 bg-gradient-to-b from-[#080808] to-[#060606] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-50"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black tracking-wider text-slate-400 uppercase">System Monitor</h3>
                      <Terminal size={14} className="text-cyan-500" />
                    </div>

                    {/* Performance Bars */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Cpu size={12} className="text-fuchsia-500" />
                            <span className="text-xs font-medium text-slate-300">CPU Usage</span>
                          </div>
                          <span className={`text-xs font-bold ${getPerformanceColor(cpuUsage)}`}>{cpuUsage}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/[0.03] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${cpuUsage}%` }}
                            className={`h-full rounded-full ${getPerformanceBg(cpuUsage)}`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <HardDrive size={12} className="text-cyan-500" />
                            <span className="text-xs font-medium text-slate-300">Memory</span>
                          </div>
                          <span className={`text-xs font-bold ${getPerformanceColor(memoryUsage)}`}>{memoryUsage}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/[0.03] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${memoryUsage}%` }}
                            className={`h-full rounded-full ${getPerformanceBg(memoryUsage)}`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Wifi size={12} className="text-emerald-500" />
                            <span className="text-xs font-medium text-slate-300">Network Latency</span>
                          </div>
                          <span className="text-xs font-bold text-emerald-500">{networkLatency.toFixed(0)}ms</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/[0.03] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, networkLatency)}%` }}
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                      <div className="p-3 rounded-xl bg-white/[0.02]">
                        <div className="text-[10px] font-bold text-slate-400 mb-1">Uptime</div>
                        <div className="text-xs font-black text-white">18h 42m</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.02]">
                        <div className="text-[10px] font-bold text-slate-400 mb-1">Requests</div>
                        <div className="text-xs font-black text-white">1,248</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* RIGHT: Enhanced User & Controls */}
      <div className="flex items-center gap-4 relative z-10">
        {/* Control Buttons */}
        <div className="flex items-center gap-2 border-r border-white/10 pr-4">
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-amber-500 hover:border-amber-500/30 transition-all hover:scale-105"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}
          
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-fuchsia-500 hover:border-fuchsia-500/30 transition-all hover:scale-105"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          )}

          <button
            onClick={() => router.push('/settings')}
            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-cyan-500 hover:border-cyan-500/30 transition-all hover:scale-105"
            title="Settings"
          >
            <Settings size={16} />
          </button>
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all group">
          <Bell size={16} />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 border border-[#020202]"
          />
        </button>

        {/* User Profile */}
        <button 
          onClick={() => router.push('/account')}
          className="group flex items-center gap-4 transition-all"
        >
          <div className="flex flex-col items-end leading-none">
            <span className="text-xs font-bold text-white group-hover:text-fuchsia-400 transition-colors">
              {user?.displayName?.split(' ')[0] || 'Operator'}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-400 transition-colors">
              Security Level {user?.email ? 'Admin' : 'Guest'}
            </span>
          </div>

          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500/20 via-cyan-500/20 to-fuchsia-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent p-[2px] group-hover:from-fuchsia-500 group-hover:to-cyan-500 transition-all">
              <div className="w-full h-full rounded-[14px] bg-[#020202] flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="User" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" 
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 flex items-center justify-center">
                    <User size={18} className="text-slate-700 group-hover:text-white transition-colors" />
                  </div>
                )}
              </div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-[3px] border-[#020202] shadow-lg"
            />
          </div>
        </button>
      </div>
    </motion.header>
  );
}