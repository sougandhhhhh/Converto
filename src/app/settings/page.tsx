"use client";

import React, { useState } from "react";
import { User, Settings, Key, Shield, Check, Copy, Eye, EyeOff, Sparkles, Moon, Sun, Monitor } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTheme } from "@/components/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"profile" | "preferences" | "api">("profile");

  // Profile Form States
  const [name, setName] = useState("Marcus Vance");
  const [email, setEmail] = useState("marcus.vance@stanford.edu");
  const [university, setUniversity] = useState("Stanford University");

  // API Key States
  const [apiKeys, setApiKeys] = useState<{ id: string; name: string; key: string; created: string; visible: boolean }[]>([
    { id: "1", name: "CS Assignment Pipeline", key: "cvt_live_8f39k2jd7s8d1j9as01", created: "May 10, 2026", visible: false }
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerateKey = () => {
    const newKey = {
      id: Math.random().toString(36).slice(7),
      name: "New Project Key",
      key: `cvt_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`,
      created: "Today",
      visible: false
    };
    setApiKeys(prev => [...prev, newKey]);
  };

  const handleCopyKey = (id: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleKeyVisibility = (id: string) => {
    setApiKeys(prev => prev.map(k => k.id === id ? { ...k, visible: !k.visible } : k));
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      
      {/* Background Decorative glow panels */}
      <div className="absolute top-[10%] right-[-10%] w-[45vw] h-[45vw] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Global Navbar */}
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Block */}
        <div className="mb-10 pb-6 border-b border-border/40">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <Settings size={28} className="text-indigo-500" /> Account <span className="gradient-brand-text">Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
            Manage your personal credentials, customize theme preferences, and access developer API keys.
          </p>
        </div>

        {/* Settings grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* Tab Sidebar */}
          <div className="flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: "profile", label: "Profile Details", icon: User },
              { id: "preferences", label: "Preferences", icon: Settings },
              { id: "api", label: "Developer APIs", icon: Key }
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2.5 px-4 py-3 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap cursor-pointer text-left md:w-full ${
                    isActive
                      ? "bg-secondary text-foreground border-border/60"
                      : "bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  <IconComponent size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Settings Card Content */}
          <div className="md:col-span-3 p-6 sm:p-8 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm shadow-xl min-h-[400px] flex flex-col">
            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  <h2 className="text-lg font-bold tracking-tight text-foreground pb-3 border-b border-border/30">Profile Details</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border/50 text-xs text-foreground focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border/50 text-xs text-foreground focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">University / Institution</label>
                      <input
                        type="text"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border/50 text-xs text-foreground focus:outline-none focus:border-indigo-500/50 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => alert("Profile details saved successfully.")}
                    className="px-5 py-3 rounded-xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-sm"
                  >
                    Save Settings
                  </button>
                </motion.div>
              )}

              {activeTab === "preferences" && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  <h2 className="text-lg font-bold tracking-tight text-foreground pb-3 border-b border-border/30">Theme & Preferences</h2>
                  
                  {/* Theme Switch */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Theme Selection</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "light", label: "Light Mode", icon: Sun },
                        { id: "dark", label: "Dark Mode", icon: Moon },
                        { id: "system", label: "System Sync", icon: Monitor }
                      ].map((t) => {
                        const Icon = t.icon;
                        const isCurrentTheme = theme === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={toggleTheme}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center cursor-pointer transition-all ${
                              isCurrentTheme
                                ? "border-indigo-500/50 bg-indigo-500/[0.03] text-indigo-400 font-semibold"
                                : "border-border/40 bg-background/50 hover:bg-secondary/40 text-muted-foreground"
                            }`}
                          >
                            <Icon size={16} className="mb-2" />
                            <span className="text-[10px] font-semibold">{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Retention Preferences */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-border/30">
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Immediate Log Wipe</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                          Clean cached document list immediately upon page navigation.
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-borderAccent accent-indigo-500" />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "api" && (
                <motion.div
                  key="api"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center pb-3 border-b border-border/30">
                    <h2 className="text-lg font-bold tracking-tight text-foreground">API Credentials</h2>
                    <button
                      onClick={handleGenerateKey}
                      className="px-3.5 py-2 rounded-xl bg-indigo-500 text-white font-bold text-[10px] hover:bg-indigo-600 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles size={11} /> Generate Key
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Integrate the Converto processing backend directly with your Python homework scripts or document pipelines. Refer to our API integration guide.
                  </p>

                  <div className="space-y-3">
                    {apiKeys.map((keyObj) => (
                      <div 
                        key={keyObj.id} 
                        className="flex items-center justify-between p-4 rounded-xl border border-border/30 bg-background/50 gap-4"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-foreground truncate">{keyObj.name}</h4>
                          <div className="flex items-center gap-2 mt-1.5 font-mono text-[10px] text-muted-foreground select-all">
                            {keyObj.visible ? keyObj.key : "cvt_live_••••••••••••••••••••"}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleKeyVisibility(keyObj.id)}
                            className="touch-target p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            aria-label="Toggle visibility"
                          >
                            {keyObj.visible ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button
                            onClick={() => handleCopyKey(keyObj.id, keyObj.key)}
                            className="touch-target p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            aria-label="Copy key"
                          >
                            {copiedId === keyObj.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                          <button
                            onClick={() => handleDeleteKey(keyObj.id)}
                            className="touch-target p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                            aria-label="Delete key"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}

                    {apiKeys.length === 0 && (
                      <p className="text-center py-6 text-xs text-muted-foreground">
                        No active developer credentials. Click Generate Key above to create one.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </main>

      {/* Global Footer */}
      <Footer />

    </div>
  );
}
