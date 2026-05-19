"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HelpCircle, FileText, FileSpreadsheet, FileImage,
  Presentation, FileCode, X, ShieldCheck,
  ArrowRight, Zap, Lock, Layers, ChevronRight,
  RefreshCw, Download, Sun, Moon,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

// ─── Format configs ───────────────────────────────────────────────────────────

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
    { label: "DOCX → WEBP", slug: "docx-to-webp" }, { label: "DOCX → CSV",  slug: "docx-to-csv"  },
    { label: "DOCX → JPG",  slug: "docx-to-jpg"  }, { label: "DOCX → PNG",  slug: "docx-to-png"  },
    { label: "DOCX → PPTX", slug: "docx-to-pptx" }, { label: "DOCX → ZIP",  slug: "docx-to-zip"  },
    { label: "DOCX → HEIC", slug: "docx-to-heic" },
  ],
  pptx: [
    { label: "PPTX → PDF",  slug: "pptx-to-pdf"  }, { label: "PPTX → DOCX", slug: "pptx-to-docx" },
    { label: "PPTX → XLSX", slug: "pptx-to-xlsx" }, { label: "PPTX → TXT",  slug: "pptx-to-txt"  },
    { label: "PPTX → JPG",  slug: "pptx-to-jpg"  }, { label: "PPTX → PNG",  slug: "pptx-to-png"  },
    { label: "PPTX → WEBP", slug: "pptx-to-webp" }, { label: "PPTX → HTML", slug: "pptx-to-html" },
    { label: "PPTX → HEIC", slug: "pptx-to-heic" }, { label: "PPTX → CSV",  slug: "pptx-to-csv"  },
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
  const { theme, toggleTheme } = useTheme();
  const [activeFormat, setActiveFormat] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isDark = theme === "dark";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeConfig = FORMAT_CONFIG.find(f => f.id === activeFormat);

  // Theme-aware colors
  const bg        = isDark ? "#080808" : "#f8fafc";
  const bgCard    = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
  const bgCardHov = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const border    = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const textPrim  = isDark ? "#f8fafc" : "#0f172a";
  const textMid   = isDark ? "#e2e8f0" : "#334155";
  const textMute  = isDark ? "#475569" : "#64748b";
  const navBg     = isDark ? "rgba(8,8,8,0.85)"   : "rgba(248,250,252,0.85)";
  const navBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const modalBg   = isDark ? "#0f0f0f" : "#ffffff";
  const modalBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
  const subBtnBg  = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, sans-serif !important; background: ${bg} !important; color: ${textMid} !important; overflow-x: hidden; transition: background 0.3s ease, color 0.3s ease; }
        ::-webkit-scrollbar { width: 6.5px; } ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); border-radius: 4px; }
        .gradient-text { background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .anim-0 { animation: fadeInUp 0.6s ease forwards; }
        .anim-1 { animation: fadeInUp 0.6s 0.1s ease forwards; opacity:0; }
        .anim-2 { animation: fadeInUp 0.6s 0.2s ease forwards; opacity:0; }
        .anim-3 { animation: fadeInUp 0.6s 0.3s ease forwards; opacity:0; }
        .anim-4 { animation: fadeInUp 0.6s 0.4s ease forwards; opacity:0; }
        @keyframes glow { 0%,100%{opacity:0.4} 50%{opacity:0.8} }
        .glow-pulse{animation:glow 3s ease-in-out infinite}
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.95) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .modal-backdrop{animation:fadeIn 0.2s ease}
        .modal-content{animation:scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)}
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        .shimmer { background: linear-gradient(105deg, transparent 40%, ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'} 50%, transparent 60%); background-size:200% 100%; animation:shimmer 2.5s infinite; }
      `}</style>

      <div style={{ background: bg, minHeight: "100vh", color: textMid, transition: "background 0.3s ease", position: "relative" }}>

        {/* ── NAVBAR ── */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50,
          background: scrolled ? navBg : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? `1px solid ${navBorder}` : "1px solid transparent",
          transition: "all 0.3s ease",
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Logo — top left */}
            <Link href="/" style={{ textDecoration: "none", fontSize: "20px", fontWeight: 800, letterSpacing: "-0.03em" }}>
              <span style={{ color: textPrim }}>Conver</span>
              <span className="gradient-text">to</span>
            </Link>

            {/* Right nav actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Visible theme toggle */}
              <button
                onClick={toggleTheme}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "10px", background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)", border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`, color: textMid, cursor: "pointer", fontSize: "13px", fontWeight: 500, transition: "all 0.2s" }}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
                {isDark ? "Light" : "Dark"}
              </button>
              {/* Help */}
              <button onClick={() => setHelpOpen(true)} style={{ padding: "8px 14px", borderRadius: "10px", background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`, color: textMute, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 500, transition: "all 0.2s" }}
                aria-label="Help"
              >
                <HelpCircle size={15} /> Help
              </button>
            </div>
          </div>
        </header>

        {/* ── HERO ── */}
        <section style={{ position: "relative", padding: "80px 24px 60px", textAlign: "center", overflow: "hidden" }}>
          <div className="glow-pulse" style={{ position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)", width: "600px", height: "400px", background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "50px", left: "15%", width: "300px", height: "300px", background: "radial-gradient(ellipse, rgba(168,85,247,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "80px", right: "15%", width: "250px", height: "250px", background: "radial-gradient(ellipse, rgba(236,72,153,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
            <div className="anim-0" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 14px", borderRadius: "100px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#a5b4fc", fontSize: "13px", fontWeight: 500, marginBottom: "24px" }}>
              <Zap size={12} /> Student-Focused File Conversion Platform
            </div>
            <h1 className="anim-1" style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: "20px", color: textPrim }}>
              Convert Any File <span className="gradient-text">Instantly</span>
            </h1>
            <p className="anim-2" style={{ fontSize: "18px", color: textMute, lineHeight: 1.6, marginBottom: "40px", maxWidth: "560px", margin: "0 auto 40px" }}>
              PDF, Word, Excel, PowerPoint, images — convert between 56+ formats with zero quality loss. Built for students, trusted by professionals.
            </p>
            <div className="anim-3" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={() => document.getElementById("formats")?.scrollIntoView({ behavior: "smooth" })}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 28px", borderRadius: "12px", background: "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", color: "#fff", fontSize: "15px", fontWeight: 600, cursor: "pointer", boxShadow: "0 0 30px rgba(99,102,241,0.35)", transition: "all 0.2s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px rgba(99,102,241,0.5)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(99,102,241,0.35)"; }}
              >
                Start Converting <ArrowRight size={16} />
              </button>
            </div>
            <div className="anim-4" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "32px", marginTop: "52px", flexWrap: "wrap" }}>
              {[{ value: "56+", label: "Conversion formats" }, { value: "100%", label: "Free to use" }, { value: "Unlimited", label: "Daily conversions" }].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "22px", fontWeight: 700, color: textPrim, letterSpacing: "-0.02em" }}>{s.value}</div>
                  <div style={{ fontSize: "13px", color: textMute, marginTop: "2px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ── FORMAT PICKER ── */}
        <section id="formats" style={{ padding: "20px 24px 80px", scrollMarginTop: "74px", position: "relative" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: textMute, textTransform: "uppercase", marginBottom: "12px" }}>All Formats</p>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-0.03em", color: textPrim, marginBottom: "12px", lineHeight: 1.1 }}>Pick Your Source Format</h2>
              <p style={{ fontSize: "16px", color: textMute, maxWidth: "480px", margin: "0 auto" }}>Choose any format below to see all available conversion options</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {FORMAT_CONFIG.map(fmt => {
                const Icon = fmt.icon;
                return (
                  <button key={fmt.id} className="shimmer" onClick={() => setActiveFormat(fmt.id)}
                    style={{ padding: "24px", borderRadius: "18px", background: bgCard, border: `1px solid ${border}`, color: textMid, cursor: "pointer", textAlign: "left", position: "relative", overflow: "hidden", transition: "all 0.25s ease" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${fmt.accent}50`; el.style.boxShadow = `0 8px 32px ${fmt.glow}, inset 0 0 0 1px ${fmt.accent}30`; el.style.transform = "translateY(-4px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = border; el.style.boxShadow = "none"; el.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "18px" }}>
                      <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: `${fmt.accent}18`, border: `1px solid ${fmt.accent}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={22} color={fmt.accent} />
                      </div>
                      {fmt.badge && (
                        <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "100px", background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.25)" }}>{fmt.badge}</span>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em", color: textPrim, marginBottom: "4px" }}>{fmt.name}</div>
                        <div style={{ fontSize: "13px", color: textMute }}>{SUB_BUTTONS[fmt.id]?.length ?? 0} conversions available</div>
                      </div>
                      <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: bgCard, display: "flex", alignItems: "center", justifyContent: "center", color: textMute }}>
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section style={{ padding: "60px 24px", borderTop: `1px solid ${border}`, position: "relative" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <h2 style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 700, letterSpacing: "-0.03em", color: textPrim, marginBottom: "12px" }}>Enterprise-Grade. Student-Priced.</h2>
              <p style={{ fontSize: "16px", color: textMute }}>Everything you need, nothing you don't.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
              {[
                { icon: <Lock size={20} color="#6366f1" />, title: "Zero Retention", desc: "Files are processed in-memory and deleted immediately after conversion. No logs, no storage.", accent: "#6366f1" },
                { icon: <Zap size={20} color="#f59e0b" />, title: "Lightning Fast", desc: "Powered by LibreOffice and optimized pipelines. Most conversions complete in under 3 seconds.", accent: "#f59e0b" },
                { icon: <Layers size={20} color="#10b981" />, title: "56+ Formats", desc: "PDF, DOCX, XLSX, PPTX, TXT, JPG, PNG, HEIC, WEBP, GIF, AVIF, HTML, CSV, JSON, XML and more.", accent: "#10b981" },
                { icon: <ShieldCheck size={20} color="#ec4899" />, title: "Secure Transfer", desc: "All uploads use encrypted HTTPS. Optional cloud storage via AWS S3 with pre-signed URLs.", accent: "#ec4899" },
              ].map(f => (
                <div key={f.title} style={{ padding: "24px", borderRadius: "18px", background: bgCard, border: `1px solid ${border}`, transition: "all 0.2s ease" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = bgCardHov; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = bgCard; }}
                >
                  <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: `${f.accent}15`, border: `1px solid ${f.accent}25`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>{f.icon}</div>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: textPrim, marginBottom: "8px" }}>{f.title}</div>
                  <div style={{ fontSize: "14px", color: textMute, lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: `1px solid ${border}`, padding: "24px 0" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <span style={{ fontSize: "13px", color: textMute, fontWeight: 600 }}>© 2026 CONVERTO.</span>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <Link href="/privacy" style={{ fontSize: "13px", color: textMute, textDecoration: "none" }}>Privacy Policy</Link>
              <Link href="/terms"   style={{ fontSize: "13px", color: textMute, textDecoration: "none" }}>Terms of Service</Link>
            </div>
          </div>
        </footer>
      </div>

      {/* ── FORMAT MODAL ── */}
      {activeFormat && activeConfig && (
        <div className="modal-backdrop" style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div onClick={() => setActiveFormat(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }} />
          <div className="modal-content" style={{ position: "relative", zIndex: 10, background: modalBg, border: `1px solid ${modalBorder}`, borderRadius: "24px", width: "100%", maxWidth: "720px", padding: "32px", maxHeight: "85vh", overflow: "hidden", boxShadow: `0 40px 80px rgba(0,0,0,0.8), 0 0 60px ${activeConfig.glow}` }}>
            <button onClick={() => setActiveFormat(null)} style={{ position: "absolute", top: "20px", right: "20px", padding: "8px", borderRadius: "10px", background: bgCard, border: `1px solid ${border}`, color: textMute, cursor: "pointer", display: "flex" }}><X size={16} /></button>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px" }}>
              <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: `${activeConfig.accent}18`, border: `1px solid ${activeConfig.accent}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <activeConfig.icon size={22} color={activeConfig.accent} />
              </div>
              <div>
                <h3 style={{ fontSize: "22px", fontWeight: 700, color: textPrim, letterSpacing: "-0.02em", lineHeight: 1 }}>Convert from {activeFormat.toUpperCase()}</h3>
                <p style={{ fontSize: "13px", color: textMute, marginTop: "4px" }}>{SUB_BUTTONS[activeFormat]?.length} formats available</p>
              </div>
            </div>
            <div style={{ height: "1px", background: border, margin: "20px 0" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px", overflowY: "auto", maxHeight: "55vh", paddingRight: "4px" }}>
              {SUB_BUTTONS[activeFormat]?.map(sub => {
                const [, toFmt] = sub.label.split("→").map(s => s.trim());
                return (
                  <button key={sub.slug} onClick={() => { setActiveFormat(null); router.push(`/convert/${sub.slug}`); }}
                    style={{ padding: "16px 12px", borderRadius: "14px", background: subBtnBg, border: `1px solid ${border}`, color: textMid, cursor: "pointer", textAlign: "center", transition: "all 0.15s ease" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = `${activeConfig.accent}15`; el.style.borderColor = `${activeConfig.accent}40`; el.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = subBtnBg; el.style.borderColor = border; el.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "6px", background: `${activeConfig.accent}20`, color: activeConfig.accent, display: "inline-block", marginBottom: "8px", border: `1px solid ${activeConfig.accent}30` }}>{toFmt}</div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: textPrim, lineHeight: 1.3 }}>{sub.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── HELP MODAL ── */}
      {helpOpen && (
        <div className="modal-backdrop" style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div onClick={() => setHelpOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }} />
          <div className="modal-content" style={{ position: "relative", zIndex: 10, background: modalBg, border: `1px solid ${modalBorder}`, borderRadius: "24px", width: "100%", maxWidth: "520px", padding: "28px", boxShadow: "0 40px 80px rgba(0,0,0,0.8)", maxHeight: "85vh", overflow: "hidden" }}>
            <button onClick={() => setHelpOpen(false)} style={{ position: "absolute", top: "20px", right: "20px", padding: "8px", borderRadius: "10px", background: bgCard, border: `1px solid ${border}`, color: textMute, cursor: "pointer", display: "flex" }}><X size={16} /></button>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: textPrim, marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}><HelpCircle size={18} color="#6366f1" /> FAQ</h3>
            <div style={{ display: "flex", flexDirection: "column", overflowY: "auto", maxHeight: "60vh" }}>
              {[
                { q: "How do I convert a file?", a: "Select your source format from the grid, pick your target output format, drag & drop your file, then click Convert. Download starts instantly." },
                { q: "Are my files stored?", a: "No. Files are processed in-memory and deleted immediately after conversion. We maintain a strict zero-retention policy." },
                { q: "What is Sandbox Mode?", a: "When the LibreOffice container is offline, sandbox mode handles conversions with a styled fallback. All conversions work in production." },
                { q: "What is the file size limit?", a: "Files up to 50 MB are accepted to ensure fast response times and efficient server memory usage." },
              ].map(({ q, a }, i) => (
                <div key={q} style={{ padding: "16px 0", borderBottom: i < 3 ? `1px solid ${border}` : "none" }}>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: textPrim, marginBottom: "6px" }}>{q}</p>
                  <p style={{ fontSize: "13px", color: textMute, lineHeight: 1.6 }}>{a}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setHelpOpen(false)} style={{ marginTop: "20px", width: "100%", padding: "12px", borderRadius: "12px", background: "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
