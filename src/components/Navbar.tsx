"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sun, Moon, HelpCircle, X } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [helpOpen, setHelpOpen] = useState(false);

  const isDark = theme === "dark";

  useEffect(() => {
    const handleOpenFaq = () => setHelpOpen(true);
    window.addEventListener("open-faq-modal", handleOpenFaq);
    return () => window.removeEventListener("open-faq-modal", handleOpenFaq);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-extrabold tracking-tight select-none">
              <span className="text-foreground">Conver</span>
              <span className="gradient-brand-text">to</span>
            </Link>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="touch-target rounded-full p-2 text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-all focus:outline-none cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Read FAQ Button (Global) */}
            <button
              onClick={() => setHelpOpen(true)}
              className="touch-target rounded-full p-2 text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-all focus:outline-none cursor-pointer"
              aria-label="Read FAQ"
              title="Read FAQ"
            >
              <HelpCircle size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Global FAQ Modal */}
      <AnimatePresence>
        {helpOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHelpOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-lg bg-card border border-border/80 rounded-3xl p-6 sm:p-8 max-h-[85vh] overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              <div>
                <button 
                  onClick={() => setHelpOpen(false)}
                  className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all focus:outline-none touch-target"
                >
                  <X size={16} />
                </button>

                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mb-6 flex items-center gap-2">
                  <HelpCircle size={18} className="text-indigo-500" /> Frequently Asked Questions
                </h3>

                <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-2">
                  {[
                    { q: "How do I convert a file?", a: "Select your source format from the grid, pick your target output format, drag & drop your file, then click Convert. Download starts instantly." },
                    { q: "Are my files stored?", a: "No. Files are processed in-memory and deleted immediately after conversion. We maintain a strict zero-retention policy." },
                    { q: "What is Sandbox Mode?", a: "When the LibreOffice container is offline, sandbox mode handles conversions with a styled fallback. All conversions work in production." },
                    { q: "What is the file size limit?", a: "Files up to 4.5 MB are accepted per file due to Vercel function payload limits." },
                  ].map(({ q, a }, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-border/30 bg-secondary/10">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground mb-1.5">{q}</h4>
                      <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => setHelpOpen(false)}
                className="mt-6 w-full py-3 rounded-xl bg-foreground text-background text-sm font-bold hover:opacity-90 transition-all cursor-pointer"
              >
                Close FAQ
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
