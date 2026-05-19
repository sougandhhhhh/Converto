"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Settings, 
  HelpCircle, 
  FileText, 
  FileSpreadsheet, 
  FileImage, 
  Presentation, 
  FileCode, 
  X, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Database, 
  HardDrive, 
  HelpCircle as QuestionIcon,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const FORMAT_CONFIG = [
  { id: "pdf", name: "PDF", icon: FileText, color: "text-red-600 bg-red-50 dark:text-[#ffb4ab] dark:bg-[#ffb4ab]/10 border-red-100 dark:border-[#ffb4ab]/20" },
  { id: "docx", name: "DOCX", icon: FileText, color: "text-purple-600 bg-purple-50 dark:text-[#cfbcff] dark:bg-[#cfbcff]/10 border-purple-100 dark:border-[#cfbcff]/20" },
  { id: "pptx", name: "PPTX", icon: Presentation, color: "text-pink-600 bg-pink-50 dark:text-[#ffd9e3] dark:bg-[#ffd9e3]/10 border-pink-100 dark:border-[#ffd9e3]/20" },
  { id: "xlsx", name: "XLSX", icon: FileSpreadsheet, color: "text-emerald-600 bg-emerald-50 dark:text-[#c2f3cf] dark:bg-[#c2f3cf]/10 border-emerald-100 dark:border-[#c2f3cf]/20" },
  { id: "txt", name: "TXT", icon: FileCode, color: "text-blue-600 bg-blue-50 dark:text-[#b0c6ff] dark:bg-[#b0c6ff]/10 border-blue-100 dark:border-[#b0c6ff]/20" },
  { id: "jpg", name: "JPG", icon: FileImage, color: "text-orange-600 bg-orange-50 dark:text-[#ffded8] dark:bg-[#ffded8]/10 border-orange-100 dark:border-[#ffded8]/20" },
  { id: "png", name: "PNG", icon: FileImage, color: "text-indigo-600 bg-indigo-50 dark:text-[#e8def8] dark:bg-[#e8def8]/10 border-indigo-100 dark:border-[#e8def8]/20" },
  { id: "heic", name: "HEIC", icon: FileImage, color: "text-slate-600 bg-slate-100 dark:text-[#e0e2ec] dark:bg-[#e0e2ec]/10 border-slate-200 dark:border-[#e0e2ec]/20" },
];

