"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sun, Moon, HelpCircle, X, Code, BriefcaseBusiness, Code2, Globe, Mail, MessageCircle } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { AnimatePresence, motion } from "framer-motion";

const SOCIALS = [
  { icon: BriefcaseBusiness, href: "https://linkedin.com/in/sougandhhhhh", label: "LinkedIn" },
  { icon: Code2, href: "https://github.com/sougandhhhhh", label: "GitHub" },
  { icon: Mail, href: "mailto:sougandhhhhh@gmail.com", label: "Email" },
  { icon: MessageCircle, href: "https://discord.com/users/sougandhhhhh", label: "Discord" },
  { icon: Globe, href: "https://sougandhkp.me", label: "Website" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [helpOpen, setHelpOpen] = useState(false);
  const [devOpen, setDevOpen] = useState(false);
  const devRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark";

  useEffect(() => {
    const handleOpenFaq = () => setHelpOpen(true);
    window.addEventListener("open-faq-modal", handleOpenFaq);
    return () => window.removeEventListener("open-faq-modal", handleOpenFaq);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (devRef.current && !devRef.current.contains(e.target as Node)) {
        setDevOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-all duration-300">
        <div className="positivus-container flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight select-none">
              <span className="text-foreground">Conver</span>
              <span className="text-[#b9ff66]">to</span>
            </Link>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Developer Button */}
            <div className="relative" ref={devRef}>
              <button
                onClick={() => setDevOpen(!devOpen)}
                className="touch-target rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all focus:outline-none cursor-pointer"
                aria-label="Developer links"
                title="Developer"
              >
                <Code size={20} />
              </button>
              <AnimatePresence>
                {devOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 z-50 flex items-center gap-1.5 p-2 rounded-xl border border-border bg-card shadow-xl"
                  >
                    {SOCIALS.map(({ icon: Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                        title={label}
                      >
                        <Icon size={18} />
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="touch-target rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all focus:outline-none cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Read FAQ Button (Global) */}
            <button
              onClick={() => setHelpOpen(true)}
              className="touch-target rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all focus:outline-none cursor-pointer"
              aria-label="Read FAQ"
              title="Read FAQ"
            >
              <HelpCircle size={20} />
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
              className="relative w-full max-w-lg bg-card border border-border rounded-[30px] p-8 sm:p-10 max-h-[85vh] overflow-hidden shadow-2xl flex flex-col justify-between"
            >
              <div>
                <button 
                  onClick={() => setHelpOpen(false)}
                  className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all focus:outline-none touch-target"
                >
                  <X size={20} />
                </button>

                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <HelpCircle size={24} className="text-[#b9ff66]" /> Frequently Asked Questions
                </h3>

                <div className="space-y-4 overflow-y-auto max-h-[50vh] pr-2">
                  {[
                    { q: "How do I convert a file?", a: "Select your source format from the grid, pick your target output format, drag & drop your file, then click Convert. Download starts instantly." },
                    { q: "Are my files stored?", a: "No. Files are processed in-memory and deleted immediately after conversion. We maintain a strict zero-retention policy. For Tier 1 conversions (images, text, DOCX→TXT, XLSX→CSV), processing can happen entirely in your browser — files never leave your device." },
                    { q: "What is the file size limit?", a: "Server-side conversions: up to 50 MB per file. Client-side (in-browser) conversions: no file size limit — your device memory is the only constraint." },
                    { q: "What is the difference between Browser and Server mode?", a: "Browser mode processes your files locally using Canvas, pdf-lib, and WASM libraries — 100% private with no upload. Server mode uses professional engines (LibreOffice, Camelot, OCR) for complex conversions. Toggle between them when available." },
                    { q: "Which conversions run in my browser?", a: "Image↔Image, Image→PDF, TXT→any text/PDF, DOCX→TXT/HTML, XLSX→CSV/JSON/XML, HTML→PDF, and Markdown→HTML/PDF/TXT all run client-side by default." },
                  ].map(({ q, a }, idx) => (
                    <div key={idx} className="p-5 rounded-[20px] border border-border positivus-card">
                      <h4 className="text-sm sm:text-base font-bold text-foreground mb-2">{q}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => setHelpOpen(false)}
                className="mt-6 w-full py-4 rounded-[14px] positivus-btn-primary cursor-pointer"
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
