"use client";

import React from "react";
import Link from "next/link";
import { Shield, Sparkles, CheckCircle2, BriefcaseBusiness, Code2, Globe, Mail, MessageCircle } from "lucide-react";

const SOCIALS = [
  { icon: BriefcaseBusiness, href: "https://linkedin.com/in/sougandhhhhh", label: "LinkedIn" },
  { icon: Code2, href: "https://github.com/sougandhhhhh", label: "GitHub" },
  { icon: Mail, href: "mailto:sougandhhhhh@gmail.com", label: "Email" },
  { icon: MessageCircle, href: "https://discord.com/users/sougandhhhhh", label: "Discord" },
  { icon: Globe, href: "https://sougandhkp.me", label: "Website" },
];

export default function Footer({ className }: { className?: string }) {
  return (
    <footer className={`w-full border-t border-border bg-background/50 backdrop-blur-sm mt-auto py-12 transition-all duration-300 ${className || ''}`}>
      <div className="positivus-container">
        
        {/* Footer Top Links */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 pb-8 border-b border-border">
          <div className="space-y-3">
            <Link href="/" className="text-lg font-bold tracking-tight select-none">
              <span className="text-foreground">Conver</span>
              <span className="text-[#b9ff66]">to</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
              Precision document conversion with zero quality loss. Secure, instant, student-friendly.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Security</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Shield size={16} className="text-[#b9ff66]" /> In-Memory Processing
                </span>
              </li>
              <li>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Sparkles size={16} className="text-[#b9ff66]" /> Encrypted HTTPS
                </span>
              </li>
              <li>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 size={16} className="text-[#b9ff66]" /> Zero Logs Policy
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Legal</h4>
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

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Developer</h4>
            <ul className="space-y-2 text-sm">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon size={16} /> {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} CONVERTO. All rights reserved.</span>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full positivus-card-green text-[#191a23] font-semibold select-none">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#191a23] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#191a23]"></span>
            </span>
            All systems operational
          </div>
        </div>

      </div>
    </footer>
  );
}
