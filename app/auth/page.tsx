'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck, Fingerprint } from 'lucide-react';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const isSignup = mode === 'signup';

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-[#020202] font-sans">
      {/* Background Neural Grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,#d946ef10_0%,transparent_70%)]" />
      </div>

      <motion.div 
        layout
        className="relative z-10 w-full max-w-[1100px] min-h-[700px] flex flex-col lg:flex-row bg-[#080808]/80 backdrop-blur-3xl border border-white/5 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* VISUAL PANEL (Slides based on mode) */}
        <motion.div 
          className="hidden lg:flex w-1/2 relative p-16 flex-col justify-between overflow-hidden bg-[#050505]"
          animate={{ x: isSignup ? '100%' : '0%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 100 }}
        >
          {/* Scanning Line Animation */}
          <motion.div 
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-fuchsia-500/20 blur-sm z-20"
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Fingerprint size={20} className="text-fuchsia-500" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Identity_Protocol</span>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <h1 className="text-6xl font-black tracking-tighter text-white italic leading-[0.9]">
                  LUMI <br /> 
                  <span className="text-fuchsia-500 uppercase not-italic text-4xl tracking-widest">v4.0</span>
                </h1>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest max-w-xs leading-relaxed">
                  {isSignup 
                    ? 'Establish a new neural link with the core interface.' 
                    : 'Re-authenticate your existing operator signature.'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">
            <ShieldCheck size={14} className="text-emerald-500" />
            End-to-End Encrypted Session
          </div>
        </motion.div>

        {/* FORM PANEL */}
        <motion.div 
          className="w-full lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center relative"
          animate={{ x: isSignup ? '-100%' : '0%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 100 }}
        >
          <div className="max-w-md mx-auto w-full">
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-fuchsia-500 w-4 h-4" />
                <span className="text-[10px] font-black tracking-[0.3em] text-fuchsia-500 uppercase">Authentication_Module</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">
                {isSignup ? 'Initialize' : 'Authorize'}
              </h2>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="group relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-fuchsia-500 transition-colors" size={16} />
                <input 
                  type="email" 
                  placeholder="OPERATOR_EMAIL" 
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold tracking-widest text-white outline-none focus:border-fuchsia-500/50 focus:bg-fuchsia-500/5 transition-all placeholder:text-slate-700"
                />
              </div>

              <div className="group relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-fuchsia-500 transition-colors" size={16} />
                <input 
                  type="password" 
                  placeholder="ACCESS_KEY" 
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold tracking-widest text-white outline-none focus:border-fuchsia-500/50 focus:bg-fuchsia-500/5 transition-all placeholder:text-slate-700"
                />
              </div>

              <button className="w-full bg-white text-black font-black py-5 rounded-2xl mt-6 hover:bg-fuchsia-500 hover:text-white transition-all duration-500 flex items-center justify-center gap-3 text-[11px] tracking-[0.2em] group">
                {isSignup ? 'CREATE_ACCOUNT' : 'SECURE_ACCESS'}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="relative my-10 flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-white/5" />
              <span className="relative bg-[#080808] px-6 text-[8px] font-black text-slate-600 uppercase tracking-[0.5em]">External_Bridge</span>
            </div>

            <GoogleSignInButton />

            <div className="mt-12 text-center">
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                {isSignup ? 'Link already established?' : "Awaiting credentials?"}{' '}
                <button 
                  onClick={() => setMode(isSignup ? 'login' : 'signup')}
                  className="text-fuchsia-500 hover:text-white transition-colors ml-2"
                >
                  {isSignup ? '[ LOGIN ]' : '[ SIGN_UP ]'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}