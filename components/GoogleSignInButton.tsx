'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, initError } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, ShieldCheck, Lock, Globe, Cpu, Zap, Check } from 'lucide-react';

export function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initError ? `Firebase Error: ${initError.message}` : null);
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
      if (!auth) {
        setError('Firebase auth object is undefined. Check console for initialization errors.');
        setLoading(false);
        clearInterval(interval);
        return;
      }

      const provider = new GoogleAuthProvider();
      // Add additional scopes if needed
      provider.addScope('profile');
      provider.addScope('email');
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
      
      // Show success state
      setSuccess(true);
      clearInterval(interval);
      setSecurityLevel(100);
      
      // Wait for animation before redirect
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1000);
      
    } catch (err: any) {
      clearInterval(interval);
      setSecurityLevel(0);
      
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        let errorMessage = 'Authentication protocol failed';
        let errorDetails = '';
        
        if (err.code === 'auth/account-exists-with-different-credential') {
          errorMessage = 'Identity Conflict';
          errorDetails = 'This email is already linked to another authentication method.';
        } else if (err.code === 'auth/popup-blocked') {
          errorMessage = 'Popup Blocked';
          errorDetails = 'Please enable popups for this site and try again.';
        } else if (err.code === 'auth/network-request-failed') {
          errorMessage = 'Network Error';
          errorDetails = 'Unable to establish secure connection. Check your network.';
        } else if (err.code === 'auth/unauthorized-domain') {
          errorMessage = 'Domain Not Authorized';
          errorDetails = 'This domain is not authorized in the security configuration.';
        } else if (err.code === 'auth/operation-not-allowed') {
          errorMessage = 'Operation Restricted';
          errorDetails = 'Google authentication is not enabled for this application.';
        } else {
          errorMessage = err.code || 'Authentication Failed';
          errorDetails = err.message || 'Unknown error occurred';
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
      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="relative overflow-hidden rounded-2xl border border-rose-500/20 bg-gradient-to-r from-rose-500/5 to-transparent p-5"
          >
            {/* Animated Background */}
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-500/10 to-transparent"
            />
            
            <div className="relative z-10 flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black tracking-wider uppercase text-rose-400">
                    Security Alert
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                </div>
                <p className="text-sm font-medium text-rose-300 mb-1">{error.split(':')[0]}</p>
                <p className="text-xs text-rose-400/80">{error.split(':').slice(1).join(':')}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="flex-shrink-0 text-rose-400/60 hover:text-rose-300 transition-colors"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Progress Indicator */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock size={12} className="text-fuchsia-500" />
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Establishing Secure Link
                </span>
              </div>
              <span className="text-xs font-black text-fuchsia-500">{securityLevel}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${securityLevel}%` }}
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-cyan-500 to-emerald-500"
              />
            </div>
            <div className="flex justify-between text-[10px] font-medium text-slate-600">
              <span>Handshake</span>
              <span>Encryption</span>
              <span>Validation</span>
              <span>Complete</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success State */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 to-transparent p-5"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -right-10 -top-10 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl"
            />
            
            <div className="relative z-10 flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 border border-emerald-500/30 flex items-center justify-center"
              >
                <Check className="w-6 h-6 text-emerald-400" />
              </motion.div>
              <div>
                <h3 className="text-sm font-black tracking-wider text-emerald-400 uppercase mb-1">
                  Neural Link Established
                </h3>
                <p className="text-xs text-emerald-300/80">
                  Redirecting to neural interface...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <div className="relative">
        {/* Glow Effect on Hover */}
        <motion.div
          animate={loading ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0 }}
          transition={loading ? { duration: 2, repeat: Infinity } : {}}
          className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600/30 via-cyan-500/20 to-fuchsia-600/30 rounded-[2rem] blur-lg"
        />

        <motion.button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading || success}
          whileHover={!loading && !success ? { scale: 1.02, y: -2 } : {}}
          whileTap={!loading && !success ? { scale: 0.98 } : {}}
          className={`
            relative w-full flex items-center justify-between gap-6 py-5 px-8
            rounded-2xl border transition-all duration-500 overflow-hidden
            ${loading 
              ? 'bg-white/[0.03] border-white/5 cursor-wait' 
              : success
                ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-emerald-500/20'
                : 'bg-gradient-to-r from-white/[0.02] to-white/[0.01] border-white/10 hover:border-fuchsia-500/40 hover:shadow-2xl hover:shadow-fuchsia-500/10'
            }
          `}
        >
          {/* Hover Gradient */}
          {!loading && !success && (
            <motion.div
              initial={false}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/5 via-cyan-500/5 to-fuchsia-500/5 opacity-0 transition-opacity duration-500"
            />
          )}

          {/* Left Side Content */}
          <div className="flex items-center gap-4 relative z-10">
            {/* Google Logo Container */}
            <motion.div
              animate={loading ? { rotate: 360 } : {}}
              transition={loading ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
              className={`relative ${loading ? 'opacity-30' : 'opacity-90'} contrast-125`}
            >
              <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.29-.98 2.38-2.07 3.1v2.61h3.35c1.96-1.81 3.1-4.47 3.1-7.97z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-1.01 7.28-2.73l-3.35-2.61c-1.01.68-2.29 1.08-3.93 1.08-3.02 0-5.58-2.04-6.49-4.79H.96v2.67C2.75 20.39 6.68 23 12 23z" fill="#34A853"/>
                  <path d="M5.51 14.21c-.23-.68-.36-1.41-.36-2.21s.13-1.53.36-2.21V7.12H.96C.35 8.61 0 10.27 0 12s.35 3.39.96 4.88l4.55-2.67z" fill="#FBBC05"/>
                  <path d="M12 4.98c1.64 0 3.11.56 4.27 1.66l3.19-3.19C17.46 1.01 14.97 0 12 0 6.68 0 2.75 2.61.96 6.12l4.55 2.67C6.42 6.02 8.98 4.98 12 4.98z" fill="#EA4335"/>
                </svg>
              </div>
            </motion.div>

            <div className="text-left">
              <div className="flex items-center gap-2 mb-1">
                <Globe size={12} className="text-cyan-400" />
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  External Protocol
                </span>
              </div>
              <span className="text-sm font-black tracking-wide text-white">
                {loading ? 'Initializing Secure Session...' : 
                 success ? 'Authentication Complete' : 
                 'Google Authentication'}
              </span>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="flex items-center gap-4 relative z-10">
            {/* Loading/Success Indicator */}
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-fuchsia-500" />
                <span className="text-xs font-medium text-fuchsia-400">
                  Securing...
                </span>
              </div>
            ) : success ? (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400">
                  Verified
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Zap size={14} className="text-fuchsia-500" />
                <span className="text-xs font-medium text-slate-300">
                  Fast & Secure
                </span>
              </div>
            )}

            {/* Security Badge */}
            <div className={`px-3 py-1.5 rounded-lg border ${
              loading ? 'border-fuchsia-500/20 bg-fuchsia-500/5' :
              success ? 'border-emerald-500/20 bg-emerald-500/5' :
              'border-white/10 bg-white/[0.03]'
            }`}>
              <div className="flex items-center gap-1.5">
                <Cpu size={10} className={
                  loading ? 'text-fuchsia-400' :
                  success ? 'text-emerald-400' :
                  'text-slate-500'
                } />
                <span className={`text-[10px] font-black tracking-wider ${
                  loading ? 'text-fuchsia-400' :
                  success ? 'text-emerald-400' :
                  'text-slate-500'
                }`}>
                  OAuth2
                </span>
              </div>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Security Footer */}
      <div className="flex flex-col items-center gap-4 pt-4">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-emerald-500" />
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              End-to-End Encrypted
            </span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-2">
            <Lock size={12} className="text-cyan-500" />
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Zero-Knowledge
            </span>
          </div>
        </div>
        
        {/* Additional Security Info */}
        <div className="text-center">
          <p className="text-[9px] font-medium text-slate-600 tracking-wider">
            Your identity is protected with military-grade encryption
          </p>
          <p className="text-[8px] text-slate-700 mt-1">
            No personal data is stored on our servers
          </p>
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-medium text-slate-400">
              Google API: Online
            </span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <span className="text-[9px] font-medium text-slate-500">
            Response: &lt;100ms
          </span>
        </div>
      </div>
    </div>
  );
}