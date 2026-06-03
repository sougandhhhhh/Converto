"use client";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function PrivacyPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const bg       = isDark ? "#080808" : "#f8fafc";
  const textPrim = isDark ? "#f8fafc" : "#0f172a";
  const textMid  = isDark ? "#cbd5e1" : "#334155";
  const textMute = isDark ? "#64748b" : "#94a3b8";
  const border   = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const navBg    = isDark ? "rgba(8,8,8,0.9)" : "rgba(248,250,252,0.9)";
  const callout  = isDark ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.05)";
  const calloutBorder = isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.15)";
  const btnBg    = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const btnBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif !important; background: ${bg} !important; transition: background 0.3s ease; }
        .gradient-text { background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        ::-webkit-scrollbar { width: 6.5px; } ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); border-radius: 4px; }
        .nav-btn { transition: all 0.2s ease !important; }
        .nav-btn:hover { box-shadow: 0 4px 14px rgba(99,102,241,0.25) !important; transform: translateY(-1px) !important; }
        .nav-btn:active { transform: scale(0.95) !important; box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important; }
      `}</style>

      <div style={{ background: bg, minHeight: "100vh", display: "flex", flexDirection: "column", color: textMid, transition: "background 0.3s ease" }}>

        {/* Navbar */}
        <header style={{ position: "sticky", top: 0, zIndex: 50, background: navBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${border}` }}>
          <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Logo left */}
            <Link href="/" style={{ textDecoration: "none", fontSize: "18px", fontWeight: 800, letterSpacing: "-0.02em" }}>
              <span style={{ color: textPrim }}>Conver<span className="gradient-text">to</span></span>
            </Link>

            {/* Right actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Visible theme toggle */}
              <button
                onClick={toggleTheme}
                className="nav-btn"
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "10px", background: btnBg, border: `1px solid ${btnBorder}`, color: textMid, cursor: "pointer", fontSize: "13px", fontWeight: 500 }}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
                {isDark ? "Light" : "Dark"}
              </button>
              <Link href="/" className="nav-btn" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "10px", background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: `1px solid ${border}`, color: textMute, textDecoration: "none", fontSize: "13px", fontWeight: 500 }}>
                <ArrowLeft size={14} /> Back
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, maxWidth: "860px", width: "100%", margin: "0 auto", padding: "64px 32px 80px" }}>

          {/* Hero */}
          <div style={{ marginBottom: "52px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "5px 16px", borderRadius: "100px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#a5b4fc", fontSize: "14px", fontWeight: 500, marginBottom: "24px" }}>
              <ShieldCheck size={14} /> Privacy Policy
            </div>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.04em", color: textPrim, lineHeight: 1.08, marginBottom: "20px" }}>
              Your privacy,{" "}<span className="gradient-text">guaranteed</span>
            </h1>
            <p style={{ fontSize: "18px", color: textMute, lineHeight: 1.65, maxWidth: "580px", marginBottom: "16px" }}>
              Converto is built with privacy-first principles. We don't store your files, we don't track you, and we don't sell your data.
            </p>
            <p style={{ fontSize: "13px", color: isDark ? "#334155" : "#94a3b8" }}>Last updated: June 2026</p>
          </div>

          <div style={{ height: "1px", background: `linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)`, marginBottom: "52px" }} />

          {/* TL;DR */}
          <div style={{ padding: "28px 32px", borderRadius: "20px", background: callout, border: `1px solid ${calloutBorder}`, marginBottom: "48px" }}>
            <p style={{ color: "#a5b4fc", fontSize: "16px", lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: "#c7d2fe", fontWeight: 700 }}>TL;DR — </strong>
              Your files are never stored. Everything is processed in-memory and deleted immediately after conversion. We collect zero personal data.
            </p>
          </div>

          {/* Sections */}
          {[
            { title: "1. Client-Side vs Server-Side Processing", content: [
              { type: "p", text: "Converto operates in two modes depending on the conversion type:" },
              { type: "ul", items: [
                "Client-Side (Browser Mode): For image conversions, text conversions, DOCX→TXT/HTML, XLSX→CSV/JSON/XML, and similar Tier 1 formats, processing happens entirely in your browser. Your file never leaves your device — no upload occurs.",
                "Server-Side: For complex conversions (PDF editing, OCR, Camelot table extraction, LibreOffice formats), files are uploaded to our secure backend servers, processed, and the result is returned. Files are never stored on disk.",
              ]},
              { type: "p", text: "You can always see which mode is active via the badge and toggle on the conversion page." },
            ]},
            { title: "2. Information We Collect", content: [
              { type: "p", text: "Converto collects:" },
              { type: "ul", items: [
                "Nothing from you in browser mode — no account, no sign-up, no email required, and no file upload at all.",
                "Temporary file data in server mode — only held in server memory during active conversion processing, never written to disk.",
                "Anonymous usage analytics — aggregate page view counts only, with no personal identifiers.",
              ]},
            ]},
            { title: "3. File Handling & Zero Retention", content: [
              { type: "p", text: "In server mode: when you upload a file for conversion, it is loaded into temporary server memory, processed, and the converted output is returned to your browser. Files are never written to disk and are purged from memory immediately after the conversion response is delivered." },
              { type: "p", text: "In browser mode: your file never leaves your device. The entire conversion process runs in your browser using JavaScript and WASM libraries (pdf-lib, libheif, gif.js, avif-wasm). No data is transmitted over the network." },
              { type: "p", text: "We maintain a strict zero-retention policy across all modes. There is no database storing your files, no cloud backup, and no human access to your conversion data at any time." },
            ]},
            { title: "4. Cookies & Tracking", content: [
              { type: "p", text: "Converto does not use tracking cookies, advertising cookies, or any third-party analytics platforms that identify individual users. Your theme preference (dark/light) is stored in your browser's localStorage only and never transmitted to our servers." },
            ]},
            { title: "5. Third-Party Services", content: [
              { type: "p", text: "Depending on your deployment configuration, Converto may use:" },
              { type: "ul", items: [
                "Gotenberg — a self-hosted LibreOffice container for high-fidelity document conversion. No data is sent to external servers.",
                "AWS S3 / Cloudflare R2 — optional temporary cloud buffer for large files, with automatic deletion after download. Disabled by default.",
              ]},
            ]},
            { title: "6. Security", content: [
              { type: "p", text: "All file uploads and downloads are transmitted over HTTPS (TLS 1.3). Server infrastructure is hardened and access-controlled. Conversion processes are isolated and cannot access each other's data." },
            ]},
            { title: "7. Children's Privacy", content: [
              { type: "p", text: "Converto does not knowingly collect any personal information from children under the age of 13. The service is designed to be fully anonymous and requires no personal data from any user." },
            ]},
            { title: "8. Changes to This Policy", content: [
              { type: "p", text: "We may update this Privacy Policy from time to time. Changes will be reflected by the 'Last updated' date at the top of this page. Continued use of Converto after changes constitutes acceptance of the updated policy." },
            ]},
          ].map((section, si) => (
            <div key={section.title} style={{ marginBottom: "44px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: textPrim, marginBottom: "16px", letterSpacing: "-0.02em" }}>{section.title}</h2>
              {section.content.map((block: any, bi: number) => (
                block.type === "p"
                  ? <p key={bi} style={{ fontSize: "16px", color: textMid, lineHeight: 1.75, marginBottom: "12px" }}>{block.text}</p>
                  : <ul key={bi} style={{ paddingLeft: "22px", display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
                      {block.items.map((item: string, ii: number) => (
                        <li key={ii} style={{ fontSize: "16px", color: textMid, lineHeight: 1.65 }}>{item}</li>
                      ))}
                    </ul>
              ))}
            </div>
          ))}
        </main>

        <footer style={{ borderTop: `1px solid ${border}`, padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <span style={{ fontSize: "14px", color: textMute, fontWeight: 600 }}>© 2026 CONVERTO.</span>
          <div style={{ display: "flex", gap: "24px" }}>
            <Link href="/privacy" style={{ fontSize: "14px", color: "#6366f1", textDecoration: "none", fontWeight: 500 }}>Privacy Policy</Link>
            <Link href="/terms" style={{ fontSize: "14px", color: textMute, textDecoration: "none" }}>Terms of Service</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
