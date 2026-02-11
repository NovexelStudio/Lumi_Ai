'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Removed initError
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, ShieldCheck, Lock, Globe, Cpu, Zap, Check } from 'lucide-react';

export function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);
  // Default error to null since we handle initialization checks inside the function
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [securityLevel, setSecurityLevel] = useState(0);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    
    // Start security level animation
    const interval = setInterval(() => {
      setSecurityLevel(prev => prev >= 100 ? 100 : prev + 5);
    }, 30);

    try {
      // Manual check for auth instance
      if (!auth) {
        throw new Error('auth-undefined: Firebase logic not initialized.');
      }

      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
      
      setSuccess(true);
      clearInterval(interval);
      setSecurityLevel(100);
      
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1000);
      
    } catch (err: any) {
      clearInterval(interval);
      setSecurityLevel(0);
      
      // Ignore user-cancelled errors
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        let errorMessage = 'Authentication protocol failed';
        let errorDetails = '';
        
        if (err.code === 'auth/unauthorized-domain') {
          errorMessage = 'Domain Not Authorized';
          errorDetails = 'Please add this URL to Firebase Authorized Domains.';
        } else if (err.code === 'auth/popup-blocked') {
          errorMessage = 'Popup Blocked';
          errorDetails = 'Please enable popups for this terminal.';
        } else if (err.message === 'auth-undefined') {
          errorMessage = 'Config Error';
          errorDetails = 'Firebase API keys are missing or invalid.';
        } else {
          errorMessage = err.code || 'System Error';
          errorDetails = err.message || 'Unknown protocol failure';
        }
        
        setError(`${errorMessage}: ${errorDetails}`);
      }
    } finally {
      if (!success) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative overflow-hidden rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5"
          >
            <div className="relative z-10 flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-rose-400 mt-1" />
              <div className="flex-1">
                <p className="text-xs font-black uppercase text-rose-400 mb-1">Security Alert</p>
                <p className="text-sm font-medium text-rose-300">{error.split(':')[0]}</p>
                <p className="text-xs text-rose-400/70">{error.split(':')[1]}</p>
              </div>
              <button onClick={() => setError(null)} className="text-rose-400">×</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-mono text-fuchsia-500">
            <span>ESTABLISHING_LINK...</span>
            <span>{securityLevel}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${securityLevel}%` }} className="h-full bg-fuchsia-500" />
          </div>
        </div>
      )}

      <button
        onClick={handleGoogleSignIn}
        disabled={loading || success}
        className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest border transition-all flex items-center justify-center gap-3
          ${success ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white text-black hover:bg-fuchsia-500 hover:text-white'}
        `}
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : success ? <Check size={18} /> : "Bypass with Google_ID"}
      </button>

      <div className="flex justify-center gap-4 text-[9px] text-slate-600 font-mono uppercase">
        <span className="flex items-center gap-1"><ShieldCheck size={10}/> Encrypted</span>
        <span className="flex items-center gap-1"><Lock size={10}/> Secure</span>
      </div>
    </div>
  );
}