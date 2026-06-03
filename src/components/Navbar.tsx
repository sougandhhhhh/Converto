"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sun, Moon, HelpCircle, X, Code, Mail, Globe } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { AnimatePresence, motion } from "framer-motion";

const LinkedInIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GitHubIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const DiscordIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 127.14 96.36" fill="currentColor" width={size} height={size}>
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.14,46,96,53,91,65.69,84.69,65.69Z" />
  </svg>
);

const SOCIALS = [
  { icon: LinkedInIcon, href: "https://linkedin.com/in/sougandhhhhh", label: "LinkedIn" },
  { icon: GitHubIcon, href: "https://github.com/sougandhhhhh", label: "GitHub" },
  { icon: Mail, href: "https://mail.google.com/mail/u/0/?to=sougandh7ss@gmail.com&su=Hello+from+your+website&fs=1&tf=cm", label: "Email" },
  { icon: DiscordIcon, href: "https://discord.com/users/sougandhhhhh", label: "Discord" },
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
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight select-none">
              <img src="/logo.svg" alt="Converto" className="h-7 w-7" />
              <span className="text-foreground">Conver</span>
              <span className="gradient-brand-text">to</span>
            </Link>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Developer Button */}
            <div className="relative" ref={devRef}>
              <button
                onClick={() => setDevOpen(!devOpen)}
                className="touch-target rounded-full p-2 text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-all focus:outline-none cursor-pointer"
                aria-label="Developer links"
                title="Developer"
              >
                <Code size={18} />
              </button>
              <AnimatePresence>
                {devOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 z-50 flex items-center gap-1.5 p-2 rounded-xl border border-border/40 bg-card shadow-xl"
                  >
                    {SOCIALS.map(({ icon: Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all"
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
                    { q: "Are my files stored?", a: "No. Files are processed in-memory and deleted immediately after conversion. We maintain a strict zero-retention policy. For Tier 1 conversions (images, text, DOCX→TXT, XLSX→CSV), processing can happen entirely in your browser — files never leave your device." },
                    { q: "What is the file size limit?", a: "Server-side conversions: up to 50 MB per file. Client-side (in-browser) conversions: no file size limit — your device memory is the only constraint." },
                    { q: "What is the difference between Browser and Server mode?", a: "Browser mode processes your files locally using Canvas, pdf-lib, and WASM libraries — 100% private with no upload. Server mode uses professional engines (LibreOffice, Camelot, OCR) for complex conversions. Toggle between them when available." },
                    { q: "Which conversions run in my browser?", a: "Image↔Image, Image→PDF, TXT→any text/PDF, DOCX→TXT/HTML, XLSX→CSV/JSON/XML, HTML→PDF, and Markdown→HTML/PDF/TXT all run client-side by default." },
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
