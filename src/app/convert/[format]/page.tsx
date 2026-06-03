"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  ArrowLeft, UploadCloud, FileText,
  X, RefreshCw, CheckCircle2, AlertCircle,
  Plus, Download, Zap, Info, Monitor, Server
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useConvert, ConvertStatus, ConversionQuality } from "@/hooks/useConvert";
import { useClientConvert } from "@/hooks/useClientConvert";
import { useTheme } from "@/components/ThemeProvider";
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

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const doConvert = useCallback(() => {
    if (mode === "client") {
      convertClient(item.file, config.from, config.to);
    } else {
      convertServer(item.file, config.from, config.to, quality);
    }
  }, [mode, item.file, config.from, config.to, quality, convertClient, convertServer]);

  useEffect(() => {
    if (forceConvert && status === "idle") {
      doConvert();
    }
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
      className={`relative flex flex-col p-6 rounded-[20px] border transition-all duration-200 ${
        status === 'done' 
          ? 'positivus-card-green text-[#191a23]' 
          : status === 'error' 
            ? 'border-rose-500/30 bg-rose-500/[0.02]' 
            : 'positivus-card'
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
            className={`flex items-center justify-center w-14 h-14 rounded-2xl border flex-shrink-0 transition-colors ${
              status === 'done' 
                ? 'bg-white/20' 
                : status === 'error' 
                ? 'bg-rose-500/20 border-rose-500/30' 
                : 'bg-white/10'
            }`}
          >
            {isProcessing ? (
              <RefreshCw size={24} className="text-foreground animate-spin" />
            ) : status === 'done' ? (
              <CheckCircle2 size={24} className="text-[#191a23]" />
            ) : status === 'error' ? (
              <AlertCircle size={24} className="text-rose-500" />
            ) : (
              <FileText size={24} className="text-foreground" />
            )}
          </div>

          <div className="min-w-0 flex-1 sm:flex-initial">
            <p className="text-base font-semibold text-foreground truncate max-w-[240px] sm:max-w-[320px]">
              {status === 'done' ? item.file.name.replace(config.from, config.to) : item.file.name}
            </p>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
              {isProcessing ? (
                <span className="text-foreground">
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

        {/* Right Section: Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-shrink-0">
          {status === "idle" && (
            <>
              <button
                onClick={() => onRemove(item.id)}
                className="touch-target p-2 rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
                aria-label="Remove file"
              >
                <X size={18} />
              </button>
              <button
                onClick={doConvert}
                className="px-6 py-3 rounded-[14px] text-sm font-bold positivus-btn-primary cursor-pointer transition-all"
              >
                Convert
              </button>
            </>
          )}

          {isProcessing && (
            <span 
              className="px-4 py-2 rounded-full text-xs font-bold border select-none positivus-card-green text-[#191a23]"
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
                    className="flex items-center gap-2 px-5 py-3 rounded-[14px] positivus-card-green text-[#191a23] text-sm font-bold hover:bg-white/20 transition-all cursor-pointer"
                  >
                    <Download size={16} /> {isArchiveOutput ? "Download ZIP" : "Download"}
                  </button>
                  {isImageTargetFlow && isArchiveOutput && (
                    <button
                      onClick={downloadAllImagesFromZip}
                      className="flex items-center gap-2 px-5 py-3 rounded-[14px] positivus-card text-sm font-bold hover:bg-secondary transition-all cursor-pointer"
                    >
                      <Download size={16} /> Download All Images
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
                <X size={18} />
              </button>
              <button
                onClick={doConvert}
                className="px-5 py-3 rounded-[14px] bg-rose-500/15 border border-rose-500/30 text-rose-500 text-sm font-bold hover:bg-rose-500/25 transition-all cursor-pointer"
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

  const defaultMode: ConversionMode = getConversionMode(config.from, config.to);
  const tierInfo = getTierInfo(config.from, config.to);
  const isClientCapable = defaultMode === "client";

  const { theme } = useTheme();
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
    <div className="flex flex-col min-h-screen relative bg-background text-foreground transition-colors duration-300">
      
      {/* Global Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 w-full positivus-container py-12">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </Link>

        {/* Heading Panel */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl border flex-shrink-0 positivus-card-green">
                <FileText size={32} className="text-[#191a23]" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                  {config.title}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {mode === "client"
                    ? "100% private — processed in your browser, files never leave your device."
                    : "Convert your files securely with precision fallback mapping."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Mode badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                  mode === "client"
                    ? "positivus-card-green text-[#191a23]"
                    : "bg-blue-500/10 border-blue-500/30 text-blue-600"
                }`}
              >
                {mode === "client" ? <Monitor size={14} /> : <Server size={14} />}
                {mode === "client" ? "In your browser" : "On server"}
              </div>
              {/* Info button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowInfo(!showInfo)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all cursor-pointer"
                  aria-label="Info about processing mode"
                >
                  <Info size={16} />
                </button>
                {showInfo && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowInfo(false)} />
                    <div className="absolute right-0 top-full mt-2 z-50 w-80 p-4 rounded-[14px] border bg-card shadow-xl">
                      <h4 className="text-sm font-bold mb-2">
                        {mode === "client" ? "🖥️ Browser Processing" : "☁️ Server Processing"}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-3">{tierInfo.description}</p>
                      <div className="space-y-1.5 mb-3">
                        <p className="text-xs font-semibold text-emerald-600">Pros:</p>
                        {tierInfo.pros.map((pro, i) => (
                          <p key={i} className="text-xs text-muted-foreground pl-3">✓ {pro}</p>
                        ))}
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-amber-600">Cons:</p>
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
          {/* Controls row */}
          <div className="flex items-center gap-3 flex-wrap">
            {isClientCapable && (
              <div className="inline-flex items-center gap-2 text-xs">
                <span className="text-muted-foreground font-medium">Process:</span>
                <button
                  type="button"
                  onClick={() => setMode("client")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    mode === "client"
                      ? "positivus-card-green text-[#191a23]"
                      : "text-muted-foreground hover:text-foreground bg-secondary"
                  }`}
                >
                  In Browser
                </button>
                <button
                  type="button"
                  onClick={() => setMode("server")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    mode === "server"
                      ? "text-white bg-blue-600"
                      : "text-muted-foreground hover:text-foreground bg-secondary"
                  }`}
                >
                  On Server
                </button>
              </div>
            )}
            {mode === "server" && (
              <div className="inline-flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Quality</span>
                <div className="inline-flex rounded-[14px] border border-border bg-card p-1">
                  <button
                    type="button"
                    onClick={() => setQuality("fast")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      quality === "fast" ? "text-[#191a23]" : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={quality === "fast" ? { background: "#b9ff66" } : undefined}
                  >
                    Fast
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuality("high")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      quality === "high" ? "text-[#191a23]" : "text-muted-foreground hover:text-foreground"
                    }`}
                    style={quality === "high" ? { background: "#b9ff66" } : undefined}
                  >
                    High Quality
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Converter Area */}
        <div {...getRootProps()} className="outline-none">
          <input {...getInputProps()} />
          {dropError && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-[20px] border border-rose-500/30 bg-rose-500/[0.07] px-5 py-4">
              <p className="text-sm font-semibold text-rose-500">{dropError}</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropError(null);
                }}
                className="touch-target p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer"
                aria-label="Dismiss upload error"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {files.length === 0 ? (
            /* Dropzone Empty State */
            <div 
              className={`flex flex-col items-center justify-center text-center p-12 sm:p-20 rounded-[30px] border cursor-pointer transition-all duration-300 select-none ${
                isDragActive ? 'bg-[#b9ff66]/10 border-[#b9ff66]' : 'positivus-card'
              }`}
            >
              <div 
                className="flex items-center justify-center w-20 h-20 rounded-2xl mb-8 transition-all duration-300 positivus-card-green"
              >
                <UploadCloud size={40} className={isDragActive ? "text-[#191a23] animate-bounce" : "text-[#191a23]"} />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mb-3">
                Drag & drop your {config.from.toUpperCase().replace('.','')} file here
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs mb-8">
                or click anywhere on this card to browse files from your local storage.
              </p>

              <div className="flex flex-wrap gap-3 justify-center">
                {mode === "client" ? (
                  <span className="px-4 py-2 rounded-full border text-xs font-bold positivus-card-green text-[#191a23]">
                    No file limit
                  </span>
                ) : (
                  <span className="px-4 py-2 rounded-full bg-secondary border border-border text-xs font-semibold text-muted-foreground">
                    Max {maxUploadMb} MB
                  </span>
                )}
                <span 
                  className="px-4 py-2 rounded-full border text-xs font-bold positivus-card-green text-[#191a23]"
                >
                  {config.from.toUpperCase().replace('.','')} Source
                </span>
                <span className="px-4 py-2 rounded-full bg-secondary border border-border text-xs font-semibold text-muted-foreground">
                  Batch Allowed
                </span>
              </div>
            </div>
          ) : (
            /* File rows listing */
            <div className="space-y-4">
              {isDragActive && (
                <div className="p-8 rounded-[20px] text-center bg-[#b9ff66]/10 border border-[#b9ff66]">
                  <UploadCloud size={24} className="mx-auto mb-2 text-[#b9ff66] animate-bounce" />
                  <p className="text-sm font-bold text-[#b9ff66]">Drop your additional files here...</p>
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

              {/* Conversion Buttons row */}
              {!isDragActive && (
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      open();
                    }}
                    className="flex items-center justify-center gap-2 w-full sm:w-1/2 py-4 px-6 rounded-[14px] bg-secondary hover:bg-secondary/80 border border-border text-sm font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-all duration-200"
                  >
                    <Plus size={18} /> Add More Files
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
                    className="flex items-center justify-center gap-2 w-full sm:w-1/2 py-4 px-6 rounded-[14px] text-sm font-bold positivus-btn-primary cursor-pointer transition-all duration-200"
                  >
                    {allConverted ? (
                      <>
                        <Download size={18} /> {files.length > 1 ? "Download All" : "Download"}
                      </>
                    ) : (
                      <>
                        <Zap size={18} /> {files.length > 1 ? "Convert All" : "Convert"}
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
