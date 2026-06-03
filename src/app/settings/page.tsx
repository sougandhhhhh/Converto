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
    <div className="flex flex-col min-h-screen relative bg-background text-foreground transition-colors duration-300">
      
      {/* Global Navbar */}
      <Navbar />

      <main className="flex-1 w-full positivus-container py-16">
        {/* Header Block */}
        <div className="mb-10 pb-6 border-b border-border">
          <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
            <Settings size={32} className="text-[#b9ff66]" /> Account <span className="text-[#b9ff66]">Settings</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Manage your personal credentials, customize theme preferences, and access developer API keys.
          </p>
        </div>

        {/* Settings grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[40px] max-xl:gap-[30px] items-start">
          
          {/* Tab Sidebar */}
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
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
                  className={`flex items-center gap-3 px-5 py-4 text-sm font-semibold rounded-[14px] border transition-all whitespace-nowrap cursor-pointer text-left md:w-full ${
                    isActive
                      ? "positivus-card-green text-[#191a23] border-[#b9ff66]"
                      : "bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <IconComponent size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Settings Card Content */}
          <div className="md:col-span-3 p-8 sm:p-10 rounded-[30px] border positivus-card shadow-xl min-h-[400px] flex flex-col">
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
                  <h2 className="text-xl font-bold text-foreground pb-4 border-b border-border">Profile Details</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-4 rounded-[14px] bg-background border border-border text-sm text-foreground focus:outline-none focus:border-[#b9ff66] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-4 rounded-[14px] bg-background border border-border text-sm text-foreground focus:outline-none focus:border-[#b9ff66] transition-colors"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">University / Institution</label>
                      <input
                        type="text"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        className="w-full px-4 py-4 rounded-[14px] bg-background border border-border text-sm text-foreground focus:outline-none focus:border-[#b9ff66] transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => alert("Profile details saved successfully.")}
                    className="px-6 py-4 rounded-[14px] positivus-btn-primary font-bold text-sm cursor-pointer"
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
                  <h2 className="text-xl font-bold text-foreground pb-4 border-b border-border">Theme & Preferences</h2>
                  
                  {/* Theme Switch */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Theme Selection</label>
                    <div className="grid grid-cols-3 gap-4">
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
                            className={`flex flex-col items-center justify-center p-6 rounded-[14px] border text-center cursor-pointer transition-all ${
                              isCurrentTheme
                                ? "positivus-card-green text-[#191a23] border-[#b9ff66]"
                                : "positivus-card hover:bg-secondary"
                            }`}
                          >
                            <Icon size={24} className="mb-2" />
                            <span className="text-xs font-semibold">{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Retention Preferences */}
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between p-5 rounded-[14px] bg-secondary/20 border border-border">
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Immediate Log Wipe</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Clean cached document list immediately upon page navigation.
                        </p>
                      </div>
                      <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-border accent-[#b9ff66]" />
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
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <h2 className="text-xl font-bold text-foreground">API Credentials</h2>
                    <button
                      onClick={handleGenerateKey}
                      className="px-5 py-3 rounded-[14px] positivus-btn-primary font-bold text-sm flex items-center gap-2 cursor-pointer"
                    >
                      <Sparkles size={16} /> Generate Key
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Integrate the Converto processing backend directly with your Python homework scripts or document pipelines. Refer to our API integration guide.
                  </p>

                  <div className="space-y-4">
                    {apiKeys.map((keyObj) => (
                      <div 
                        key={keyObj.id} 
                        className="flex items-center justify-between p-5 rounded-[14px] border border-border bg-background/50 gap-4"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-foreground truncate">{keyObj.name}</h4>
                          <div className="flex items-center gap-2 mt-2 font-mono text-xs text-muted-foreground select-all">
                            {keyObj.visible ? keyObj.key : "cvt_live_••••••••••••••••••••"}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleKeyVisibility(keyObj.id)}
                            className="touch-target p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            aria-label="Toggle visibility"
                          >
                            {keyObj.visible ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button
                            onClick={() => handleCopyKey(keyObj.id, keyObj.key)}
                            className="touch-target p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                            aria-label="Copy key"
                          >
                            {copiedId === keyObj.id ? <Check size={16} className="text-[#b9ff66]" /> : <Copy size={16} />}
                          </button>
                          <button
                            onClick={() => handleDeleteKey(keyObj.id)}
                            className="touch-target p-2 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                            aria-label="Delete key"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}

                    {apiKeys.length === 0 && (
                      <p className="text-center py-8 text-sm text-muted-foreground">
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
