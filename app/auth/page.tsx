'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, Sparkles, ArrowRight, ShieldCheck, Fingerprint,
  Eye, EyeOff, UserPlus, LogIn, Cpu, Key, Globe, Zap,
  Shield, Users, Server, Network, Terminal, Cctv,
  Satellite, Brain, Hash, Database, LockKeyhole
} from 'lucide-react';
import { GoogleSignInButton } from '@/components/GoogleSignInButton';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [securityLevel, setSecurityLevel] = useState(0);

  const isSignup = mode === 'signup';

  // Simulate security level scanning
  useEffect(() => {
    const interval = setInterval(() => {
      setSecurityLevel(prev => prev >= 100 ? 0 : prev + 0.5);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Handle auth logic here
    setTimeout(() => setLoading(false), 2000);
  };

  const PasswordStrengthIndicator = ({ password }: { password: string }) => {
    const getStrength = () => {
      if (password.length === 0) return 0;
      let score = 0;
      if (password.length >= 8) score += 25;
      if (/[A-Z]/.test(password)) score += 25;
      if (/[0-9]/.test(password)) score += 25;
      if (/[^A-Za-z0-9]/.test(password)) score += 25;
      return score;
    };

    const strength = getStrength();
    const getColor = () => {
      if (strength < 50) return 'from-red-500 to-red-400';
      if (strength < 75) return 'from-orange-500 to-yellow-500';
      return 'from-emerald-500 to-green-400';
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Encryption Level</span>
          <span className="text-[10px] font-black text-slate-300">{strength}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${strength}%` }}
            className={`h-full rounded-full bg-gradient-to-r ${getColor()}`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#020202] font-sans">
      {/* Advanced Neural Network Background */}
      <div className="absolute inset-0 z-0">
        {/* Grid with Perspective */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:60px_60px] transform-gpu" />
        
        {/* Animated Data Streams */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-32 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"
            initial={{ 
              top: '-10%',
              left: `${(i + 1) * 12.5}%`,
              opacity: 0
            }}
            animate={{ 
              top: '110%',
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random(),
              delay: i * 0.3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

        {/* Orbital Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] border border-white/[0.02] rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-white/[0.02] rounded-full"
        />
      </div>

      {/* Floating Security Drones */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute z-10"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            rotate: 360
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            left: `${20 + i * 30}%`,
            top: `${30 + i * 20}%`
          }}
        >
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-fuchsia-500/30 to-cyan-500/30 blur-sm" />
        </motion.div>
      ))}

      <motion.div 
        layout
        className="relative z-20 w-full max-w-[1200px] min-h-[750px] flex flex-col lg:flex-row bg-[#080808]/50 backdrop-blur-xl border border-white/[0.08] rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        {/* VISUAL PANEL */}
        <motion.div 
          className="hidden lg:flex w-1/2 relative p-16 flex-col justify-between overflow-hidden bg-gradient-to-br from-black via-[#0a0a0a] to-black"
          animate={{ x: isSignup ? '100%' : '0%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 100 }}
        >
          {/* Scanning Grid Overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#d946ef05_0%,transparent_50%)]" />
            <motion.div
              animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-[linear-gradient(45deg,#00000000_45%,#ffffff05_50%,#00000000_55%)] bg-[size:200%_200%]"
            />
          </div>

          {/* Security Status Bar */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center"
              >
                <Brain size={28} className="text-white" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Neural Interface</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <Terminal size={14} className="text-fuchsia-500" />
                  <span className="text-2xl font-black text-white tracking-tighter">LUMI_CORE</span>
                  <span className="text-xs font-black text-fuchsia-500 px-2 py-0.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20">
                    v4.2.1
                  </span>
                </div>
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-7xl font-black tracking-tighter text-white italic leading-[0.9] mb-4">
                    {isSignup ? 'INITIALIZE' : 'AUTHORIZE'}
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                    <Fingerprint size={20} className="text-fuchsia-500" />
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                  </div>
                </div>
                
                <div className="space-y-4 max-w-sm">
                  <div className="flex items-center gap-3">
                    <Shield size={18} className="text-emerald-500" />
                    <span className="text-sm font-medium text-slate-300">Quantum Encryption Active</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Satellite size={18} className="text-cyan-500" />
                    <span className="text-sm font-medium text-slate-300">Neural Link Secure</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Cctv size={18} className="text-fuchsia-500" />
                    <span className="text-sm font-medium text-slate-300">Biometric Scan Ready</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Security Scan Progress */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Security Protocol Scan</span>
              <span className="text-xs font-black text-slate-300">{Math.round(securityLevel)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.03] overflow-hidden">
              <motion.div
                animate={{ width: `${securityLevel}%` }}
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-cyan-500 to-emerald-500"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
              <span>Firewall</span>
              <span>Encryption</span>
              <span>Authentication</span>
              <span>Secure</span>
            </div>
          </div>
        </motion.div>

        {/* FORM PANEL */}
        <motion.div 
          className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden"
          animate={{ x: isSignup ? '-100%' : '0%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 100 }}
        >
          {/* Form Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
            <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/5 via-transparent to-cyan-500/5 blur-3xl" />
          </div>

          <div className="relative z-10 max-w-md mx-auto w-full space-y-10">
            {/* Form Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center"
                >
                  {isSignup ? <UserPlus size={20} /> : <LogIn size={20} />}
                </motion.div>
                <div>
                  <span className="text-[10px] font-black tracking-[0.3em] text-fuchsia-500 uppercase">
                    {isSignup ? 'Neural_Link_Creation' : 'Access_Protocol'}
                  </span>
                  <h2 className="text-2xl font-black text-white tracking-tight mt-1">
                    {isSignup ? 'Create New Interface' : 'Authenticate Session'}
                  </h2>
                </div>
              </div>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* Email Field */}
                <div className="group">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail size={14} className="text-slate-500" />
                    <label className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                      Neural Interface ID
                    </label>
                  </div>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@neural.network" 
                      className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium text-white outline-none focus:border-fuchsia-500/50 focus:bg-white/[0.03] transition-all placeholder:text-slate-600 placeholder:font-medium tracking-wide"
                      disabled={loading}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Zap size={14} className={email ? 'text-cyan-500' : 'text-slate-700'} />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="group">
                  <div className="flex items-center gap-2 mb-3">
                    <LockKeyhole size={14} className="text-slate-500" />
                    <label className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                      Encryption Key
                    </label>
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••" 
                      className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-6 text-sm font-medium text-white outline-none focus:border-fuchsia-500/50 focus:bg-white/[0.03] transition-all tracking-wider"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {isSignup && password && <PasswordStrengthIndicator password={password} />}
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-bold py-4 rounded-2xl mt-8 flex items-center justify-center gap-3 text-sm tracking-wider group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">
                  {loading 
                    ? 'ESTABLISHING LINK...' 
                    : isSignup 
                      ? 'CREATE NEURAL INTERFACE' 
                      : 'AUTHENTICATE & ENTER'
                  }
                </span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="relative flex justify-center">
                <span className="bg-[#080808] px-6 text-[10px] font-black text-slate-600 uppercase tracking-wider">
                  External Authentication
                </span>
              </div>
            </div>

            {/* External Auth */}
            <div className="space-y-4">
              <GoogleSignInButton />
              
              {/* Additional Auth Options */}
              <button className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                <Globe size={18} className="text-slate-500 group-hover:text-cyan-500 transition-colors" />
                <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                  Enterprise SSO
                </span>
              </button>
            </div>

            {/* Mode Toggle */}
            <div className="text-center pt-8 border-t border-white/10">
              <p className="text-[11px] font-medium text-slate-500">
                {isSignup 
                  ? 'Already have a neural interface?' 
                  : "Need to establish a new link?"
                }{' '}
                <button 
                  onClick={() => setMode(isSignup ? 'login' : 'signup')}
                  className="text-fuchsia-500 hover:text-white font-bold transition-colors ml-2"
                >
                  {isSignup ? 'Switch to Authentication' : 'Create New Interface'}
                </button>
              </p>
            </div>

            {/* Security Footer */}
            <div className="flex items-center justify-center gap-6 text-[10px] font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <Database size={12} className="text-cyan-500" />
                <span>Zero-Knowledge</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={12} className="text-fuchsia-500" />
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Connection Status Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold tracking-wider text-slate-300">
              Neural Network: ONLINE
            </span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <Server size={12} className="text-cyan-500" />
            <span className="text-[11px] font-medium text-slate-400">
              Latency: 12ms
            </span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <Network size={12} className="text-fuchsia-500" />
            <span className="text-[11px] font-medium text-slate-400">
              Nodes: 128
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}