'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  User, Mail, Zap, ArrowLeft, LogOut, 
  Settings, Database, ChevronRight, Binary,
  Shield, Lock, Globe, Cpu, HardDrive, Bell,
  Eye, EyeOff, Download, Upload, Trash2,
  Key, Users, CreditCard, Moon, Sun, Wifi,
  Activity, Calendar, FileText, Copy, Check,
  Award, Crown, Sparkles, Brain, Network, Terminal,
  Battery, Clock, Hash, Server, Database as DatabaseIcon,
  Layers, ShieldCheck, Fingerprint, QrCode, Scan, MessageSquare
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'billing' | 'data'>('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [storageUsage, setStorageUsage] = useState(68);
  const [monthlyUsage, setMonthlyUsage] = useState(124);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Neural Profile', icon: <User size={14} /> },
    { id: 'security', label: 'Security Core', icon: <Shield size={14} /> },
    { id: 'data', label: 'Data Banks', icon: <Database size={14} /> },
    { id: 'billing', label: 'Quantum Billing', icon: <CreditCard size={14} /> },
  ];

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText('lumiv4-sk-••••••••••••••••••••••');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'Elite': return 'from-purple-500 to-pink-500';
      case 'Pro': return 'from-cyan-500 to-blue-500';
      case 'Basic': return 'from-emerald-500 to-teal-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

  const userTier = 'Pro';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020202] via-[#050505] to-[#020202] text-slate-300 font-sans overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Animated Grid */}
        <motion.div 
          animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), 
                            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Floating Orbs */}
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-fuchsia-500/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tr from-cyan-500/5 to-transparent rounded-full blur-3xl"
        />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-3 py-4 sm:px-4 sm:py-8 md:px-8 lg:px-12">
        {/* Navigation Header */}
        <nav className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="group flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all text-xs sm:text-xs"
          >
            <ArrowLeft size={14} className="text-slate-500 group-hover:text-white transition-colors flex-shrink-0" />
            <span className="hidden sm:inline font-bold tracking-wider text-slate-400 group-hover:text-white transition-colors">
              Return to Interface
            </span>
          </motion.button>

          <div className="flex items-center gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="hidden sm:inline font-bold text-emerald-400">Secure Session</span>
              <span className="sm:hidden font-bold text-emerald-400">Secure</span>
            </div>
            
            <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/[0.02] border border-white/5 text-xs">
              <Clock size={10} className="text-slate-500 flex-shrink-0" />
              <span className="hidden sm:inline font-bold text-slate-400">Uptime: 18h 42m</span>
              <span className="sm:hidden font-bold text-slate-400">18h</span>
            </div>
          </div>
        </nav>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Left Sidebar */}
          <motion.aside 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 space-y-4 sm:space-y-5"
          >
            {/* User Profile Card */}
            <div className="rounded-xl sm:rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent border border-white/5 p-3 sm:p-4">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="relative mb-2 sm:mb-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 bg-gradient-to-r from-fuchsia-500/20 via-cyan-500/20 to-fuchsia-500/20 rounded-3xl blur-sm"
                  />
                  <div className="relative w-14 sm:w-16 h-14 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/10 to-transparent p-[2px]">
                    <div className="w-full h-full rounded-xl sm:rounded-2xl bg-[#020202] flex items-center justify-center overflow-hidden">
                      <img 
                        src="/boy.png"
                        alt="Profile" 
                        className="w-full h-full object-cover rounded-xl sm:rounded-2xl bg-amber-50" 
                      />
                    </div>
                  </div>
                </div>
                
                <h2 className="text-sm sm:text-base font-black text-white mb-0.5">{user?.displayName || 'Neural Operator'}</h2>
                <p className="text-[9px] sm:text-[10px] text-slate-400 mb-2 sm:mb-3">{user?.email || 'operator@neural.net'}</p>
                
                <div className="relative">
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getTierColor(userTier)} text-white text-[10px] font-bold`}>
                    {userTier} Tier
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500"
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <HardDrive size={8} className="text-cyan-500" />
                    <span className="text-[8px] sm:text-[10px] font-medium text-slate-400">Storage</span>
                  </div>
                  <span className="text-[8px] sm:text-[10px] font-bold text-white">{storageUsage}%</span>
                </div>
                <div className="h-0.5 sm:h-1 rounded-full bg-white/[0.03] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${storageUsage}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Activity size={8} className="text-fuchsia-500" />
                    <span className="text-[8px] sm:text-[10px] font-medium text-slate-400">Monthly Usage</span>
                  </div>
                  <span className="text-[8px] sm:text-[10px] font-bold text-white">{monthlyUsage}</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/5 border-l-2 border-fuchsia-500'
                      : 'hover:bg-white/[0.02] border-l-2 border-transparent'
                  }`}
                >
                  <div className={`${activeTab === tab.id ? 'text-fuchsia-500' : 'text-slate-500'} flex-shrink-0`}>
                    {tab.icon}
                  </div>
                  <span className={`text-xs sm:text-sm font-medium truncate ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`}>
                    {tab.label}
                  </span>
                  {activeTab === tab.id && (
                    <ChevronRight size={12} className="ml-auto text-fuchsia-500 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.aside>

          {/* Main Content Area */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 space-y-4 sm:space-y-6"
          >
            {/* Content Header */}
            <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-white/[0.02] to-transparent border border-white/5 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 border border-white/5 flex items-center justify-center flex-shrink-0">
                    {tabs.find(t => t.id === activeTab)?.icon}
                  </div>
                  <div>
                    <h1 className="text-base sm:text-xl font-black text-white">
                      {tabs.find(t => t.id === activeTab)?.label}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
                      Manage your neural interface settings and preferences
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs flex-shrink-0">
                  <span className="hidden sm:inline font-bold text-slate-400">Last updated:</span>
                  <span className="font-bold text-white">Just now</span>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3 sm:space-y-4"
              >
                {activeTab === 'profile' && (
                  <ProfileContent 
                    user={user}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                  />
                )}
                
                {activeTab === 'security' && (
                  <SecurityContent 
                    twoFactorEnabled={twoFactorEnabled}
                    setTwoFactorEnabled={setTwoFactorEnabled}
                    showApiKey={showApiKey}
                    setShowApiKey={setShowApiKey}
                    copied={copied}
                    copyApiKey={copyApiKey}
                  />
                )}
                
                {activeTab === 'data' && (
                  <DataContent 
                    storageUsage={storageUsage}
                    monthlyUsage={monthlyUsage}
                  />
                )}
                
                {activeTab === 'billing' && (
                  <BillingContent userTier={userTier} />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Danger Zone */}
            <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-rose-500/5 to-transparent border border-rose-500/20 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">Terminate Neural Link</h3>
                  <p className="text-xs sm:text-sm text-rose-400/80">
                    This will immediately disconnect you from the neural interface
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* System Footer */}
        <footer className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/5">
          <div className="flex flex-col gap-3 sm:gap-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Brain size={10} className="text-fuchsia-500" />
                <span className="text-xs font-bold text-slate-400">Lumi Core v4.2.1</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2">
                <ShieldCheck size={10} className="text-emerald-500" />
                <span className="text-xs font-bold text-slate-400">256-bit Encryption</span>
              </div>
            </div>
            
            <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-500">
              <span>© 2024 Neural Systems Inc.</span>
              <span className="hidden sm:inline">•</span>
              <span>All rights reserved</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function ProfileContent({ user, isDarkMode, setIsDarkMode }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {/* Account Info */}
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Account Information</h3>
        <div className="space-y-2 sm:space-y-2">
          <InfoField label="Neural ID" value={user?.email || 'Not linked'} icon={<Mail />} />
          <InfoField label="Member Since" value="Nov 15, 2023" icon={<Calendar />} />
          <InfoField label="Access Level" value="Tier 1 Operator" icon={<Award />} />
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">Interface Preferences</h3>
        <div className="space-y-2 sm:space-y-2">
          <ToggleItem
            icon={<Moon />}
            label="Dark Mode"
            description="Reduce eye strain in low-light conditions"
            enabled={isDarkMode}
            onChange={setIsDarkMode}
          />
          <ToggleItem
            icon={<Bell />}
            label="Neural Notifications"
            description="Receive real-time system alerts"
            enabled={true}
            onChange={() => {}}
          />
          <ToggleItem
            icon={<Eye />}
            label="Privacy Mode"
            description="Hide sensitive data in screenshots"
            enabled={false}
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
}

function SecurityContent({ twoFactorEnabled, setTwoFactorEnabled, showApiKey, setShowApiKey, copied, copyApiKey }: any) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* API Key */}
      <div className="rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1">Neural API Key</h3>
            <p className="text-xs sm:text-sm text-slate-500">Use this key to integrate with external systems</p>
          </div>
          <button
            onClick={copyApiKey}
            className="px-3 sm:px-4 py-2 rounded-lg bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors flex items-center gap-2 text-xs font-bold flex-shrink-0 w-full sm:w-auto justify-center sm:justify-start"
          >
            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value="lumiv4-sk-••••••••••••••••••••••"
            readOnly
            className="w-full bg-white/[0.01] border border-white/5 rounded-xl py-3 px-4 font-mono text-sm text-white"
          />
          <button
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
          >
            {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">Two-Factor Authentication</h3>
              <p className="text-xs sm:text-sm text-slate-500">Add an extra layer of security</p>
            </div>
            <ToggleSwitch enabled={twoFactorEnabled} onChange={setTwoFactorEnabled} />
          </div>
          {twoFactorEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/5"
            >
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                  <QrCode size={32} className="text-black" />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-slate-300">Scan with authenticator app</p>
                  <button className="text-xs text-fuchsia-500 hover:text-fuchsia-400 transition-colors">
                    Show backup codes →
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sessions */}
        <div className="rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">Active Sessions</h3>
          <div className="space-y-1.5 sm:space-y-2">
            <SessionItem 
              location="San Francisco, CA" 
              device="Chrome on macOS" 
              current 
            />
            <SessionItem 
              location="New York, NY" 
              device="Mobile Safari" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DataContent({ storageUsage, monthlyUsage }: any) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Storage Overview */}
      <div className="rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Neural Storage</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Total Storage Used</span>
              <span className="font-bold text-white">{storageUsage}%</span>
            </div>
            <div className="h-1 sm:h-2 rounded-full bg-white/[0.03] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${storageUsage}%` }}
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-3">
            <StatCard label="Conversations" value="128" icon={<MessageSquare />} />
            <StatCard label="Documents" value="24" icon={<FileText />} />
            <StatCard label="Media Files" value="8" icon={<Layers />} />
          </div>
        </div>
      </div>

      {/* Data Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        <ActionButton icon={<Download />} label="Export Data" description="Download all your data" />
        <ActionButton icon={<Upload />} label="Import Data" description="Restore from backup" />
        <ActionButton 
          icon={<Trash2 />} 
          label="Clear Cache" 
          description="Free up storage space" 
          variant="danger"
        />
      </div>
    </div>
  );
}

function BillingContent({ userTier }: any) {
  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Current Plan */}
      <div className="rounded-xl sm:rounded-2xl bg-gradient-to-r from-white/[0.02] to-transparent border border-white/5 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">Current Plan</h3>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <div className="text-xl sm:text-2xl font-black text-white mb-1">{userTier} Tier</div>
            <p className="text-xs sm:text-sm text-slate-500">$29/month • Billed annually</p>
          </div>
          <button className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-fuchsia-600 to-cyan-500 text-white font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity w-full sm:w-auto">
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        <UsageCard label="API Calls" value="12,489" limit="100,000" />
        <UsageCard label="Storage" value="4.2GB" limit="50GB" />
        <UsageCard label="Active Models" value="3" limit="5" />
      </div>

      {/* Payment Methods */}
      <div className="rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">Payment Methods</h3>
        <div className="space-y-1.5 sm:space-y-2">
          <PaymentMethod type="visa" last4="4242" expiry="12/24" primary />
          <PaymentMethod type="mastercard" last4="5555" expiry="08/25" />
        </div>
      </div>
    </div>
  );
}

