'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, initError } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

export function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initError ? `Firebase Error: ${initError.message}` : null);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);

    try {
      if (!auth) {
        setError('Firebase auth object is undefined. Check console for initialization errors.');
        setLoading(false);
        return;
      }

      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/');
      router.refresh();
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        let errorMessage = err.message || 'Authentication failed';
        
        if (err.message?.includes('account-exists-with-different-credential')) {
          errorMessage = 'Credential mismatch: Email linked to another method.';
        } else if (err.message?.includes('popup-blocked') || err.code === 'auth/popup-blocked') {
          errorMessage = 'Popup was blocked. Please enable popups and try again.';
        } else if (err.message?.includes('Network') || err.code === 'auth/network-request-failed') {
          errorMessage = 'Network error. Please check your connection.';
        } else if (err.message?.includes('CORS') || err.message?.includes('protocol')) {
          errorMessage = 'Configuration error. Please verify domain is authorized in Firebase Console.';
        }
        
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-rose-400 text-[11px] font-bold uppercase tracking-wider"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
        whileTap={{ scale: 0.98 }}
        className={`
          relative w-full flex items-center justify-center gap-4 py-4 px-6
          rounded-2xl border transition-all duration-500 overflow-hidden
          ${loading 
            ? 'bg-white/5 border-white/5 cursor-wait' 
            : 'bg-[#0a0a0a] border-white/10 hover:border-fuchsia-500/40 shadow-2xl hover:shadow-fuchsia-500/10'
          }
        `}
      >
        {/* Hover Gradient Overlay */}
        {!loading && (
          <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/5 to-cyan-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
        )}

        <div className={`w-5 h-5 relative z-10 ${loading ? 'opacity-30' : 'opacity-90 contrast-125'}`}>
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.29-.98 2.38-2.07 3.1v2.61h3.35c1.96-1.81 3.1-4.47 3.1-7.97z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-1.01 7.28-2.73l-3.35-2.61c-1.01.68-2.29 1.08-3.93 1.08-3.02 0-5.58-2.04-6.49-4.79H.96v2.67C2.75 20.39 6.68 23 12 23z" fill="#34A853"/>
            <path d="M5.51 14.21c-.23-.68-.36-1.41-.36-2.21s.13-1.53.36-2.21V7.12H.96C.35 8.61 0 10.27 0 12s.35 3.39.96 4.88l4.55-2.67z" fill="#FBBC05"/>
            <path d="M12 4.98c1.64 0 3.11.56 4.27 1.66l3.19-3.19C17.46 1.01 14.97 0 12 0 6.68 0 2.75 2.61.96 6.12l4.55 2.67C6.42 6.02 8.98 4.98 12 4.98z" fill="#EA4335"/>
          </svg>
        </div>

        <span className="relative z-10 text-[11px] font-black tracking-[0.2em] uppercase text-white">
          {loading ? 'Initializing...' : 'Authorize via Google'}
        </span>

        {loading && (
          <div className="absolute right-6 relative z-10">
            <Loader2 className="w-4 h-4 animate-spin text-fuchsia-500" />
          </div>
        )}
      </motion.button>

      <div className="flex items-center justify-center gap-3 opacity-30 pt-2">
        <div className="h-[1px] w-8 bg-white/20" />
        <div className="flex items-center gap-2">
          <ShieldCheck size={10} className="text-cyan-400" />
          <p className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-300">
            Secure Neural Auth
          </p>
        </div>
        <div className="h-[1px] w-8 bg-white/20" />
      </div>
    </div>
  );
}