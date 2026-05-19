"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  HelpCircle, 
  ArrowLeft, 
  UploadCloud, 
  FileText, 
  X, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  Eye, 
  Plus, 
  AlertCircle,
  Sun,
  Moon,
  Database,
  HardDrive,
  ShieldCheck,
  HelpCircle as QuestionIcon
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useConvert } from "@/hooks/useConvert";
import { useTheme } from "@/components/ThemeProvider";

const MIME_TYPES: Record<string, string[]> = {
  ".pdf": ["application/pdf"],
  ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  ".doc": ["application/msword"],
  ".pptx": ["application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  ".ppt": ["application/vnd.ms-powerpoint"],
  ".xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ".xls": ["application/vnd.ms-excel"],
  ".csv": ["text/csv"],
  ".txt": ["text/plain"],
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
  ".png": ["image/png"],
  ".webp": ["image/webp"],
  ".heic": ["image/heic"],
  ".html": ["text/html"],
  ".md": ["text/markdown"],
  ".zip": ["application/zip"],
  ".odt": ["application/vnd.oasis.opendocument.text"],
  ".ods": ["application/vnd.oasis.opendocument.spreadsheet"],
  ".gif": ["image/gif"],
};

function getConfigForSlug(slug: string) {
  let targetSlug = slug;
  if (slug === "word-to-pdf") targetSlug = "docx-to-pdf";
  if (slug === "excel-to-pdf") targetSlug = "xlsx-to-pdf";
  if (slug === "ppt-to-pdf") targetSlug = "pptx-to-pdf";
  if (slug === "jpg-to-pdf") targetSlug = "jpg-to-pdf";
  if (slug === "pdf-to-word") targetSlug = "pdf-to-docx";

  const parts = targetSlug.split("-to-");
  if (parts.length !== 2) {
    return {
      title: "DOCX to PDF",
      from: ".docx",
      to: ".pdf",
      accept: { "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] }
    };
  }

  const [fromExt, toExt] = parts;
  const from = `.${fromExt}`;
  const to = `.${toExt}`;

  const acceptTypes = MIME_TYPES[from] || ["*/*"];
  const accept: Record<string, string[]> = {};
  accept[acceptTypes[0]] = [from];

  if (from === ".jpg") {
    accept["image/jpeg"] = [".jpg", ".jpeg"];
  }

  return {
    title: `${fromExt.toUpperCase()} to ${toExt.toUpperCase()}`,
    from,
    to,
    accept
  };
}

interface FileItem {
  id: string;
  file: File;
}

// Sub-component to handle individual file conversion state using the hook
function FileRow({ item, config, onRemove, forceConvert }: { item: FileItem, config: any, onRemove: (id: string) => void, forceConvert: boolean }) {
  const { convert, status, error, progress, downloadUrl } = useConvert();

  // Trigger conversion when 'Convert All' is pressed at the parent level
  React.useEffect(() => {
    if (forceConvert && status === "idle") {
      convert(item.file, config.from, config.to);
    }
  }, [forceConvert, status, convert, item.file, config.from, config.to]);

  return (
    <div className="bg-white dark:bg-[#211f24] border border-zinc-200 dark:border-[#494551]/50 rounded-lg p-5 relative overflow-hidden transition-all shadow-sm">
      
      {/* Background Progress Bar for Converting State */}
      {(status === "uploading" || status === "converting") && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-100 dark:bg-[#36343a]">
          <div className="h-full bg-purple-600 dark:bg-[#cfbcff] progress-bar-stripes relative transition-all duration-300" style={{ width: `${Math.min(progress, 100)}%` }}>
            <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/20"></div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Side: Icon & Info */}
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded flex items-center justify-center ${
            status === 'done' ? 'bg-green-50 text-green-700 dark:bg-[#1B3B24] dark:text-[#A3E5B5]' : 
            status === 'error' ? 'bg-red-50 text-red-700 dark:bg-[#3B1B1B] dark:text-[#E5A3A3]' : 'bg-purple-50 text-purple-600 dark:bg-[#6750a4]/20 dark:text-[#cfbcff]'
          }`}>
            {(status === 'uploading' || status === 'converting') ? <RefreshCw size={24} className="animate-spin" /> : 
             status === 'done' ? <CheckCircle2 size={24} /> : 
             status === 'error' ? <AlertCircle size={24} /> :
             <FileText size={24} />}
          </div>
          <div>
            <p className="text-zinc-800 dark:text-[#e6e0e9] font-medium truncate max-w-[180px] md:max-w-[240px]">
              {status === 'done' ? item.file.name.replace(config.from, config.to) : item.file.name}
            </p>
            <p className="text-sm text-zinc-500 dark:text-[#948e9c]">
              {status === 'uploading' ? `Uploading...` : 
               status === 'converting' ? `Converting to ${config.to.toUpperCase().replace(".", "")}...` : 
               status === 'error' ? <span className="text-red-500 dark:text-[#E5A3A3]">{error}</span> :
               `${(item.file.size / (1024 * 1024)).toFixed(2)} MB`}
            </p>
          </div>
        </div>

        {/* Right Side: Actions based on state */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          
          {status === "idle" && (
            <>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-[#36343a] dark:text-[#cbc4d2] dark:border-[#494551]/50">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-[#948e9c]"></span> Ready
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => onRemove(item.id)} className="p-2 text-zinc-500 dark:text-[#cbc4d2] hover:text-red-500 transition-colors rounded hover:bg-zinc-100 dark:hover:bg-[#36343a] cursor-pointer">
                  <X size={16} />
                </button>
                <Button onClick={() => convert(item.file, config.from, config.to)} className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-[#cfbcff] dark:hover:bg-[#e9ddff] dark:text-[#381e72]">
                  Convert
                </Button>
              </div>
            </>
          )}

          {(status === "uploading" || status === "converting") && (
            <>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200 dark:bg-[#6750a4]/20 dark:text-[#cfbcff] dark:border-[#cfbcff]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-[#cfbcff] animate-ping"></span> {Math.min(progress, 100)}%
              </span>
            </>
          )}

          {status === "done" && (
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-[#1B3B24] dark:text-[#A3E5B5] dark:border-[#2D5A3A]">
                Done
              </span>
              {downloadUrl && (
                <Button
                  onClick={() => {
                    const a = document.createElement("a");
                    a.href = downloadUrl;
                    a.download = item.file.name.replace(/\.[^/.]+$/, "") + config.to;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-[#cfbcff] dark:hover:bg-[#e9ddff] dark:text-[#381e72] h-8 text-xs px-3 py-1 flex items-center gap-1 font-medium transition-colors cursor-pointer animate-fade-in"
                >
                  Download
                </Button>
              )}
            </div>
          )}

          {status === "error" && (
            <>
              <div className="flex items-center gap-2">
                <button onClick={() => onRemove(item.id)} className="p-2 text-zinc-500 dark:text-[#cbc4d2] hover:text-red-500 transition-colors rounded hover:bg-zinc-100 dark:hover:bg-[#36343a] cursor-pointer">
                  <X size={16} />
                </button>
                <Button onClick={() => convert(item.file, config.from, config.to)} className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-[#cfbcff] dark:hover:bg-[#e9ddff] dark:text-[#381e72]">
                  Retry
                </Button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default function ConvertPage() {
  const params = useParams();
  const router = useRouter();
  const formatSlug = (params.format as string) || "docx-to-pdf";
  const config = getConfigForSlug(formatSlug);

  const { theme, toggleTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [health, setHealth] = useState({
    gotenberg: "checking",
    storage: "checking",
    maxSize: "50 MB"
  });

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch("/api/health");
        if (res.ok) {
          const data = await res.json();
          setHealth(data);
        }
      } catch (err) {
        setHealth({ gotenberg: "offline", storage: "local", maxSize: "50 MB" });
      }
    }
    checkHealth();
  }, [settingsOpen]);

  const [files, setFiles] = useState<FileItem[]>([]);
  const [forceConvertAll, setForceConvertAll] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const newItems = acceptedFiles.map(file => ({
        id: Math.random().toString(36).substring(7),
        file,
      }));
      setFiles(prev => [...prev, ...newItems]);
      setForceConvertAll(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: config.accept,
    maxSize: 50 * 1024 * 1024, // 50MB
    noClick: files.length > 0, // Disable click to upload on the wrapper if files exist
    multiple: true,
  });

  const handleConvertAll = () => {
    setForceConvertAll(true);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="bg-[#f8f9fa] dark:bg-[#141218] text-[#1c1b1f] dark:text-[#e6e0e9] h-screen w-screen flex flex-col font-sans selection:bg-purple-200 dark:selection:bg-[#6750a4] selection:text-purple-900 dark:selection:text-[#e0d2ff] overflow-hidden transition-colors duration-200">
      <header className="bg-white dark:bg-[#141218] border-b border-zinc-200 dark:border-[#494551]/60 flex justify-between items-center w-full px-5 md:px-10 h-16 shrink-0 z-50 transition-colors duration-200">
        <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
          <span className="text-2xl font-bold text-purple-600 dark:text-[#cfbcff] tracking-tight">CONVERTO</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-600 dark:text-[#cbc4d2]">
          <button 
            aria-label="Toggle Theme" 
            onClick={toggleTheme}
            className="hover:bg-zinc-100 dark:hover:bg-[#2b292f] transition-colors p-2 rounded-full flex items-center justify-center cursor-pointer"
          >
            {theme === "dark" ? <Sun size={20} className="text-[#cfbcff]" /> : <Moon size={20} className="text-purple-600" />}
          </button>
          <button 
            aria-label="settings" 
            onClick={() => setSettingsOpen(true)}
            className="hover:bg-zinc-100 dark:hover:bg-[#2b292f] transition-colors p-2 rounded-full flex items-center justify-center cursor-pointer"
          >
            <Settings size={20} />
          </button>
          <button 
            aria-label="help" 
            onClick={() => setHelpOpen(true)}
            className="hover:bg-zinc-100 dark:hover:bg-[#2b292f] transition-colors p-2 rounded-full flex items-center justify-center cursor-pointer"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-5 md:px-10 py-6 overflow-hidden">
        <div className="w-full max-w-3xl h-full flex flex-col gap-6 overflow-hidden">
          <div className="flex items-center justify-between shrink-0">
            <button onClick={() => router.push('/')} className="inline-flex items-center gap-2 text-purple-600 dark:text-[#cfbcff] hover:text-purple-700 dark:hover:text-[#e9ddff] transition-colors text-sm font-medium group cursor-pointer">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to formats
            </button>
            
            {files.length > 0 && (
              <Button onClick={handleConvertAll} className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-[#cfbcff] dark:hover:bg-[#e9ddff] dark:text-[#381e72] gap-2 shadow-md">
                Convert All Files
                <ArrowRight size={16} />
              </Button>
            )}
          </div>

          <div {...getRootProps()} className="w-full flex-1 min-h-0 outline-none overflow-hidden flex flex-col">
            <input {...getInputProps()} />
            
            {files.length === 0 ? (
              // Empty State Dropzone
              <div className={`w-full flex-1 bg-white dark:bg-[#0f0d13] border-2 ${
                isDragActive ? "border-purple-500 dark:border-[#cfbcff] bg-purple-50/30 dark:bg-[#1d1b20]" : "border-zinc-200 dark:border-[#494551]"
              } border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors hover:border-purple-500 dark:hover:border-[#cfbcff] group hover:bg-zinc-50/50 dark:hover:bg-[#1d1b20]`}>
                <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-[#211f24] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-purple-50 dark:group-hover:bg-[#6750a4]/20">
                  <UploadCloud size={32} className="text-zinc-500 dark:text-[#cbc4d2] group-hover:text-purple-600 dark:group-hover:text-[#cfbcff] transition-colors" />
                </div>
                <h2 className="text-xl font-semibold mb-1 text-zinc-800 dark:text-white">Drop your {config.from} files here</h2>
                <p className="text-zinc-500 dark:text-[#cbc4d2] mb-4 text-xs">or click to browse from your computer (Multiple allowed)</p>
                <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-500 dark:text-[#948e9c]">
                  <span className="px-2 py-0.5 bg-zinc-100 dark:bg-[#211f24] rounded">Max size: 50MB</span>
                  <span className="px-2 py-0.5 bg-zinc-100 dark:bg-[#211f24] rounded">Formats: {config.from}</span>
                </div>
              </div>
            ) : (
              // Active Files List
              <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                {/* Small dropzone for adding more files when dragging over the area */}
                {isDragActive && (
                  <div className="w-full bg-purple-50/30 dark:bg-[#1d1b20] border-2 border-purple-500 dark:border-[#cfbcff] border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center shrink-0">
                     <UploadCloud size={24} className="text-purple-600 dark:text-[#cfbcff] mb-1 animate-bounce" />
                     <p className="text-purple-600 dark:text-[#cfbcff] text-sm font-medium">Drop more files here...</p>
                  </div>
                )}
                
                {/* Scrollable Area for Files List */}
                <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 custom-scrollbar">
                  {files.map(item => (
                    <FileRow 
                      key={item.id} 
                      item={item} 
                      config={config} 
                      onRemove={removeFile}
                      forceConvert={forceConvertAll}
                    />
                  ))}
                </div>

                {/* Add More Files Button underneath the list */}
                {!isDragActive && (
                  <div className="mt-2 shrink-0">
                    <Button onClick={open} className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-[#cfbcff] dark:hover:bg-[#e9ddff] dark:text-[#381e72] gap-2 w-full py-6 text-sm shadow-md">
                      <Plus size={16} />
                      Add more {config.from} files
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </main>

      <footer className="bg-white dark:bg-[#141218] border-t border-zinc-200 dark:border-[#494551]/60 flex justify-between items-center w-full px-5 md:px-10 h-12 shrink-0 transition-colors duration-200">
        <div className="text-xs font-bold text-purple-600 dark:text-[#cfbcff]">
          © 2026 CONVERTO.
        </div>
        <div className="flex items-center gap-6">
          <Link className="text-xs text-zinc-500 hover:text-purple-600 dark:text-[#cbc4d2] dark:hover:text-[#cfbcff] transition-colors" href="/privacy">Privacy Policy</Link>
          <Link className="text-xs text-zinc-500 hover:text-purple-600 dark:text-[#cbc4d2] dark:hover:text-[#cfbcff] transition-colors" href="/terms">Terms of Service</Link>
        </div>
      </footer>

      {/* Settings Modal overlay */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-md transition-opacity"
            onClick={() => setSettingsOpen(false)}
          />
          <div className="bg-white dark:bg-[#211f24] border border-zinc-200 dark:border-[#cfbcff]/30 rounded-2xl w-full max-w-md p-6 relative shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-10 animate-zoom-in">
            <button 
              onClick={() => setSettingsOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 dark:text-[#cbc4d2] hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#2b292f] p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <Settings size={20} className="text-purple-600 dark:text-[#cfbcff]" />
              Application Settings
            </h3>
            
            <div className="space-y-4">
              {/* Gotenberg Rendering Server Status */}
              <div className="border border-zinc-200 dark:border-[#494551]/60 rounded-xl p-3.5 flex flex-col gap-1.5 bg-zinc-50/50 dark:bg-[#141218]/50">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-[#cbc4d2]">PDF Rendering Engine</span>
                  {health.gotenberg === "checking" ? (
                    <span className="text-[10px] text-zinc-400 animate-pulse">Checking status...</span>
                  ) : health.gotenberg === "online" ? (
                    <span className="text-[10px] bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                      Online (High Fidelity)
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Local Sandbox Mode
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-normal">
                  {health.gotenberg === "online" 
                    ? "LibreOffice container active. Word/Excel/HTML layouts will convert with pixel-perfect output structure."
                    : "Gotenberg is offline. Sandbox fallback converts metadata beautifully and provides setup instructions."}
                </p>
              </div>

              {/* Storage Infrastructure Node */}
              <div className="border border-zinc-200 dark:border-[#494551]/60 rounded-xl p-3.5 flex flex-col gap-1.5 bg-zinc-50/50 dark:bg-[#141218]/50">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-[#cbc4d2] flex items-center gap-1">
                    <Database size={13} />
                    Storage Node
                  </span>
                  {health.storage === "checking" ? (
                    <span className="text-[10px] text-zinc-400 animate-pulse">Checking...</span>
                  ) : health.storage === "cloud" ? (
                    <span className="text-[10px] bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full font-bold">
                      AWS S3 / R2 Cloud
                    </span>
                  ) : (
                    <span className="text-[10px] bg-zinc-200 dark:bg-[#2b292f] text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <HardDrive size={10} />
                      Local Temporary Disk
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-normal">
                  {health.storage === "cloud"
                    ? "Remote Cloud Bucket configured. Files are securely transferred via encrypted S3 pre-signed URLs."
                    : "Zero retention local file buffer active. Converted data exists exclusively in transient memory."}
                </p>
              </div>

              {/* Upload Limits */}
              <div className="border border-zinc-200 dark:border-[#494551]/60 rounded-xl p-3.5 flex justify-between items-center bg-zinc-50/50 dark:bg-[#141218]/50">
                <span className="text-xs font-semibold text-zinc-500 dark:text-[#cbc4d2] flex items-center gap-1">
                  <ShieldCheck size={13} />
                  Max File Limit
                </span>
                <span className="text-xs font-bold text-purple-600 dark:text-[#cfbcff]">
                  {health.maxSize}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setSettingsOpen(false)}
              className="mt-5 w-full bg-purple-600 dark:bg-[#cfbcff] text-white dark:text-[#141218] hover:bg-purple-700 dark:hover:bg-[#b5a3ff] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Help & FAQ Dialog Modal */}
      {helpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-md transition-opacity"
            onClick={() => setHelpOpen(false)}
          />
          <div className="bg-white dark:bg-[#211f24] border border-zinc-200 dark:border-[#cfbcff]/30 rounded-2xl w-full max-w-lg p-6 relative shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-10 animate-zoom-in">
            <button 
              onClick={() => setHelpOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 dark:text-[#cbc4d2] hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#2b292f] p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
              <QuestionIcon size={20} className="text-purple-600 dark:text-[#cfbcff]" />
              Frequently Asked Questions
            </h3>
            
            <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1.5 custom-scrollbar">
              <div className="border-b border-zinc-100 dark:border-[#494551]/30 pb-3">
                <h4 className="text-xs font-bold text-zinc-800 dark:text-[#e6e0e9] mb-1">How do I use Converto?</h4>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Select your source format on the homepage dashboard, select your desired conversion target (e.g. XLSX to PDF), drop your files inside the upload area, and click convert. Your download will start instantly.
                </p>
              </div>

              <div className="border-b border-zinc-100 dark:border-[#494551]/30 pb-3">
                <h4 className="text-xs font-bold text-zinc-800 dark:text-[#e6e0e9] mb-1">Are my files stored on Converto's servers?</h4>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  No. Converto maintains a strict zero-retention data privacy protocol. All files uploaded are temporarily processed in memory and are purged immediately after the conversion download completes.
                </p>
              </div>

              <div className="border-b border-zinc-100 dark:border-[#494551]/30 pb-3">
                <h4 className="text-xs font-bold text-zinc-800 dark:text-[#e6e0e9] mb-1">What is local Sandbox Mode?</h4>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  If the backend rendering containers are offline on localhost, sandbox mode intercepts the document and compiles a beautiful, design-styled metadata summary PDF with technical debugging logs. Full conversions occur in production.
                </p>
              </div>

              <div className="pb-1">
                <h4 className="text-xs font-bold text-zinc-800 dark:text-[#e6e0e9] mb-1">What is the upload size limit?</h4>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Converto currently accepts individual files up to 50 MB in size to guarantee rapid server response speeds and optimize container memory utilization.
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setHelpOpen(false)}
              className="mt-5 w-full bg-purple-600 dark:bg-[#cfbcff] text-white dark:text-[#141218] hover:bg-purple-700 dark:hover:bg-[#b5a3ff] py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Close Help
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
