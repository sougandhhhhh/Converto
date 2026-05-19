"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  HelpCircle, ArrowLeft, UploadCloud, FileText,
  X, RefreshCw, CheckCircle2, AlertCircle,
  Plus, Database, ShieldCheck, Download, Zap, Sun, Moon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useConvert } from "@/hooks/useConvert";
import { useTheme } from "@/components/ThemeProvider";

const MIME_TYPES: Record<string, string[]> = {
  ".pdf":  ["application/pdf"],
  ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  ".doc":  ["application/msword"],
  ".pptx": ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  ".ppt":  ["application/vnd.ms-powerpoint"],
  ".xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ".xls":  ["application/vnd.ms-excel"],
  ".csv":  ["text/csv"],
  ".txt":  ["text/plain"],
  ".jpg":  ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".png":  ["image/png"],
  ".webp": ["image/webp"],
  ".heic": ["image/heic"],
  ".html": ["text/html"],
  ".md":   ["text/markdown"],
  ".zip":  ["application/zip"],
  ".odt":  ["application/vnd.oasis.opendocument.text"],
  ".ods":  ["application/vnd.oasis.opendocument.spreadsheet"],
  ".gif":  ["image/gif"],
};

function getConfigForSlug(slug: string) {
  let targetSlug = slug;
  if (slug === "word-to-pdf")  targetSlug = "docx-to-pdf";
  if (slug === "excel-to-pdf") targetSlug = "xlsx-to-pdf";
  if (slug === "ppt-to-pdf")   targetSlug = "pptx-to-pdf";
  if (slug === "jpg-to-pdf")   targetSlug = "jpg-to-pdf";
  if (slug === "pdf-to-word")  targetSlug = "pdf-to-docx";

  const parts = targetSlug.split("-to-");
  if (parts.length !== 2) {
    return { title: "DOCX to PDF", from: ".docx", to: ".pdf", accent: "#8b5cf6", accept: { "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] } };
  }

  const [fromExt, toExt] = parts;
  const from = `.${fromExt}`;
  const to   = `.${toExt}`;

  // Accent color per source format
  const accentMap: Record<string, string> = {
    pdf: "#ef4444", docx: "#8b5cf6", doc: "#8b5cf6", pptx: "#ec4899",
    xlsx: "#10b981", xls: "#10b981", csv: "#10b981", txt: "#3b82f6",
    jpg: "#f59e0b", jpeg: "#f59e0b", png: "#6366f1", webp: "#f59e0b",
    heic: "#64748b", html: "#06b6d4", gif: "#f59e0b",
  };
  const accent = accentMap[fromExt] ?? "#6366f1";

  const acceptTypes = MIME_TYPES[from] || ["*/*"];
  const accept: Record<string, string[]> = {};
  accept[acceptTypes[0]] = [from];
  if (from === ".jpg") accept["image/jpeg"] = [".jpg", ".jpeg"];

  return { title: `${fromExt.toUpperCase()} to ${toExt.toUpperCase()}`, from, to, accept, accent };
}

interface FileItem { id: string; file: File; }

function FileRow({ item, config, onRemove, forceConvert }: {
  item: FileItem; config: any; onRemove: (id: string) => void; forceConvert: boolean;
}) {
  const { convert, status, error, progress, downloadUrl } = useConvert();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  React.useEffect(() => {
    if (forceConvert && status === "idle") convert(item.file, config.from, config.to);
  }, [forceConvert, status, convert, item.file, config.from, config.to]);

  const accent = config.accent ?? "#6366f1";
  const isProcessing = status === "uploading" || status === "converting";

  const rowBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';
  const rowBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const nameColor = isDark ? '#f1f5f9' : '#0f172a';
  const descColor = isDark ? '#94a3b8' : '#475569';
  const closeBtnColor = isDark ? '#94a3b8' : '#475569';

  return (
    <div style={{
      background: rowBg,
      border: status === 'done' ? '1px solid rgba(16,185,129,0.3)' : status === 'error' ? '1px solid rgba(239,68,68,0.3)' : `1px solid ${rowBorder}`,
      borderRadius: '16px',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
    }}>
      {/* Progress bar */}
      {isProcessing && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.05)' }}>
          <div style={{ height: '100%', width: `${Math.min(progress, 100)}%`, background: `linear-gradient(90deg, ${accent}, ${accent}cc)`, transition: 'width 0.3s ease', boxShadow: `0 0 8px ${accent}80` }} />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        {/* Left: icon + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
            background: status === 'done' ? 'rgba(16,185,129,0.15)' : status === 'error' ? 'rgba(239,68,68,0.15)' : `${accent}18`,
            border: status === 'done' ? '1px solid rgba(16,185,129,0.3)' : status === 'error' ? '1px solid rgba(239,68,68,0.3)' : `1px solid ${accent}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {isProcessing ? <RefreshCw size={20} color={accent} style={{ animation: 'spin 1s linear infinite' }} /> :
             status === 'done'  ? <CheckCircle2 size={20} color="#10b981" /> :
             status === 'error' ? <AlertCircle size={20} color="#ef4444" /> :
             <FileText size={20} color={accent} />}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: nameColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '260px' }}>
              {status === 'done' ? item.file.name.replace(config.from, config.to) : item.file.name}
            </p>
            <p style={{ fontSize: '12px', color: descColor, marginTop: '2px' }}>
              {isProcessing ? (
                <span style={{ color: accent }}>{status === 'uploading' ? 'Uploading…' : `Converting to ${config.to.replace('.','').toUpperCase()}… ${Math.min(progress,100)}%`}</span>
              ) : status === 'error' ? (
                <span style={{ color: '#ef4444' }}>{error}</span>
              ) : (
                `${(item.file.size / (1024*1024)).toFixed(2)} MB`
              )}
            </p>
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {status === 'idle' && (
            <>
              <button onClick={() => onRemove(item.id)} style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', color: closeBtnColor, cursor: 'pointer', display: 'flex', transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#ef4444'; (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = closeBtnColor; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              ><X size={16} /></button>
              <button onClick={() => convert(item.file, config.from, config.to)} style={{ padding: '8px 18px', borderRadius: '10px', background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, border: 'none', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', boxShadow: `0 4px 14px ${accent}40` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >Convert</button>
            </>
          )}

          {isProcessing && (
            <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '100px', background: `${accent}20`, color: accent, border: `1px solid ${accent}30`, fontWeight: 600 }}>
              {Math.min(progress,100)}%
            </span>
          )}

          {status === 'done' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '100px', background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', fontWeight: 600 }}>Done ✓</span>
              {downloadUrl && (
                <button onClick={() => {
                  const a = document.createElement("a");
                  a.href = downloadUrl;
                  a.download = item.file.name.replace(/\.[^/.]+$/, "") + config.to;
                  document.body.appendChild(a); a.click(); document.body.removeChild(a);
                }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.25)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.15)'; }}
                ><Download size={14} /> Download</button>
              )}
            </div>
          )}

          {status === 'error' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button onClick={() => onRemove(item.id)} style={{ padding: '8px', borderRadius: '8px', background: 'transparent', border: 'none', color: closeBtnColor, cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
              <button onClick={() => convert(item.file, config.from, config.to)} style={{ padding: '8px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Retry</button>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function ConvertPage() {
  const params = useParams();
  const router = useRouter();
  const formatSlug = (params.format as string) || "docx-to-pdf";
  const config = getConfigForSlug(formatSlug);
  const accent = (config as any).accent ?? "#6366f1";

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [helpOpen, setHelpOpen]         = useState(false);
  const [files, setFiles]               = useState<FileItem[]>([]);
  const [forceConvertAll, setForceConvertAll] = useState(false);
  const [scrolled, setScrolled]         = useState(false);

  // Theme-aware colors
  const bg        = isDark ? "#080808" : "#f8fafc";
  const bgCard    = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
  const border    = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textPrim  = isDark ? "#f8fafc" : "#0f172a";
  const textMid   = isDark ? "#e2e8f0" : "#334155";
  const textMute  = isDark ? "#475569" : "#64748b";
  const navBg     = isDark ? "rgba(8,8,8,0.9)"   : "rgba(248,250,252,0.9)";
  const navBorder = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const modalBg   = isDark ? "#0f0f0f" : "#ffffff";
  const modalBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles(prev => [...prev, ...acceptedFiles.map(file => ({ id: Math.random().toString(36).slice(7), file }))]);
      setForceConvertAll(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: config.accept,
    maxSize: 50 * 1024 * 1024,
    noClick: files.length > 0,
    multiple: true,
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif !important; background: ${bg} !important; color: ${textMid} !important; transition: background 0.3s ease; }
        ::-webkit-scrollbar { width: 6.5px; } ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); border-radius: 4px; }
        .gradient-text { background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .modal-backdrop { animation: fadeIn 0.2s ease; }
        .modal-content { animation: scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
      `}</style>

      <div style={{ background: bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', color: textMid, transition: 'background 0.3s ease' }}>

        {/* ── NAVBAR ── */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: scrolled ? navBg : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? `1px solid ${navBorder}` : '1px solid transparent',
          transition: 'all 0.3s ease',
        }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Logo left */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span onClick={() => router.push('/')} style={{ cursor: 'pointer', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.03em', textDecoration: 'none' }}>
                <span style={{ color: textPrim }}>Conver</span>
                <span className="gradient-text">to</span>
              </span>
              <button onClick={() => router.push('/')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', background: bgCard, border: `1px solid ${border}`, color: textMute, cursor: 'pointer', fontSize: '12px', fontWeight: 500, transition: 'all 0.2s' }}>
                <ArrowLeft size={13} /> Back
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Visible theme toggle */}
              <button onClick={toggleTheme}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`, color: textMid, cursor: 'pointer', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s' }}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
                {isDark ? 'Light' : 'Dark'}
              </button>
              <button onClick={() => setHelpOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`, color: textMute, cursor: 'pointer', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              ><HelpCircle size={18} /></button>
            </div>
          </div>
        </header>

        {/* ── MAIN ── */}
        <main style={{ flex: 1, padding: '40px 24px 60px', maxWidth: '900px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>

          {/* Page header */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${accent}18`, border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} color={accent} />
              </div>
              <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, letterSpacing: '-0.03em', color: textPrim }}>
                {config.title}
              </h1>
            </div>
            <p style={{ fontSize: '14px', color: textMute, paddingLeft: '46px' }}>
              Drop your {config.from.replace('.','').toUpperCase()} files below — convert individually or all at once
            </p>
          </div>

          {/* Dropzone + file list */}
          <div {...getRootProps()} style={{ outline: 'none' }}>
            <input {...getInputProps()} />

            {files.length === 0 ? (
              /* Empty dropzone */
              <div style={{
                border: `2px dashed ${isDragActive ? accent : border}`,
                borderRadius: '20px',
                padding: '64px 32px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', cursor: 'pointer', transition: 'all 0.25s ease',
                background: isDragActive ? `${accent}08` : bgCard,
                boxShadow: isDragActive ? `0 0 40px ${accent}15` : 'none',
              }}
                onMouseEnter={e => { if (files.length === 0) { (e.currentTarget as HTMLElement).style.borderColor = `${accent}60`; (e.currentTarget as HTMLElement).style.background = `${accent}06`; } }}
                onMouseLeave={e => { if (!isDragActive) { (e.currentTarget as HTMLElement).style.borderColor = border; (e.currentTarget as HTMLElement).style.background = bgCard; } }}
              >
                <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: `${accent}15`, border: `1px solid ${accent}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', animation: isDragActive ? 'bounce 0.6s ease infinite' : 'none' }}>
                  <UploadCloud size={32} color={accent} />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: textPrim, marginBottom: '8px', letterSpacing: '-0.02em' }}>
                  Drop your {config.from.replace('.','').toUpperCase()} files here
                </h2>
                <p style={{ fontSize: '14px', color: textMute, marginBottom: '20px' }}>or click anywhere to browse from your computer</p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '100px', background: bgCard, border: `1px solid ${border}`, color: textMute }}>Max 50 MB</span>
                  <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '100px', background: `${accent}15`, border: `1px solid ${accent}25`, color: accent }}>{config.from.replace('.','').toUpperCase()}</span>
                  <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '100px', background: bgCard, border: `1px solid ${border}`, color: textMute }}>Multiple files</span>
                </div>
              </div>
            ) : (
              /* Files list */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {isDragActive && (
                  <div style={{ border: `2px dashed ${accent}`, borderRadius: '14px', padding: '20px', textAlign: 'center', background: `${accent}08` }}>
                    <UploadCloud size={22} color={accent} style={{ margin: '0 auto 6px', display: 'block', animation: 'bounce 0.6s ease infinite' }} />
                    <p style={{ fontSize: '14px', color: accent, fontWeight: 600 }}>Drop more files here…</p>
                  </div>
                )}

                {files.map(item => (
                  <FileRow key={item.id} item={item} config={config} onRemove={id => setFiles(prev => prev.filter(f => f.id !== id))} forceConvert={forceConvertAll} />
                ))}

                {!isDragActive && (
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                    <button onClick={e => { e.stopPropagation(); open(); }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '14px', background: bgCard, border: `1px dashed ${border}`, color: textMute, cursor: 'pointer', fontSize: '14px', fontWeight: 500, transition: 'all 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${accent}50`; (e.currentTarget as HTMLElement).style.color = accent; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = border; (e.currentTarget as HTMLElement).style.color = textMute; }}
                    ><Plus size={16} /> Add more files</button>
                    <button onClick={e => { e.stopPropagation(); setForceConvertAll(true); }} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '14px', background: `linear-gradient(135deg, ${accent}, ${accent}bb)`, border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s', boxShadow: `0 4px 20px ${accent}35` }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                    ><Zap size={16} /> Convert All</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: `1px solid ${border}`, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '13px', color: textMute, fontWeight: 600 }}>© 2026 CONVERTO.</span>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/privacy" style={{ fontSize: '13px', color: textMute, textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms"   style={{ fontSize: '13px', color: textMute, textDecoration: 'none' }}>Terms of Service</Link>
          </div>
        </footer>
      </div>

      {/* ── HELP MODAL ── */}
      {helpOpen && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={() => setHelpOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }} />
          <div className="modal-content" style={{ position: 'relative', zIndex: 10, background: modalBg, border: `1px solid ${modalBorder}`, borderRadius: '24px', width: '100%', maxWidth: '520px', padding: '28px', boxShadow: '0 40px 80px rgba(0,0,0,0.8)', maxHeight: '85vh', overflow: 'hidden' }}>
            <button onClick={() => setHelpOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', padding: '8px', borderRadius: '10px', background: bgCard, border: `1px solid ${border}`, color: textMute, cursor: 'pointer', display: 'flex' }}><X size={16} /></button>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: textPrim, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><HelpCircle size={18} color="#6366f1" /> FAQ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '60vh' }}>
              {[
                { q: 'How do I convert a file?', a: 'Drop or browse your file into the upload zone above, then click Convert. Download starts instantly when done.' },
                { q: 'Are my files stored?', a: 'No — files are processed in-memory and deleted immediately after conversion. Zero retention.' },
                { q: 'What is Sandbox Mode?', a: 'When Gotenberg is offline, our sandbox gracefully handles conversions with a metadata fallback. All formats work in production.' },
                { q: 'File size limit?', a: 'Files up to 50 MB per upload are accepted.' },
              ].map(({ q, a }, i) => (
                <div key={q} style={{ padding: '16px 0', borderBottom: i < 3 ? `1px solid ${border}` : 'none' }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: textPrim, marginBottom: '6px' }}>{q}</p>
                  <p style={{ fontSize: '13px', color: textMute, lineHeight: 1.6 }}>{a}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setHelpOpen(false)} style={{ marginTop: '20px', width: '100%', padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', border: 'none', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
