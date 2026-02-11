'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, Cpu, Activity, Satellite, Database, Network, ShieldAlert 
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export default function AuthPage() {
  const router = useRouter();
  const { user, signInWithGoogle, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [securityLevel, setSecurityLevel] = useState(0);

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, router]);

  // Aesthetic progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setSecurityLevel(prev => prev >= 100 ? 0 : prev + 0.5);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      // Note: For mobile, the page will redirect away here.
      // For desktop, we manually push to home.
      if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        router.push('/');
      }
    } catch (err: any) {
      console.error(err);
      setError('Handshake failed. Ensure popups/redirects are allowed.');
      setLoading(false);
    }
  };

  // Prevent flicker while checking auth state
  if (authLoading && !loading) return null;

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#020202]">
      
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-20 w-full max-w-[450px] bg-black/40 backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] overflow-hidden p-8 lg:p-12 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center space-y-8">
          
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center">
                <Cpu size={32} className="text-fuchsia-400" />
            </div>
            <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Secure_Neural_Link</span>
                <h3 className="text-2xl font-black text-white tracking-tighter">LUMI_OS <span className="text-fuchsia-500 text-sm italic">v.8.0</span></h3>
            </div>
          </div>

          <div className="w-full space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-white italic">
              SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-400">ACCESS</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-500 uppercase">Protocol: OAUTH_GOOGLE_BYPASS</p>
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between text-[10px] font-mono">
                <span className="text-emerald-500 flex items-center gap-1">
                   <Activity size={10} /> ENCRYPTION_LIVE
                </span>
                <span className="text-white">{Math.round(securityLevel)}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div animate={{ width: `${securityLevel}%` }} className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500" />
            </div>
          </div>

          <button 
            onClick={handleLogin}
            disabled={loading}
            className="group relative w-full py-4 bg-white text-black font-black rounded-xl flex items-center justify-center gap-3 uppercase tracking-widest text-xs hover:bg-fuchsia-500 hover:text-white transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <span>Bypass with Google_ID</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-[10px] font-bold uppercase w-full justify-center">
                <ShieldAlert size={14} />
                {error}
            </div>
          )}

          <p className="text-[9px] text-slate-600 uppercase tracking-widest leading-relaxed">
            Authorized Personnel Only. <br/> All access attempts are logged via node_0x4F.
          </p>
        </div>
      </motion.div>

      {/* Footer Status */}
      <div className="absolute bottom-6 hidden md:flex gap-6 px-6 py-2 border border-white/5 rounded-full bg-black/50 text-[9px] font-mono text-slate-500">
        <span className="flex items-center gap-1"><Satellite size={10} className="text-fuchsia-500"/> SATELLITE_LINK: ACTIVE</span>
        <span className="flex items-center gap-1"><Network size={10} className="text-cyan-500"/> NODES: 1,402</span>
      </div>
    </div>
  );
}