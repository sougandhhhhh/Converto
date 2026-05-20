"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  ArrowLeft, UploadCloud, FileText,
  X, RefreshCw, CheckCircle2, AlertCircle,
  Plus, Download, Zap
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useConvert, ConvertStatus } from "@/hooks/useConvert";
import { useTheme } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
const FALLBACK_VERCEL_LIMIT_MB = 4.5;
const DIRECT_BACKEND_DEFAULT_LIMIT_MB = 50;

function getClientUploadLimitMb(): number {
  const configured = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || "");
  if (Number.isFinite(configured) && configured > 0) return configured;
  const hasDirectBackend = Boolean(process.env.NEXT_PUBLIC_CONVERTO_BACKEND_URL);
  return hasDirectBackend ? DIRECT_BACKEND_DEFAULT_LIMIT_MB : FALLBACK_VERCEL_LIMIT_MB;
}

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
type ConverterConfig = ReturnType<typeof getConfigForSlug>;

function FileRow({ item, config, onRemove, forceConvert, onStatusChange }: {
  item: FileItem; config: ConverterConfig; onRemove: (id: string) => void; forceConvert: boolean;
  onStatusChange?: (id: string, status: ConvertStatus, downloadUrl: string | null, downloadName: string | null) => void;
}) {
  const { convert, status, error, progress, downloadUrl, downloadName } = useConvert();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (forceConvert && status === "idle") convert(item.file, config.from, config.to);
  }, [forceConvert, status, convert, item.file, config.from, config.to]);

  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(item.id, status, downloadUrl, downloadName);
    }
  }, [status, downloadUrl, downloadName, item.id, onStatusChange]);

  const accent = config.accent ?? "#6366f1";
  const isProcessing = status === "uploading" || status === "converting";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`relative flex flex-col p-5 rounded-2xl border transition-all duration-200 ${
        status === 'done' 
          ? 'border-emerald-500/30 bg-emerald-500/[0.02]' 
          : status === 'error' 
            ? 'border-rose-500/30 bg-rose-500/[0.02]' 
            : 'border-border/40 bg-card/60'
      }`}
    >
      {/* Progress bar track */}
      {isProcessing && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary/30">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            className="h-full glow-box"
            style={{
              backgroundColor: accent,
            }}
          />
        </div>
      )}

      {/* Row content */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
        {/* Left Section: Icon + Description */}
        <div className="flex items-center gap-4 w-full sm:w-auto min-w-0">
          <div 
            className="flex items-center justify-center w-11 h-11 rounded-xl border flex-shrink-0 transition-colors"
            style={{
              borderColor: status === 'done' ? 'rgba(16,185,129,0.3)' : status === 'error' ? 'rgba(244,63,94,0.3)' : `${accent}30`,
              backgroundColor: status === 'done' ? 'rgba(16,185,129,0.1)' : status === 'error' ? 'rgba(244,63,94,0.1)' : `${accent}10`,
            }}
          >
            {isProcessing ? (
              <RefreshCw size={18} style={{ color: accent }} className="animate-spin" />
            ) : status === 'done' ? (
              <CheckCircle2 size={18} className="text-emerald-500" />
            ) : status === 'error' ? (
              <AlertCircle size={18} className="text-rose-500" />
            ) : (
              <FileText size={18} style={{ color: accent }} />
            )}
          </div>

          <div className="min-w-0 flex-1 sm:flex-initial">
            <p className="text-sm font-semibold text-foreground truncate max-w-[240px] sm:max-w-[320px]">
              {status === 'done' ? item.file.name.replace(config.from, config.to) : item.file.name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
              {isProcessing ? (
                <span style={{ color: accent }}>
                  {status === 'uploading' ? 'Uploading...' : `Converting to ${config.to.toUpperCase().replace('.','')}... ${Math.min(progress, 100)}%`}
                </span>
              ) : status === 'error' ? (
                <span className="text-rose-500 font-semibold">{error || "Conversion failed"}</span>
              ) : (
                `${(item.file.size / (1024 * 1024)).toFixed(2)} MB`
              )}
            </p>
          </div>
        </div>

        {/* Right Section: Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-shrink-0">
          {status === "idle" && (
            <>
              <button
                onClick={() => onRemove(item.id)}
                className="touch-target p-2 rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                aria-label="Remove file"
              >
                <X size={15} />
              </button>
              <button
                onClick={() => convert(item.file, config.from, config.to)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                  boxShadow: `0 4px 12px ${accent}25`
                }}
              >
                Convert
              </button>
            </>
          )}

          {isProcessing && (
            <span 
              className="px-3 py-1 rounded-full text-[10px] font-bold border select-none"
              style={{
                borderColor: `${accent}30`,
                backgroundColor: `${accent}10`,
                color: accent
              }}
            >
              {Math.min(progress, 100)}%
            </span>
          )}

          {status === "done" && (
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold select-none">
                Done ✓
              </span>
              {downloadUrl && (
                <button
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = downloadUrl;
                    a.download = downloadName || (item.file.name.replace(/\.[^/.]+$/, "") + config.to);
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 transition-all cursor-pointer"
                >
                  <Download size={13} /> Download
                </button>
              )}
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRemove(item.id)}
                className="touch-target p-2 rounded-xl text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                <X size={15} />
              </button>
              <button
                onClick={() => convert(item.file, config.from, config.to)}
                className="px-4 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-500 text-xs font-bold hover:bg-rose-500/25 transition-all cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ConvertPage() {
  const params = useParams();
  const router = useRouter();
  const formatSlug = (params.format as string) || "docx-to-pdf";
  const config = getConfigForSlug(formatSlug);
  const accent = config.accent ?? "#6366f1";

  const { theme } = useTheme();
  const maxUploadMb = getClientUploadLimitMb();
  const maxUploadBytes = Math.floor(maxUploadMb * 1024 * 1024);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [dropError, setDropError] = useState<string | null>(null);
  const [forceConvertAll, setForceConvertAll] = useState(false);
  const [fileStates, setFileStates] = useState<Record<string, { status: ConvertStatus; downloadUrl: string | null; downloadName: string | null }>>({});

  const handleStatusChange = useCallback((id: string, status: ConvertStatus, downloadUrl: string | null, downloadName: string | null) => {
    setFileStates(prev => {
      if (
        prev[id]?.status === status &&
        prev[id]?.downloadUrl === downloadUrl &&
        prev[id]?.downloadName === downloadName
      ) {
        return prev;
      }
      return {
        ...prev,
        [id]: { status, downloadUrl, downloadName }
      };
    });
  }, []);

  const handleRemove = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setFileStates(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }, []);

  const handleDownloadAll = useCallback(() => {
    files.forEach(f => {
      const url = fileStates[f.id]?.downloadUrl;
      if (url) {
        const a = document.createElement("a");
        a.href = url;
        a.download = fileStates[f.id]?.downloadName || (f.file.name.replace(/\.[^/.]+$/, "") + config.to);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    });
  }, [files, fileStates, config.to]);

  const allConverted = files.length > 0 && files.every(f => fileStates[f.id]?.status === "done");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setDropError(null);
      setFiles(prev => [
        ...prev,
        ...acceptedFiles.map(file => ({
          id: Math.random().toString(36).slice(7),
          file
        }))
      ]);
      setForceConvertAll(false);
    }
  }, []);

  const onDropRejected = useCallback(() => {
    setDropError(`Upload limit: max ${maxUploadMb} MB per file.`);
  }, [maxUploadMb]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected,
    accept: config.accept,
    maxSize: maxUploadBytes,
    noClick: files.length > 0,
    multiple: true,
  });

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      
      {/* Global Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={13} /> Back
        </Link>

        {/* Heading Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center justify-center w-11 h-11 rounded-xl border flex-shrink-0"
              style={{
                borderColor: `${accent}30`,
                backgroundColor: `${accent}10`,
              }}
            >
              <FileText size={20} style={{ color: accent }} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {config.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Convert your files securely with precision fallback mapping.
              </p>
            </div>
          </div>


        </div>

        {/* Converter Area */}
        <div {...getRootProps()} className="outline-none">
          <input {...getInputProps()} />
          {dropError && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/[0.07] px-4 py-3">
              <p className="text-xs sm:text-sm font-semibold text-rose-500">{dropError}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropError(null);
                }}
                className="touch-target p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer"
                aria-label="Dismiss upload error"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {files.length === 0 ? (
            /* Dropzone Empty State */
            <div 
              className={`animated-dashed-border flex flex-col items-center justify-center text-center p-12 sm:p-20 rounded-3xl cursor-pointer transition-all duration-300 select-none ${
                isDragActive ? 'bg-indigo-500/[0.03]' : 'bg-card/50'
              }`}
            >
              <div 
                className="flex items-center justify-center w-16 h-16 rounded-2xl border mb-6 transition-all duration-300"
                style={{
                  borderColor: isDragActive ? accent : 'var(--border)',
                  backgroundColor: `${accent}10`,
                }}
              >
                <UploadCloud size={28} style={{ color: accent }} className={isDragActive ? "animate-bounce" : ""} />
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight mb-2">
                Drag & drop your {config.from.toUpperCase().replace('.','')} file here
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mb-8">
                or click anywhere on this card to browse files from your local storage.
              </p>

              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 rounded-full bg-secondary/80 border border-border/40 text-[10px] font-semibold text-muted-foreground">
                  Max {maxUploadMb} MB
                </span>
                <span 
                  className="px-3 py-1 rounded-full border text-[10px] font-bold"
                  style={{
                    borderColor: `${accent}30`,
                    backgroundColor: `${accent}12`,
                    color: accent
                  }}
                >
                  {config.from.toUpperCase().replace('.','')} Source
                </span>
                <span className="px-3 py-1 rounded-full bg-secondary/80 border border-border/40 text-[10px] font-semibold text-muted-foreground">
                  Batch Allowed
                </span>
              </div>
            </div>
          ) : (
            /* File rows listing */
            <div className="space-y-4">
              {isDragActive && (
                <div className="animated-dashed-border p-8 rounded-2xl text-center bg-indigo-500/[0.02]">
                  <UploadCloud size={20} style={{ color: accent }} className="mx-auto mb-2 animate-bounce" />
                  <p className="text-xs font-bold text-indigo-500">Drop your additional files here...</p>
                </div>
              )}

              <div className="space-y-3">
                <AnimatePresence>
                  {files.map(item => (
                    <FileRow 
                      key={item.id} 
                      item={item} 
                      config={config} 
                      onRemove={handleRemove} 
                      forceConvert={forceConvertAll} 
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Conversion Buttons row */}
              {!isDragActive && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      open();
                    }}
                    className="flex items-center justify-center gap-1.5 w-full sm:w-1/2 py-3 px-5 rounded-2xl bg-secondary/80 hover:bg-secondary border border-border/40 text-sm font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-150"
                  >
                    <Plus size={15} /> Add More Files
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (allConverted) {
                        handleDownloadAll();
                      } else {
                        setForceConvertAll(true);
                      }
                    }}
                    className="flex items-center justify-center gap-1.5 w-full sm:w-1/2 py-3 px-5 rounded-2xl text-sm font-bold text-white shadow-lg cursor-pointer transition-all duration-150 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99]"
                    style={{
                      background: allConverted
                        ? "linear-gradient(135deg, #10b981, #059669)"
                        : `linear-gradient(135deg, ${accent}, ${accent}dd)`,
                      boxShadow: allConverted
                        ? "0 8px 24px rgba(16,185,129,0.25)"
                        : `0 8px 24px ${accent}25`
                    }}
                  >
                    {allConverted ? (
                      <>
                        <Download size={15} /> {files.length > 1 ? "Download All" : "Download"}
                      </>
                    ) : (
                      <>
                        <Zap size={15} /> {files.length > 1 ? "Convert All" : "Convert"}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Global Footer */}
      <Footer />



    </div>
  );
}
