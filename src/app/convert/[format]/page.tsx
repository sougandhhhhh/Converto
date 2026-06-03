"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  ArrowLeft, UploadCloud, FileText,
  X, RefreshCw, CheckCircle2, AlertCircle,
  Plus, Download, Zap, Info, Monitor, Server
} from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useConvert, ConvertStatus, ConversionQuality } from "@/hooks/useConvert";
import { useClientConvert } from "@/hooks/useClientConvert";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { getConversionMode, getTierInfo, ConversionMode } from "@/utils/conversionTiers";
import JSZip from "jszip";
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

function FileRow({ item, config, onRemove, forceConvert, quality, mode, onStatusChange }: {
  item: FileItem; config: ConverterConfig; onRemove: (id: string) => void; forceConvert: boolean;
  quality: ConversionQuality; mode: ConversionMode;
  onStatusChange?: (id: string, status: ConvertStatus, downloadUrl: string | null, downloadName: string | null) => void;
}) {
  const serverHook = useConvert();
  const clientHook = useClientConvert();
  const { convert: convertServer, status: serverStatus, error: serverError, progress: serverProgress, downloadUrl: serverUrl, downloadName: serverName } = serverHook;
  const { convert: convertClient, status: clientStatus, error: clientError, progress: clientProgress, downloadUrl: clientUrl, downloadName: clientName } = clientHook;

  const status = mode === "client" ? clientStatus : serverStatus;
  const error = mode === "client" ? clientError : serverError;
  const progress = mode === "client" ? clientProgress : serverProgress;
  const downloadUrl = mode === "client" ? clientUrl : serverUrl;
  const downloadName = mode === "client" ? clientName : serverName;

  const doConvert = useCallback(() => {
    if (mode === "client") {
      convertClient(item.file, config.from, config.to);
    } else {
      convertServer(item.file, config.from, config.to, quality);
    }
  }, [mode, item.file, config.from, config.to, quality, convertClient, convertServer]);

  useEffect(() => {
    if (forceConvert && status === "idle") doConvert();
  }, [forceConvert, status, doConvert]);

  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(item.id, status, downloadUrl, downloadName);
    }
  }, [status, downloadUrl, downloadName, item.id, onStatusChange]);

  const accent = config.accent ?? "#6366f1";
  const isProcessing = status === "uploading" || status === "converting";
  const isArchiveOutput = Boolean(downloadName && downloadName.toLowerCase().endsWith(".zip"));
  const isImageTargetFlow = [".jpg", ".jpeg", ".png", ".webp", ".heic"].includes(config.to);

  const downloadAsFile = useCallback((url: string, name: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  const downloadAllImagesFromZip = useCallback(async () => {
    if (!downloadUrl) return;
    const response = await fetch(downloadUrl);
    const blob = await response.blob();
    const zip = await JSZip.loadAsync(blob);
    const entries = Object.entries(zip.files).filter(([, file]) => !file.dir);
    for (const [name, fileRef] of entries) {
      const fileBlob = await fileRef.async("blob");
      const objectUrl = URL.createObjectURL(fileBlob);
      downloadAsFile(objectUrl, name);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
    }
  }, [downloadUrl, downloadAsFile]);

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
      {isProcessing && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary/30">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            className="h-full glow-box"
            style={{ backgroundColor: accent }}
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
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
                  {mode === 'client'
                    ? `Processing in browser... ${Math.min(progress, 100)}%`
                    : status === 'uploading'
                      ? 'Uploading...'
                      : `Converting to ${config.to.toUpperCase().replace('.','')}... ${Math.min(progress, 100)}%`}
                </span>
              ) : status === 'error' ? (
                <span className="text-rose-500 font-semibold">{error || "Conversion failed"}</span>
              ) : (
                `${(item.file.size / (1024 * 1024)).toFixed(2)} MB`
              )}
            </p>
          </div>
        </div>

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
                onClick={doConvert}
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
              {downloadUrl && (
                <>
                  <button
                    onClick={() => downloadAsFile(downloadUrl, downloadName || (item.file.name.replace(/\.[^/.]+$/, "") + config.to))}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/25 transition-all cursor-pointer"
                  >
                    <Download size={13} /> {isArchiveOutput ? "Download ZIP" : "Download"}
                  </button>
                  {isImageTargetFlow && isArchiveOutput && (
                    <button
                      onClick={downloadAllImagesFromZip}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition-all cursor-pointer"
                    >
                      <Download size={13} /> Download All Images
                    </button>
                  )}
                </>
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
                onClick={doConvert}
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
  const formatSlug = (params.format as string) || "docx-to-pdf";
  const config = getConfigForSlug(formatSlug);
  const accent = config.accent ?? "#6366f1";

  const defaultMode: ConversionMode = getConversionMode(config.from, config.to);
  const tierInfo = getTierInfo(config.from, config.to);
  const isClientCapable = defaultMode === "client";

  const maxUploadMb = getClientUploadLimitMb();
  const maxUploadBytes = Math.floor(maxUploadMb * 1024 * 1024);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [dropError, setDropError] = useState<string | null>(null);
  const [forceConvertAll, setForceConvertAll] = useState(false);
  const [quality, setQuality] = useState<ConversionQuality>("fast");
  const [mode, setMode] = useState<ConversionMode>(defaultMode);
  const [showInfo, setShowInfo] = useState(false);
  const [fileStates, setFileStates] = useState<Record<string, { status: ConvertStatus; downloadUrl: string | null; downloadName: string | null }>>({});

  const handleStatusChange = useCallback((id: string, status: ConvertStatus, downloadUrl: string | null, downloadName: string | null) => {
    setFileStates(prev => {
      if (
        prev[id]?.status === status &&
        prev[id]?.downloadUrl === downloadUrl &&
        prev[id]?.downloadName === downloadName
      ) return prev;
      return { ...prev, [id]: { status, downloadUrl, downloadName } };
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
        ...acceptedFiles.map(file => ({ id: Math.random().toString(36).slice(7), file }))
      ]);
      setForceConvertAll(false);
    }
  }, []);

  const onDropRejected = useCallback(() => {
    if (mode === "client") {
      setDropError("This file type is not supported.");
    } else {
      setDropError(`Upload limit: max ${maxUploadMb} MB per file.`);
    }
  }, [maxUploadMb, mode]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected,
    accept: config.accept,
    maxSize: mode === "client" ? undefined : maxUploadBytes,
    noClick: files.length > 0,
    multiple: true,
  });

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={13} /> Back
        </Link>

        {/* Heading + Mode controls */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
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
                {mode === "client"
                  ? "100% private — processed in your browser, files never leave your device."
                  : "Convert your files securely with precision fallback mapping."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
            {/* Mode badge + Info */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border ${
                mode === "client"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400"
              }`}
            >
              {mode === "client" ? <Monitor size={12} /> : <Server size={12} />}
              {mode === "client" ? "In your browser" : "On server"}
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowInfo(!showInfo)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
                aria-label="Info about processing mode"
              >
                <Info size={14} />
              </button>
              {showInfo && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowInfo(false)} />
                  <div className="absolute right-0 top-full mt-2 z-50 w-80 p-4 rounded-2xl border bg-card shadow-xl">
                    <h4 className="text-sm font-bold mb-2 text-foreground">
                      {mode === "client" ? "Browser Processing" : "Server Processing"}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">{tierInfo.description}</p>
                    <div className="space-y-1.5 mb-3">
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Pros:</p>
                      {tierInfo.pros.map((pro, i) => (
                        <p key={i} className="text-xs text-muted-foreground pl-3">✓ {pro}</p>
                      ))}
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Cons:</p>
                      {tierInfo.cons.map((con, i) => (
                        <p key={i} className="text-xs text-muted-foreground pl-3">△ {con}</p>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls row: Toggle + Quality */}
        <div className="flex items-center gap-3 flex-wrap mb-8">
          {isClientCapable && (
            <div className="inline-flex items-center gap-2">
              <span className="text-[11px] font-semibold text-muted-foreground">Process:</span>
              <div className="inline-flex rounded-xl border border-border/40 bg-card/60 p-1">
                <button
                  type="button"
                  onClick={() => setMode("client")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    mode === "client"
                      ? "text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={mode === "client" ? { background: `linear-gradient(135deg, ${accent}, ${accent}cc)` } : undefined}
                >
                  In Browser
                </button>
                <button
                  type="button"
                  onClick={() => setMode("server")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    mode === "server"
                      ? "text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={mode === "server" ? { background: `linear-gradient(135deg, ${accent}, ${accent}cc)` } : undefined}
                >
                  On Server
                </button>
              </div>
            </div>
          )}
          {mode === "server" && (
            <div className="inline-flex items-center gap-2">
              <span className="text-[11px] font-semibold text-muted-foreground">Quality</span>
              <div className="inline-flex rounded-xl border border-border/40 bg-card/60 p-1">
                <button
                  type="button"
                  onClick={() => setQuality("fast")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    quality === "fast" ? "text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={quality === "fast" ? { background: `linear-gradient(135deg, ${accent}, ${accent}cc)` } : undefined}
                >
                  Fast
                </button>
                <button
                  type="button"
                  onClick={() => setQuality("high")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    quality === "high" ? "text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={quality === "high" ? { background: "linear-gradient(135deg, #14b8a6, #0d9488)" } : undefined}
                >
                  High Quality
                </button>
              </div>
            </div>
          )}
        </div>

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
                {mode === "client" ? (
                  <span 
                    className="px-3 py-1 rounded-full border text-[10px] font-bold"
                    style={{
                      borderColor: `${accent}30`,
                      backgroundColor: `${accent}12`,
                      color: accent
                    }}
                  >
                    No file limit
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-secondary/80 border border-border/40 text-[10px] font-semibold text-muted-foreground">
                    Max {maxUploadMb} MB
                  </span>
                )}
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
                      quality={quality}
                      mode={mode}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </AnimatePresence>
              </div>

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

      <Footer />

    </div>
  );
}
