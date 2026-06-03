"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText, FileSpreadsheet, FileImage,
  Presentation, FileCode, X, ShieldCheck,
  ArrowRight, Zap, Lock, Layers, ChevronRight,
  Sparkles, Star, ArrowUpRight
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

// Format configurations
const FORMAT_CONFIG = [
  { id: "pdf",  name: "PDF",  icon: FileText,       accent: "#ef4444", glow: "rgba(239,68,68,0.15)",   badge: "Most Popular" },
  { id: "docx", name: "DOCX", icon: FileText,       accent: "#8b5cf6", glow: "rgba(139,92,246,0.15)",  badge: null },
  { id: "pptx", name: "PPTX", icon: Presentation,   accent: "#ec4899", glow: "rgba(236,72,153,0.15)",  badge: null },
  { id: "xlsx", name: "XLSX", icon: FileSpreadsheet, accent: "#10b981", glow: "rgba(16,185,129,0.15)",  badge: null },
  { id: "txt",  name: "TXT",  icon: FileCode,        accent: "#3b82f6", glow: "rgba(59,130,246,0.15)",  badge: null },
  { id: "jpg",  name: "JPG",  icon: FileImage,       accent: "#f59e0b", glow: "rgba(245,158,11,0.15)",  badge: null },
  { id: "png",  name: "PNG",  icon: FileImage,       accent: "#6366f1", glow: "rgba(99,102,241,0.15)",  badge: null },
  { id: "heic", name: "HEIC", icon: FileImage,       accent: "#64748b", glow: "rgba(100,116,139,0.15)", badge: null },
];

const SUB_BUTTONS: Record<string, { label: string; slug: string }[]> = {
  pdf: [
    { label: "PDF → DOCX",  slug: "pdf-to-docx"  }, { label: "PDF → PPTX",  slug: "pdf-to-pptx"  },
    { label: "PDF → XLSX",  slug: "pdf-to-xlsx"  }, { label: "PDF → TXT",   slug: "pdf-to-txt"   },
    { label: "PDF → JPG",   slug: "pdf-to-jpg"   }, { label: "PDF → PNG",   slug: "pdf-to-png"   },
    { label: "PDF → WEBP",  slug: "pdf-to-webp"  }, { label: "PDF → HTML",  slug: "pdf-to-html"  },
    { label: "PDF → HEIC",  slug: "pdf-to-heic"  }, { label: "PDF → CSV",   slug: "pdf-to-csv"   },
    { label: "PDF → ZIP",   slug: "pdf-to-zip"   },
  ],
  docx: [
    { label: "DOCX → PDF",  slug: "docx-to-pdf"  }, { label: "DOCX → TXT",  slug: "docx-to-txt"  },
    { label: "DOCX → HTML", slug: "docx-to-html" }, { label: "DOCX → XLSX", slug: "docx-to-xlsx" },
    { label: "DOCX → WEBP", slug: "docx-to-webp" },
    { label: "DOCX → JPG",  slug: "docx-to-jpg"  }, { label: "DOCX → PNG",  slug: "docx-to-png"  },
    { label: "DOCX → PPTX", slug: "docx-to-pptx" }, { label: "DOCX → ZIP",  slug: "docx-to-zip"  },
    { label: "DOCX → HEIC", slug: "docx-to-heic" },
  ],
  pptx: [
    { label: "PPTX → PDF",  slug: "pptx-to-pdf"  }, { label: "PPTX → DOCX", slug: "pptx-to-docx" },
    { label: "PPTX → TXT",  slug: "pptx-to-txt"  },
    { label: "PPTX → JPG",  slug: "pptx-to-jpg"  }, { label: "PPTX → PNG",  slug: "pptx-to-png"  },
    { label: "PPTX → WEBP", slug: "pptx-to-webp" }, { label: "PPTX → HTML", slug: "pptx-to-html" },
    { label: "PPTX → HEIC", slug: "pptx-to-heic" },
    { label: "PPTX → ZIP",  slug: "pptx-to-zip"  },
  ],
  xlsx: [
    { label: "XLSX → PDF",  slug: "xlsx-to-pdf"  }, { label: "XLSX → CSV",  slug: "xlsx-to-csv"  },
    { label: "XLSX → TXT",  slug: "xlsx-to-txt"  }, { label: "XLSX → HTML", slug: "xlsx-to-html" },
    { label: "XLSX → DOCX", slug: "xlsx-to-docx" }, { label: "XLSX → JSON", slug: "xlsx-to-json" },
    { label: "XLSX → XML",  slug: "xlsx-to-xml"  }, { label: "XLSX → ZIP",  slug: "xlsx-to-zip"  },
    { label: "XLSX → JPG",  slug: "xlsx-to-jpg"  }, { label: "XLSX → PNG",  slug: "xlsx-to-png"  },
    { label: "XLSX → HEIC", slug: "xlsx-to-heic" },
  ],
  txt: [
    { label: "TXT → PDF",   slug: "txt-to-pdf"   }, { label: "TXT → DOCX",  slug: "txt-to-docx"  },
    { label: "TXT → HTML",  slug: "txt-to-html"  }, { label: "TXT → CSV",   slug: "txt-to-csv"   },
    { label: "TXT → JSON",  slug: "txt-to-json"  }, { label: "TXT → XML",   slug: "txt-to-xml"   },
  ],
  jpg: [
    { label: "JPG → PNG",   slug: "jpg-to-png"   }, { label: "JPG → WEBP",  slug: "jpg-to-webp"  },
    { label: "JPG → PDF",   slug: "jpg-to-pdf"   }, { label: "JPG → GIF",   slug: "jpg-to-gif"   },
    { label: "JPG → DOCX",  slug: "jpg-to-docx"  }, { label: "JPG → HEIC",  slug: "jpg-to-heic"  },
    { label: "JPG → AVIF",  slug: "jpg-to-avif"  },
  ],
  png: [
    { label: "PNG → JPG",   slug: "png-to-jpg"   }, { label: "PNG → WEBP",  slug: "png-to-webp"  },
    { label: "PNG → PDF",   slug: "png-to-pdf"   }, { label: "PNG → GIF",   slug: "png-to-gif"   },
    { label: "PNG → DOCX",  slug: "png-to-docx"  }, { label: "PNG → HEIC",  slug: "png-to-heic"  },
    { label: "PNG → AVIF",  slug: "png-to-avif"  },
  ],
  heic: [
    { label: "HEIC → JPG",  slug: "heic-to-jpg"  }, { label: "HEIC → PNG",  slug: "heic-to-png"  },
    { label: "HEIC → WEBP", slug: "heic-to-webp" }, { label: "HEIC → PDF",  slug: "heic-to-pdf"  },
    { label: "HEIC → GIF",  slug: "heic-to-gif"  }, { label: "HEIC → DOCX", slug: "heic-to-docx" },
    { label: "HEIC → AVIF", slug: "heic-to-avif" },
  ],
};

