'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Mail, ArrowRight, ShieldCheck, Fingerprint,
  Eye, EyeOff, UserPlus, LogIn, Zap,
  Shield, Users, Server, Network, Terminal, Cctv,
  Satellite, Brain, Database, LockKeyhole, Activity, Cpu
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';

const GoogleSignInButton = ({ onClick, loading }: { onClick: () => void; loading: boolean }) => (
  <button 
    onClick={onClick}
    disabled={loading}
    className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] disabled:opacity-50 transition-all text-[11px] font-black text-slate-300 uppercase tracking-wider"
  >
    {loading ? (
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span>Connecting...</span>
      </div>
    ) : (
      <>
        <svg className="w-4 h-4 text-fuchsia-500" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Bypass with Google_ID
      </>
    )}
  </button>
);

export default function AuthPage() {
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [securityLevel, setSecurityLevel] = useState(0);

  const isSignup = mode === 'signup';

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecurityLevel(prev => prev >= 100 ? 0 : prev + 0.5);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          mode: isSignup ? 'signup' : 'login'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed');
        setLoading(false);
        return;
      }

      // Success - user will be logged in via Firebase
      setEmail('');
      setPassword('');
      router.push('/');
    } catch (err) {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
      router.push('/');
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed. Please try again.');
      }
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-3 sm:p-6 relative overflow-hidden bg-[#020202] font-sans">
      
      {/* --- ENHANCED ANIMATED BACKGROUND --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:30px_30px]" />
        
        {/* Floating Code Snippets */}
        <div className="absolute top-10 left-10 text-[8px] font-mono text-fuchsia-500/20 hidden lg:block leading-tight">
            GET /api/neural/handshake HTTP/1.1<br/>
            Host: lumi.core.node<br/>
            Connection: Keep-Alive<br/>
            Sec-Ch-Ua-Platform: "NeuralLink"
        </div>

        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-40 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent"
            initial={{ top: '-20%', left: `${(i + 1) * 12}%`, opacity: 0 }}
            animate={{ top: '120%', opacity: [0, 1, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <motion.div 
        layout
        className="relative z-20 w-full max-w-[1050px] h-full max-h-[850px] lg:h-[680px] flex flex-col lg:flex-row bg-black/40 backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(217,70,239,0.15)]"
      >
        {/* VISUAL PANEL */}
        <motion.div 
          className="lg:w-1/2 relative p-6 lg:p-10 flex flex-col justify-between overflow-hidden bg-gradient-to-b from-zinc-950 to-black"
          animate={{ x: isSignup && typeof window !== 'undefined' && window.innerWidth > 1024 ? '100%' : '0%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 100 }}
        >
            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,3px_100%]" />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                            className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.2)]">
                            <Cpu size={24} className="text-fuchsia-400" />
                        </motion.div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 leading-none">Global_Net</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                            <h3 className="text-xl font-black text-white tracking-tighter mt-1">LUMI_OS <span className="text-fuchsia-500 text-sm italic">v.8.0</span></h3>
                        </div>
                    </div>

                    <div className="space-y-1 mb-8">
                        <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-white italic leading-[0.85]">
                            SYSTEM<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">
                                {isSignup ? 'INIT' : 'ACCESS'}
                            </span>
                        </h1>
                        <p className="text-[10px] font-mono text-slate-600 tracking-tight">LATENCY: 14MS // SECTOR: 7-G // PROTOCOL: AES_256</p>
                    </div>

                    {/* Data Readout Rows */}
                    <div className="hidden lg:grid grid-cols-2 gap-4 border-y border-white/5 py-6">
                        <div className="space-y-1">
                            <span className="text-[8px] font-black text-slate-500 uppercase">Neural_Sync</span>
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                                <Activity size={10} className="text-cyan-500" />
                                <span>98.2% STABLE</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[8px] font-black text-slate-500 uppercase">Node_Address</span>
                            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                                <Satellite size={10} className="text-fuchsia-500" />
                                <span>192.168.0.128</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Cluster */}
                <div className="space-y-3">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Environment Check</span>
                            <span className="text-[10px] font-mono text-emerald-500">NO THREATS DETECTED</span>
                        </div>
                        <span className="text-xl font-black text-white italic tracking-tighter">{Math.round(securityLevel)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden p-[1px]">
                        <motion.div animate={{ width: `${securityLevel}%` }} className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-cyan-500 to-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                    </div>
                </div>
            </div>
        </motion.div>

        {/* FORM PANEL */}
        <motion.div 
          className="lg:w-1/2 p-7 lg:p-12 flex flex-col justify-center bg-transparent relative"
          animate={{ x: isSignup && typeof window !== 'undefined' && window.innerWidth > 1024 ? '-100%' : '0%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 100 }}
        >
          <div className="max-w-sm mx-auto w-full space-y-8">
            <header className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-[1px] w-6 bg-fuchsia-500" />
                <span className="text-[10px] font-black text-fuchsia-500 uppercase tracking-widest">Authorize_Session</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {isSignup ? 'Register New Link' : 'Secure Entry Point'}
              </h2>
            </header>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div className="space-y-1.5 group">
                        <label className="text-[9px] font-black text-slate-500 uppercase ml-1 tracking-widest">Login_Handle</label>
                        <div className="relative group">
                            <input 
                            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                            placeholder="operator@neural.net" 
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-fuchsia-500/50 transition-all placeholder:text-slate-700"
                            />
                            <Terminal size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-fuchsia-500 transition-colors" />
                        </div>
                    </div>

                    <div className="space-y-1.5 group">
                        <label className="text-[9px] font-black text-slate-500 uppercase ml-1 tracking-widest">Access_Key</label>
                        <div className="relative">
                            <input 
                            type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••" 
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-fuchsia-500/50 transition-all placeholder:text-slate-700"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(217,70,239,0.2)" }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-black py-3.5 rounded-xl mt-4 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] shadow-lg transition-all disabled:opacity-50"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            <span>Authenticating...</span>
                        </div>
                    ) : (
                        <>
                            <span>{isSignup ? 'Establish Link' : 'Engage Interface'}</span>
                            <ArrowRight size={16} />
                        </>
                    )}
                </motion.button>

                {error && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 text-center">
                    {error}
                  </div>
                )}
            </form>

            <div className="relative py-2">
                <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="relative flex justify-center text-[8px] font-black text-slate-600 uppercase bg-[#080808] px-4 w-max mx-auto tracking-widest italic">Encrypted_Bypass</span>
            </div>

            <div className="space-y-4">
              <GoogleSignInButton onClick={handleGoogleSignIn} loading={googleLoading} />
              <button 
                type="button"
                onClick={() => {
                  setMode(isSignup ? 'login' : 'signup');
                  setError('');
                }}
                className="w-full text-center text-[10px] font-black text-slate-500 hover:text-cyan-400 transition-colors uppercase tracking-[0.15em]"
              >
                {isSignup ? 'Already have a link? Sign_In' : 'New operator? Create_Account'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* FOOTER DATASTRIP */}
      <div className="absolute bottom-6 hidden lg:flex items-center gap-8 px-6 py-2.5 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-fuchsia-500 animate-ping" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Core_Status: Operational</span>
        </div>
        <div className="flex items-center gap-2">
          <Database size={10} className="text-cyan-500" />
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Database_Pool: 0x4F...32</span>
        </div>
        <div className="flex items-center gap-2">
          <Network size={10} className="text-emerald-500" />
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Active_Nodes: 1,402</span>
        </div>
      </div>
    </div>
  );
}