// Helper Components
function InfoField({ label, value, icon }: any) {
  return (
    <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/[0.01] border border-white/5">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="text-slate-500 flex-shrink-0 text-xs sm:text-base">{icon}</div>
        <div className="min-w-0">
          <div className="text-xs font-bold text-slate-400">{label}</div>
          <div className="text-xs sm:text-sm font-medium text-white truncate">{value}</div>
        </div>
      </div>
      <ChevronRight size={12} className="text-slate-700 flex-shrink-0" />
    </div>
  );
}

function ToggleItem({ icon, label, description, enabled, onChange }: any) {
  return (
    <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/[0.01] border border-white/5 gap-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className={`${enabled ? 'text-fuchsia-500' : 'text-slate-500'} flex-shrink-0 text-xs sm:text-base`}>{icon}</div>
        <div className="min-w-0">
          <div className="text-xs sm:text-sm font-medium text-white">{label}</div>
          <div className="text-xs text-slate-500 truncate">{description}</div>
        </div>
      </div>
      <ToggleSwitch enabled={enabled} onChange={onChange} />
    </div>
  );
}

function ToggleSwitch({ enabled, onChange }: any) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-500' : 'bg-white/[0.1]'}`}
    >
      <motion.div
        layout
        className="absolute top-1 w-4 h-4 bg-white rounded-full"
        animate={{ x: enabled ? 28 : 4 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

function SessionItem({ location, device, current }: any) {
  return (
    <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/[0.01] border border-white/5 gap-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Globe size={12} className="text-slate-500 flex-shrink-0" />
        <div className="min-w-0">
          <div className="text-xs sm:text-sm font-medium text-white truncate">{location}</div>
          <div className="text-xs text-slate-500 truncate">{device}</div>
        </div>
      </div>
      {current ? (
        <div className="px-2 py-0.5 sm:py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs flex-shrink-0">
          <span className="text-xs font-bold text-emerald-400">Active</span>
        </div>
      ) : (
        <button className="text-xs text-rose-500 hover:text-rose-400 flex-shrink-0">
          Revoke
        </button>
      )}
    </div>
  );
}

function StatCard({ label, value, icon }: any) {
  return (
    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/[0.01] border border-white/5">
      <div className="flex items-center gap-2 sm:gap-3 mb-2">
        <div className="text-slate-500 text-xs sm:text-base">{icon}</div>
        <div className="text-xs font-bold text-slate-400 truncate">{label}</div>
      </div>
      <div className="text-lg sm:text-2xl font-black text-white">{value}</div>
    </div>
  );
}

function ActionButton({ icon, label, description, variant = 'normal' }: any) {
  const variantClasses: { [key: string]: string } = {
    normal: 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04]',
    danger: 'bg-rose-500/5 border-rose-500/10 hover:bg-rose-500/10'
  };

  return (
    <button className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border ${variantClasses[variant]} transition-colors`}>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className={`${variant === 'danger' ? 'text-rose-500' : 'text-slate-500'} flex-shrink-0 text-xs sm:text-base`}>{icon}</div>
        <div className="text-left">
          <div className={`text-xs sm:text-sm font-bold ${variant === 'danger' ? 'text-rose-400' : 'text-white'}`}>
            {label}
          </div>
          <div className="text-xs text-slate-500">{description}</div>
        </div>
      </div>
    </button>
  );
}

function UsageCard({ label, value, limit }: any) {
  const percentage = (parseInt(value) / parseInt(limit)) * 100;
  
  return (
    <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-white/[0.01] border border-white/5">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="text-xs sm:text-sm font-bold text-slate-400 truncate">{label}</div>
        <div className="text-xs sm:text-sm font-bold text-white flex-shrink-0 truncate">{value}/{limit}</div>
      </div>
      <div className="h-0.5 sm:h-1 rounded-full bg-white/[0.03] overflow-hidden">
        <div 
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    </div>
  );
}

function PaymentMethod({ type, last4, expiry, primary }: any) {
  return (
    <div className="flex items-center justify-between p-2 sm:p-3 rounded-lg sm:rounded-xl bg-white/[0.01] border border-white/5 gap-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="w-8 h-5 sm:w-10 sm:h-6 rounded bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-white">{type === 'visa' ? 'VISA' : 'MC'}</span>
        </div>
        <div className="min-w-0">
          <div className="text-xs sm:text-sm font-medium text-white truncate">•••• {last4}</div>
          <div className="text-xs text-slate-500">Exp {expiry}</div>
        </div>
      </div>
      {primary ? (
        <div className="px-2 py-0.5 sm:py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-xs flex-shrink-0">
          <span className="text-xs font-bold text-fuchsia-400">Primary</span>
        </div>
      ) : (
        <button className="text-xs text-slate-500 hover:text-white flex-shrink-0 whitespace-nowrap">
          Make primary
        </button>
      )}
    </div>
  );
}