export default function HomePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [activeFormat, setActiveFormat] = useState<string | null>(null);

  const isDark = theme === "dark";
  const activeConfig = FORMAT_CONFIG.find(f => f.id === activeFormat);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      
      {/* Background Decorative Glow Panels */}
      <div className="absolute top-[-10%] left-[10%] w-[50vw] h-[50vw] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] w-[45vw] h-[45vw] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Global Navbar */}
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Removed badge */}

        {/* Hero Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-6 max-w-4xl"
        >
          Convert Any File <span className="gradient-brand-text">Instantly</span>
        </motion.h1>

        {/* Hero Description */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mb-10"
        >
          PDF, Word, Excel, PowerPoint, images &mdash; convert between 68+ formats with zero quality loss. Built for students, trusted by professionals.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex justify-center gap-4 w-full mb-16"
        >
          <button
            onClick={() => document.getElementById("formats")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-foreground text-background font-semibold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-foreground/10"
          >
            Start Converting <ArrowRight size={16} />
          </button>
          <button
            onClick={() => document.getElementById("formats")?.scrollIntoView({ behavior: "smooth" })}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-foreground/20 text-foreground font-semibold hover:bg-foreground/5 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-foreground/5"
          >
            Browse Formats
          </button>
        </motion.div>

        {/* Statistics Panels */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl p-6 rounded-3xl glassmorphism glass-card border-border/40"
        >
          {[
            { value: "68+", label: "Conversion Formats" },
            { value: "100%", label: "Free to Use" },
            { value: "Unlimited", label: "Daily Conversions" },
            { value: "Zero", label: "File Retention" }
          ].map((stat, i) => (
            <div key={i} className="text-center p-4">
              <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>

      </section>

      {/* ── FORMAT PICKER SECTION ── */}
      <section id="formats" className="px-4 sm:px-6 lg:px-8 py-20 border-t border-border/20 max-w-7xl mx-auto w-full scroll-margin-top-[64px]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Supported Formats</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-3 mb-4">Pick Your Source Format</h2>
          <p className="text-muted-foreground sm:text-lg">Select a source document or media type below to view available targets.</p>
        </div>

        {/* Formats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FORMAT_CONFIG.map((fmt) => {
            const Icon = fmt.icon;
            return (
              <motion.button
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                key={fmt.id}
                onClick={() => setActiveFormat(fmt.id)}
                className="group relative flex flex-col items-start p-6 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm hover:border-foreground/20 hover:shadow-xl hover:shadow-indigo-500/[0.02] text-left cursor-pointer transition-all duration-200 select-none overflow-hidden"
              >
                {/* Glow Accent behind icon on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10"
                  style={{
                    background: `radial-gradient(circle at 10% 20%, ${fmt.glow} 0%, transparent 60%)`
                  }}
                />

                {/* Icon wrapper */}
                <div 
                  className="flex items-center justify-center w-12 h-12 rounded-xl border mb-6 transition-all duration-300"
                  style={{
                    borderColor: `${fmt.accent}30`,
                    backgroundColor: `${fmt.accent}10`,
                  }}
                >
                  <Icon size={20} style={{ color: fmt.accent }} />
                </div>

                {/* Info */}
                <div className="w-full flex items-end justify-between mt-auto">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground mb-1">{fmt.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      {SUB_BUTTONS[fmt.id]?.length ?? 0} targets available
                    </p>
                  </div>
                  <div className="p-1.5 rounded-lg bg-secondary text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                    <ChevronRight size={15} />
                  </div>
                </div>

                {/* Most Popular Badge */}
                {fmt.badge && (
                  <span className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 select-none">
                    <Star size={8} className="fill-current" /> {fmt.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ── BENTO GRID FEATURES ── */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 border-t border-border/20 bg-secondary/20 dark:bg-transparent max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Engineered for Students</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-3 mb-4">Enterprise Performance. Free of Cost.</h2>
          <p className="text-muted-foreground sm:text-lg">Lightning speed, multi-format pipelines, and secure cloud transit.</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Speed */}
          <div className="flex flex-col justify-between p-8 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm hover:border-foreground/10 hover:shadow-lg transition-all duration-300">
            <div>
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-6">
                <Zap size={20} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mb-3">Sub-Second Processing</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Powered by cluster-scaled LibreOffice containers. Conversions complete in under 3 seconds.
              </p>
            </div>
            <span className="mt-8 text-xs font-bold text-muted-foreground">Average conversion speed: 1.8s</span>
          </div>

          {/* Card 2: 68+ Formats */}
          <div className="flex flex-col justify-between p-8 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm hover:border-foreground/10 hover:shadow-lg transition-all duration-300">
            <div>
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mb-6">
                <Layers size={20} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mb-3">Multi-Format Pipeline</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Convert between standard PDFs, document sheets, slideshows, vectors, and web pages without formatting shifts.
              </p>
            </div>
            <Link href="/tools" className="mt-8 flex items-center gap-1 text-xs font-bold text-foreground hover:underline">
              Browse all formats <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Card 3: Secure Cloud Transit */}
          <div className="flex flex-col justify-between p-8 rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm hover:border-foreground/10 hover:shadow-lg transition-all duration-300">
            <div>
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-500 mb-6">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground mb-3">Encrypted Cloud Transit</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                All transport links utilize 256-bit SSL encryption. We coordinate with AWS S3 using presigned URLs to keep files insulated from other server threads during upload transactions.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4 text-xs font-semibold text-muted-foreground">
              <span>SSL/TLS Enforced</span>
              <span>•</span>
              <span>AES-256 Client-Side</span>
            </div>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />

      {/* ── MODALS (FAQ & FORMAT SPECIFICS) ── */}
      <AnimatePresence>
        {activeFormat && activeConfig && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveFormat(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-2xl bg-card border border-border/80 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col justify-between"
            >
              <div>
                <button 
                  onClick={() => setActiveFormat(null)}
                  className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all focus:outline-none touch-target"
                >
                  <X size={16} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="flex items-center justify-center w-12 h-12 rounded-xl border"
                    style={{
                      borderColor: `${activeConfig.accent}30`,
                      backgroundColor: `${activeConfig.accent}12`
                    }}
                  >
                    <activeConfig.icon size={20} style={{ color: activeConfig.accent }} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      Convert from {activeFormat.toUpperCase()}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Select target format to launch converter
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border/40 my-6" />

                {/* Target Options Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {SUB_BUTTONS[activeFormat]?.map((sub) => {
                    const [, toFmt] = sub.label.split("→").map(s => s.trim());
                    return (
                      <button
                        key={sub.slug}
                        onClick={() => {
                          setActiveFormat(null);
                          router.push(`/convert/${sub.slug}`);
                        }}
                        className="group flex flex-col items-center justify-center p-4 rounded-xl border border-border/40 bg-secondary/20 hover:bg-indigo-500/10 hover:border-indigo-500/30 text-center cursor-pointer transition-all duration-150"
                      >
                        <div 
                          className="text-[10px] font-bold px-2 py-0.5 rounded border mb-2 transition-all duration-150"
                          style={{
                            borderColor: `${activeConfig.accent}30`,
                            backgroundColor: `${activeConfig.accent}15`,
                            color: activeConfig.accent
                          }}
                        >
                          {toFmt}
                        </div>
                        <span className="text-xs font-semibold text-foreground group-hover:text-indigo-400 transition-colors">
                          {sub.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