const SUB_BUTTONS: Record<string, { label: string, slug: string }[]> = {
  pdf: [
    { label: "PDF → DOCX", slug: "pdf-to-docx" },
    { label: "PDF → PPTX", slug: "pdf-to-pptx" },
    { label: "PDF → XLSX", slug: "pdf-to-xlsx" },
    { label: "PDF → TXT", slug: "pdf-to-txt" },
    { label: "PDF → JPG", slug: "pdf-to-jpg" },
    { label: "PDF → PNG", slug: "pdf-to-png" },
    { label: "PDF → WEBP", slug: "pdf-to-webp" },
    { label: "PDF → HTML", slug: "pdf-to-html" },
    { label: "PDF → HEIC", slug: "pdf-to-heic" },
    { label: "PDF → CSV", slug: "pdf-to-csv" },
    { label: "PDF → ZIP", slug: "pdf-to-zip" },
  ],
  docx: [
    { label: "DOCX → PDF", slug: "docx-to-pdf" },
    { label: "DOCX → TXT", slug: "docx-to-txt" },
    { label: "DOCX → HTML", slug: "docx-to-html" },
    { label: "DOCX → XLSX", slug: "docx-to-xlsx" },
    { label: "DOCX → WEBP", slug: "docx-to-webp" },
    { label: "DOCX → CSV", slug: "docx-to-csv" },
    { label: "DOCX → JPG", slug: "docx-to-jpg" },
    { label: "DOCX → PNG", slug: "docx-to-png" },
    { label: "DOCX → PPTX", slug: "docx-to-pptx" },
    { label: "DOCX → ZIP", slug: "docx-to-zip" },
    { label: "DOCX → HEIC", slug: "docx-to-heic" },
  ],
  pptx: [
    { label: "PPTX → PDF", slug: "pptx-to-pdf" },
    { label: "PPTX → DOCX", slug: "pptx-to-docx" },
    { label: "PPTX → XLSX", slug: "pptx-to-xlsx" },
    { label: "PPTX → TXT", slug: "pptx-to-txt" },
    { label: "PPTX → JPG", slug: "pptx-to-jpg" },
    { label: "PPTX → PNG", slug: "pptx-to-png" },
    { label: "PPTX → WEBP", slug: "pptx-to-webp" },
    { label: "PPTX → HTML", slug: "pptx-to-html" },
    { label: "PPTX → HEIC", slug: "pptx-to-heic" },
    { label: "PPTX → CSV", slug: "pptx-to-csv" },
    { label: "PPTX → ZIP", slug: "pptx-to-zip" },
  ],
  xlsx: [
    { label: "XLSX → PDF", slug: "xlsx-to-pdf" },
    { label: "XLSX → CSV", slug: "xlsx-to-csv" },
    { label: "XLSX → TXT", slug: "xlsx-to-txt" },
    { label: "XLSX → HTML", slug: "xlsx-to-html" },
    { label: "XLSX → DOCX", slug: "xlsx-to-docx" },
    { label: "XLSX → JSON", slug: "xlsx-to-json" },
    { label: "XLSX → XML", slug: "xlsx-to-xml" },
    { label: "XLSX → ZIP", slug: "xlsx-to-zip" },
    { label: "XLSX → JPG", slug: "xlsx-to-jpg" },
    { label: "XLSX → PNG", slug: "xlsx-to-png" },
    { label: "XLSX → HEIC", slug: "xlsx-to-heic" },
  ],
  txt: [
    { label: "TXT → PDF", slug: "txt-to-pdf" },
    { label: "TXT → DOCX", slug: "txt-to-docx" },
    { label: "TXT → HTML", slug: "txt-to-html" },
    { label: "TXT → CSV", slug: "txt-to-csv" },
    { label: "TXT → JSON", slug: "txt-to-json" },
    { label: "TXT → XML", slug: "txt-to-xml" },
  ],
  jpg: [
    { label: "JPG → PNG", slug: "jpg-to-png" },
    { label: "JPG → WEBP", slug: "jpg-to-webp" },
    { label: "JPG → PDF", slug: "jpg-to-pdf" },
    { label: "JPG → GIF", slug: "jpg-to-gif" },
    { label: "JPG → DOCX", slug: "jpg-to-docx" },
    { label: "JPG → HEIC", slug: "jpg-to-heic" },
    { label: "JPG → AVIF", slug: "jpg-to-avif" },
  ],
  png: [
    { label: "PNG → JPG", slug: "png-to-jpg" },
    { label: "PNG → WEBP", slug: "png-to-webp" },
    { label: "PNG → PDF", slug: "png-to-pdf" },
    { label: "PNG → GIF", slug: "png-to-gif" },
    { label: "PNG → DOCX", slug: "png-to-docx" },
    { label: "PNG → HEIC", slug: "png-to-heic" },
    { label: "PNG → AVIF", slug: "png-to-avif" },
  ],
  heic: [
    { label: "HEIC → JPG", slug: "heic-to-jpg" },
    { label: "HEIC → PNG", slug: "heic-to-png" },
    { label: "HEIC → WEBP", slug: "heic-to-webp" },
    { label: "HEIC → PDF", slug: "heic-to-pdf" },
    { label: "HEIC → GIF", slug: "heic-to-gif" },
    { label: "HEIC → DOCX", slug: "heic-to-docx" },
    { label: "HEIC → AVIF", slug: "heic-to-avif" },
  ],
};

