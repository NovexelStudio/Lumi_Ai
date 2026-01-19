'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Zap, ArrowLeft, LogOut, 
  Settings, Database, ChevronRight, Binary
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-[#020202] text-slate-300 font-sans selection:bg-fuchsia-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-fuchsia-900/10 to-transparent blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020202_100%)]" />
      </div>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-16">
        
        {/* Top Nav */}
        <nav className="flex items-center justify-between mb-20">
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-all"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Encrypted_Link</span>
          </div>
        </nav>

        {/* Profile Section */}
        <section className="flex flex-col items-center mb-16 text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative mb-6"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-b from-white/10 to-white/[0.02] p-[1px]">
              <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center overflow-hidden">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                ) : (
                  <User size={32} className="text-slate-700" />
                )}
              </div>
            </div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border border-dashed border-fuchsia-500/20 rounded-full pointer-events-none"
            />
          </motion.div>
          
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
            {user?.displayName || 'Neural_Operator'}
          </h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">
            Lumi System Access // <span className="text-fuchsia-500">Tier 1</span>
          </p>
        </section>

        {/* Settings Grid */}
        <div className="space-y-3">
          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] ml-4 mb-4">Core_Settings</p>
          
          <SettingItem 
            icon={<Mail size={18} />} 
            label="Neural Identifier" 
            value={user?.email || 'Not Linked'} 
          />
          
          <SettingItem 
            icon={<Binary size={18} />} 
            label="Encryption Mode" 
            value="End-to-End AES-256" 
          />

          <button className="w-full group flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className="text-slate-500 group-hover:text-cyan-400 transition-colors">
                <Database size={18} />
              </div>
              <div className="text-left">
                <p className="text-[11px] font-black uppercase tracking-widest text-white">Neural Archive</p>
                <p className="text-[9px] font-medium text-slate-500 uppercase">Export conversation logs</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-700 group-hover:text-white transition-colors" />
          </button>

          <div className="pt-8">
            <button 
              onClick={handleLogout}
              className="w-full p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-rose-500 hover:bg-rose-500/10 transition-all flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <LogOut size={16} />
              Terminate Link
            </button>
          </div>
        </div>

        {/* Footer info */}
        <footer className="mt-20 text-center opacity-20">
          <p className="text-[8px] font-black uppercase tracking-[1em] text-white">LUMI_PROTOCOL_V4</p>
        </footer>
      </main>
    </div>
  );
}

function SettingItem({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
      <div className="flex items-center gap-4">
        <div className="text-slate-600">{icon}</div>
        <div className="text-left">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
          <p className="text-xs font-bold text-white tracking-tight">{value}</p>
        </div>
      </div>
    </div>
  );
}