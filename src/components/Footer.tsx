"use client";

import React from "react";
import Link from "next/link";
import { Shield, Sparkles, CheckCircle2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/50 backdrop-blur-sm mt-auto py-12 transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-border/20">
          <div className="space-y-3">
            <Link href="/" className="text-lg font-bold tracking-tight select-none">
              <span className="text-foreground">Conver</span>
              <span className="gradient-brand-text">to</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
              Precision document conversion with zero quality loss. Secure, instant, student-friendly.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tools" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Conversion Tools
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Student Pricing
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  User Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
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

          <div>
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
