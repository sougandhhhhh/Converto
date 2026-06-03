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
    <div className="flex flex-col min-h-screen relative bg-background text-foreground transition-colors duration-300">
      
      {/* Global Navbar */}
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="positivus-container pt-[70px] max-sm:pt-[40px] mt-[70px] max-sm:mt-[40px]">
        <div className="flex items-center max-md:flex-col justify-between gap-[20px] py-0 relative w-full">
          <div className="flex flex-col gap-[35px] max-xl:gap-[25px] items-start relative shrink-0 flex-1 pb-[34px] max-md:pb-0 max-w-[531px] max-md:max-w-none">
            
            {/* Hero Title */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-medium relative shrink-0 text-[60px]/[normal] max-xl:text-[48px]/[1] whitespace-pre-wrap"
            >
              Convert Any File{"\n"}<span className="text-[#b9ff66] dark:text-[#b9ff66]">Instantly</span>
            </motion.h1>

            {/* Hero Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="font-normal relative shrink-0 text-[20px]/[28px] max-xl:text-[16px]/[24px] max-w-[498px] max-md:max-w-none whitespace-pre-wrap text-muted-foreground"
            >
              PDF, Word, Excel, PowerPoint, images — convert between 68+ formats with zero quality loss. Built for students, trusted by professionals.
            </motion.p>

            {/* Action Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button
                onClick={() => document.getElementById("formats")?.scrollIntoView({ behavior: "smooth" })}
                className="positivus-btn-primary"
              >
                Start Converting
              </button>
            </motion.div>

            {/* Statistics Panels */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="positivus-card rounded-[30px] p-8 grid grid-cols-2 gap-6"
            >
              {[
                { value: "68+", label: "Formats" },
                { value: "100%", label: "Free" },
                { value: "Unlimited", label: "Daily" },
                { value: "Zero", label: "Retention" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero Illustration Area */}
          <div className="relative shrink-0 flex-1 max-md:hidden flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-[600px] aspect-square positivus-card-green rounded-[30px] flex items-center justify-center"
            >
              <div className="text-center p-8">
                <FileText size={120} className="mx-auto mb-4 text-[#191a23]" />
                <p className="text-[#191a23] text-2xl font-bold">Drag & Drop Files</p>
                <p className="text-[#191a23]/70 text-lg mt-2">or click to browse</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FORMAT PICKER SECTION ── */}
      <section id="formats" className="positivus-container mt-[140px] max-lg:mt-[100px] max-sm:mt-[60px] scroll-margin-top-[40px]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Pick Your Source Format</h2>
          <p className="text-muted-foreground text-lg">Select a source document or media type below to view available targets.</p>
        </div>

        {/* Formats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[40px] max-xl:gap-[30px] max-lg:grid-cols-1">
          {FORMAT_CONFIG.map((fmt, index) => {
            const Icon = fmt.icon;
            const isGreen = index % 3 === 0;
            const isDark = index % 3 === 1;
            return (
              <motion.button
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                key={fmt.id}
                onClick={() => setActiveFormat(fmt.id)}
                className={`group relative flex flex-col items-start p-8 rounded-[30px] border text-left cursor-pointer transition-all duration-200 select-none overflow-hidden ${
                  isGreen 
                    ? 'positivus-card-green text-[#191a23]' 
                    : isDark 
                    ? 'positivus-card-dark' 
                    : 'positivus-card'
                }`}
              >
                {/* Icon wrapper */}
                <div 
                  className="flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-white/10"
                >
                  <Icon size={32} className={isGreen || isDark ? "text-[#191a23]" : "text-foreground"} />
                </div>

                {/* Info */}
                <div className="w-full flex items-end justify-between mt-auto">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{fmt.name}</h3>
                    <p className="text-sm opacity-70">
                      {SUB_BUTTONS[fmt.id]?.length ?? 0} targets available
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-white/20">
                    <ChevronRight size={20} />
                  </div>
                </div>

                {/* Most Popular Badge */}
                {fmt.badge && (
                  <span className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
                    <Star size={10} className="fill-current" /> {fmt.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ── BENTO GRID FEATURES ── */}
      <section className="positivus-container mt-[140px] max-lg:mt-[100px] max-sm:mt-[60px]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Enterprise Performance. Free of Cost.</h2>
          <p className="text-muted-foreground text-lg">Lightning speed, multi-format pipelines, and secure cloud transit.</p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[40px] max-xl:gap-[30px]">
          {/* Card 1: Speed */}
          <div className={`flex flex-col justify-between p-8 rounded-[30px] border transition-all duration-300 ${
            true ? 'positivus-card-green text-[#191a23]' : 'positivus-card'
          }`}>
            <div>
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Sub-Second Processing</h3>
              <p className="text-sm leading-relaxed opacity-70">
                Powered by cluster-scaled LibreOffice containers. Conversions complete in under 3 seconds.
              </p>
            </div>
            <span className="mt-8 text-xs font-bold opacity-60">Average conversion speed: 1.8s</span>
          </div>

          {/* Card 2: 68+ Formats */}
          <div className="flex flex-col justify-between p-8 rounded-[30px] border positivus-card transition-all duration-300">
            <div>
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
                <Layers size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Multi-Format Pipeline</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Convert between standard PDFs, document sheets, slideshows, vectors, and web pages without formatting shifts.
              </p>
            </div>
            <Link href="/tools" className="mt-8 flex items-center gap-1 text-xs font-bold text-foreground hover:underline">
              Browse all formats <ArrowUpRight size={13} />
            </Link>
          </div>

          {/* Card 3: Secure Cloud Transit */}
          <div className="flex flex-col justify-between p-8 rounded-[30px] border positivus-card-dark transition-all duration-300">
            <div>
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Encrypted Cloud Transit</h3>
              <p className="text-sm leading-relaxed opacity-70">
                All transport links utilize 256-bit SSL encryption. We coordinate with AWS S3 using presigned URLs to keep files insulated from other server threads during upload transactions.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-4 text-xs font-semibold opacity-60">
              <span>SSL/TLS Enforced</span>
              <span>•</span>
              <span>AES-256 Client-Side</span>
            </div>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer className="mt-[140px] max-lg:mt-[100px] max-sm:mt-[60px]" />

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
              className="relative w-full max-w-2xl bg-card border border-border rounded-[30px] p-8 sm:p-10 max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col justify-between"
            >
              <div>
                <button 
                  onClick={() => setActiveFormat(null)}
                  className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-all focus:outline-none touch-target"
                >
                  <X size={20} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="flex items-center justify-center w-16 h-16 rounded-2xl border positivus-card-green"
                  >
                    <activeConfig.icon size={32} className="text-[#191a23]" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                      Convert from {activeFormat.toUpperCase()}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select target format to launch converter
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border my-6" />

                {/* Target Options Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {SUB_BUTTONS[activeFormat]?.map((sub) => {
                    const [, toFmt] = sub.label.split("→").map(s => s.trim());
                    return (
                      <button
                        key={sub.slug}
                        onClick={() => {
                          setActiveFormat(null);
                          router.push(`/convert/${sub.slug}`);
                        }}
                        className="group flex flex-col items-center justify-center p-6 rounded-[20px] border positivus-card hover:positivus-card-green hover:text-[#191a23] text-center cursor-pointer transition-all duration-200"
                      >
                        <div 
                          className="text-xs font-bold px-3 py-1 rounded bg-white/20 mb-3 transition-all duration-200"
                        >
                          {toFmt}
                        </div>
                        <span className="text-sm font-semibold text-foreground group-hover:text-[#191a23] transition-colors">
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
