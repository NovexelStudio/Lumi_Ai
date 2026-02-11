'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, Cpu, Activity, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export default function AuthPage() {
  const router = useRouter();
  const { user, signInWithGoogle, loading: authLoading } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) router.replace('/');
  }, [user, router]);

  const handleLogin = async () => {
    setError('');
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setIsLoggingIn(false);
      if (err.code === 'auth/popup-blocked') {
        setError('Handshake failed: Popup blocked.');
      } else {
        setError('System access denied.');
      }
    }
  };

  if (authLoading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-pulse text-fuchsia-500 font-mono">INITIALIZING_LUMI_OS...</div>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#020202] relative">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-20 w-full max-w-[400px] bg-black/40 backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] p-10 text-center"
      >
        <Cpu size={40} className="text-fuchsia-400 mx-auto mb-6" />
        <h1 className="text-3xl font-black text-white italic mb-2">SYSTEM <span className="text-fuchsia-500">ACCESS</span></h1>
        <p className="text-[10px] text-slate-500 mb-8 tracking-[0.3em]">OAUTH_GOOGLE_PROTOCOL</p>

        <button 
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="w-full py-4 bg-white text-black font-black rounded-xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs hover:bg-fuchsia-500 hover:text-white transition-all disabled:opacity-50"
        >
          {isLoggingIn ? "Authenticating..." : "Bypass with Google_ID"}
          {!isLoggingIn && <ArrowRight size={16} />}
        </button>

        {error && (
          <div className="mt-4 flex items-center justify-center gap-2 text-rose-500 text-[10px] font-bold">
            <ShieldAlert size={14} /> {error}
          </div>
        )}
      </motion.div>
    </div>
  );
}