export default function HomePage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  
  const [activeFormat, setActiveFormat] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  
  const [health, setHealth] = useState({
    gotenberg: "checking",
    storage: "checking",
    maxSize: "50 MB"
  });

  // Fetch health and environmental status
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

  return (
    <div className="bg-[#f8f9fa] dark:bg-[#141218] text-[#1c1b1f] dark:text-[#e6e0e9] h-screen w-screen flex flex-col font-sans selection:bg-purple-200 dark:selection:bg-[#6750a4] selection:text-purple-900 dark:selection:text-[#e0d2ff] overflow-hidden relative transition-colors duration-200">
      
      {/* Header */}
      <header className="bg-white dark:bg-[#141218] border-b border-zinc-200 dark:border-[#494551]/60 flex justify-between items-center w-full px-5 md:px-10 h-16 shrink-0 z-40 transition-colors duration-200">
        <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
          <span className="text-2xl font-bold text-purple-600 dark:text-[#cfbcff] tracking-tight">CONVERTO</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Theme Toggler */}
          <button 
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="text-zinc-600 dark:text-[#cbc4d2] hover:bg-zinc-100 dark:hover:bg-[#2b292f] transition-all p-2.5 rounded-full flex items-center justify-center cursor-pointer"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* Settings Button */}
          <button 
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings" 
            className="text-zinc-600 dark:text-[#cbc4d2] hover:bg-zinc-100 dark:hover:bg-[#2b292f] transition-all p-2.5 rounded-full flex items-center justify-center cursor-pointer"
          >
            <Settings size={20} />
          </button>

          {/* Help Button */}
          <button 
            onClick={() => setHelpOpen(true)}
            aria-label="Help & FAQ" 
            className="text-zinc-600 dark:text-[#cbc4d2] hover:bg-zinc-100 dark:hover:bg-[#2b292f] transition-all p-2.5 rounded-full flex items-center justify-center cursor-pointer"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 md:px-8 py-4 overflow-hidden">
        <div className="w-full max-w-5xl h-full flex flex-col justify-between py-2 gap-4">
          
          {/* Header Title Section */}
          <div className="text-center shrink-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-1.5 tracking-tight text-zinc-900 dark:text-white">
              Universal File Converter
            </h1>
            <p className="text-sm md:text-base text-zinc-500 dark:text-[#cbc4d2] max-w-xl mx-auto">
              Select a source format below to explore conversion options.
            </p>
          </div>

          {/* Grid Section */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full items-stretch min-h-0">
            {FORMAT_CONFIG.map((format) => {
              const Icon = format.icon;

              return (
                <button
                  key={format.id}
                  onClick={() => setActiveFormat(format.id)}
                  className="bg-white dark:bg-[#211f24] border border-zinc-200 dark:border-[#494551]/50 hover:border-purple-500 dark:hover:border-[#cfbcff] hover:bg-zinc-50 dark:hover:bg-[#1d1b20] hover:shadow-md transition-all flex flex-col justify-center items-center rounded-xl p-5 relative overflow-hidden group select-none cursor-pointer text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:focus:ring-[#cfbcff]/50 min-h-[160px]"
                >
                  {/* Icon Wrapper */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${format.color} mb-3 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon size={26} />
                  </div>
                  
                  {/* Name and Action Hint */}
                  <div className="w-full flex flex-col items-center">
                    <span className="text-xl font-bold tracking-wider text-zinc-900 dark:text-white block mb-1">
                      {format.name}
                    </span>
                    <span className="text-xs text-zinc-500 group-hover:text-purple-600 dark:text-[#948e9c] dark:group-hover:text-[#cfbcff] transition-colors font-medium">
                      Convert from {format.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#141218] border-t border-zinc-200 dark:border-[#494551]/60 flex justify-between items-center w-full px-5 md:px-10 h-12 shrink-0 z-40 transition-colors duration-200">
        <div className="text-xs font-bold text-purple-600 dark:text-[#cfbcff]">
          © 2026 CONVERTO.
        </div>
        <div className="flex items-center gap-6">
          <Link className="text-xs text-zinc-500 hover:text-purple-600 dark:text-[#cbc4d2] dark:hover:text-[#cfbcff] transition-colors" href="/privacy">Privacy Policy</Link>
          <Link className="text-xs text-zinc-500 hover:text-purple-600 dark:text-[#cbc4d2] dark:hover:text-[#cfbcff] transition-colors" href="/terms">Terms of Service</Link>
        </div>
      </footer>

      {/* Options Popup Modal */}
      {activeFormat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-md transition-opacity"
            onClick={() => setActiveFormat(null)}
          />
          
          <div className="bg-white dark:bg-[#211f24] border border-zinc-200 dark:border-[#cfbcff]/30 rounded-2xl w-full max-w-4xl p-6 md:p-8 relative shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-10 animate-zoom-in">
            <button 
              onClick={() => setActiveFormat(null)}
              className="absolute top-4 right-4 text-zinc-500 dark:text-[#cbc4d2] hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#2b292f] p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mb-1">
              Convert from {activeFormat.toUpperCase()}
            </h3>
            <p className="text-xs md:text-sm text-zinc-500 dark:text-[#948e9c] mb-6">
              Choose your target output format to start.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
              {SUB_BUTTONS[activeFormat]?.map((sub) => (
                <button
                  key={sub.slug}
                  onClick={() => {
                    setActiveFormat(null);
                    router.push(`/convert/${sub.slug}`);
                  }}
                  className="bg-zinc-50 dark:bg-[#141218]/80 hover:bg-purple-50 dark:hover:bg-[#cfbcff]/15 border border-zinc-200 dark:border-[#494551]/60 hover:border-purple-400 dark:hover:border-[#cfbcff]/60 rounded-xl p-4 text-center cursor-pointer group/opt transition-all flex flex-col justify-between items-center h-28"
                >
                  <span className="text-xs font-bold text-zinc-800 dark:text-[#e6e0e9] group-hover:text-purple-600 dark:group-hover:text-[#cfbcff] mb-2 transition-colors line-clamp-2">
                    {sub.label}
                  </span>
                  <span className="text-[10px] bg-purple-100 dark:bg-[#6750a4]/20 border border-purple-200 dark:border-[#cfbcff]/10 text-purple-700 dark:text-[#cfbcff] px-2.5 py-0.5 rounded-full font-semibold group-hover/opt:bg-purple-600 group-hover/opt:text-white dark:group-hover/opt:bg-[#cfbcff] dark:group-hover/opt:text-[#381e72] transition-all">
                    Convert
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Dialog Modal */}
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
