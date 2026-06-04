"use client";

import React from "react";
import Link from "next/link";
import { Shield, Sparkles, CheckCircle2, Mail, Globe } from "lucide-react";

const LinkedInIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const GitHubIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const DiscordIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 127.14 96.36" fill="currentColor" width={size} height={size}>
    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.14,46,96,53,91,65.69,84.69,65.69Z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/50 backdrop-blur-sm mt-auto py-12 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top Links */}
        <div className="flex flex-col sm:flex-row justify-between gap-8 pb-8 border-b border-border/20">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight select-none mb-3">
              <img src="/logo.svg" alt="Converto" className="h-6 w-6" />
              <span className="text-foreground">Conver<span className="gradient-brand-text">to</span></span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[180px]">
              Precision document conversion with zero quality loss. Secure, instant, student-friendly.
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Security</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Shield size={13} className="text-indigo-400" /> In-Memory Processing
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Sparkles size={13} className="text-purple-400" /> Encrypted HTTPS
                </span>
              </li>
              <li>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <CheckCircle2 size={13} className="text-emerald-400" /> Zero Logs Policy
                </span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Developer</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://linkedin.com/in/sougandhhhhh" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  <LinkedInIcon size={14} /> LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com/sougandhhhhh" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  <GitHubIcon size={14} /> GitHub
                </a>
              </li>
              <li>
                <a href="https://mail.google.com/mail/u/0/?to=sougandh7ss@gmail.com&su=Hello+from+your+website&fs=1&tf=cm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  <Mail size={14} /> Email
                </a>
              </li>
              <li>
                <a href="https://discord.com/users/sougandhhhhh" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  <DiscordIcon size={14} /> Discord
                </a>
              </li>
              <li>
                <a href="https://sougandhkp.me" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  <Globe size={14} /> Website
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} CONVERTO. All rights reserved.</span>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-semibold select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            All systems operational
          </div>
        </div>

      </div>
    </footer>
  );
}
