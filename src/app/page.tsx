"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Settings, HelpCircle, FileText, FileSpreadsheet, FileImage, Presentation, FileCode, X } from "lucide-react";

const FORMAT_CONFIG = [
  { id: "pdf", name: "PDF", icon: FileText, color: "text-[#ffb4ab] bg-[#ffb4ab]/10 border-[#ffb4ab]/20" },
  { id: "docx", name: "DOCX", icon: FileText, color: "text-[#cfbcff] bg-[#cfbcff]/10 border-[#cfbcff]/20" },
  { id: "pptx", name: "PPTX", icon: Presentation, color: "text-[#ffd9e3] bg-[#ffd9e3]/10 border-[#ffd9e3]/20" },
  { id: "xlsx", name: "XLSX", icon: FileSpreadsheet, color: "text-[#c2f3cf] bg-[#c2f3cf]/10 border-[#c2f3cf]/20" },
  { id: "txt", name: "TXT", icon: FileCode, color: "text-[#b0c6ff] bg-[#b0c6ff]/10 border-[#b0c6ff]/20" },
  { id: "jpg", name: "JPG", icon: FileImage, color: "text-[#ffded8] bg-[#ffded8]/10 border-[#ffded8]/20" },
  { id: "png", name: "PNG", icon: FileImage, color: "text-[#e8def8] bg-[#e8def8]/10 border-[#e8def8]/20" },
  { id: "heic", name: "HEIC", icon: FileImage, color: "text-[#e0e2ec] bg-[#e0e2ec]/10 border-[#e0e2ec]/20" },
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
  const [activeFormat, setActiveFormat] = React.useState<string | null>(null);

  return (
    <div className="bg-[#141218] text-[#e6e0e9] h-screen w-screen flex flex-col font-sans selection:bg-[#6750a4] selection:text-[#e0d2ff] overflow-hidden relative">
      {/* Header */}
      <header className="bg-[#141218] border-b border-[#494551]/60 flex justify-between items-center w-full px-5 md:px-10 h-16 shrink-0 z-40">
        <div className="flex items-center cursor-pointer" onClick={() => router.push('/')}>
          <span className="text-2xl font-bold text-[#cfbcff] tracking-tight">CONVERTO</span>
        </div>
        <div className="flex items-center gap-4 text-[#cbc4d2]">
          <button aria-label="settings" className="hover:bg-[#2b292f] transition-colors p-2 rounded-full flex items-center justify-center opacity-80 hover:opacity-100">
            <Settings size={20} />
          </button>
          <button aria-label="help" className="hover:bg-[#2b292f] transition-colors p-2 rounded-full flex items-center justify-center opacity-80 hover:opacity-100">
            <HelpCircle size={20} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 md:px-8 py-4 overflow-hidden">
        <div className="w-full max-w-5xl h-full flex flex-col justify-between py-2 gap-4">
          
          {/* Header Title Section */}
          <div className="text-center shrink-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-1 tracking-tight text-white">
              Universal File Converter
            </h1>
            <p className="text-sm md:text-base text-[#cbc4d2] max-w-xl mx-auto">
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
                  className="bg-[#211f24] border border-[#494551]/50 hover:border-[#cfbcff] hover:bg-[#1d1b20] transition-all flex flex-col justify-center items-center rounded-xl p-5 relative overflow-hidden group select-none cursor-pointer text-center focus:outline-none focus:ring-2 focus:ring-[#cfbcff]/50 min-h-[160px]"
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${format.color} mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon size={26} />
                  </div>
                  
                  {/* Name and Action Hint */}
                  <div className="w-full flex flex-col items-center">
                    <span className="text-xl font-bold tracking-wider text-white block mb-1">
                      {format.name}
                    </span>
                    <span className="text-xs text-[#948e9c] group-hover:text-[#cfbcff] transition-colors">
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
      <footer className="bg-[#141218] border-t border-[#494551]/60 flex justify-between items-center w-full px-5 md:px-10 h-12 shrink-0 z-40">
        <div className="text-xs font-bold text-[#cfbcff]">
          © 2026 CONVERTO.
        </div>
        <div className="flex items-center gap-6">
          <Link className="text-xs text-[#cbc4d2] hover:text-[#cfbcff] transition-colors" href="/privacy">Privacy Policy</Link>
          <Link className="text-xs text-[#cbc4d2] hover:text-[#cfbcff] transition-colors" href="/terms">Terms of Service</Link>
        </div>
      </footer>

      {/* Options Popup Modal */}
      {activeFormat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Blur Backdrop */}
          <div 
            className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity"
            onClick={() => setActiveFormat(null)}
          />
          
          {/* Modal Container */}
          <div className="bg-[#211f24] border border-[#cfbcff]/30 rounded-2xl w-full max-w-4xl p-6 md:p-8 relative shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-10 animate-zoom-in">
            {/* Close Button */}
            <button 
              onClick={() => setActiveFormat(null)}
              className="absolute top-4 right-4 text-[#cbc4d2] hover:text-white hover:bg-[#2b292f] p-1.5 rounded-full transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Title */}
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
              Convert from {activeFormat.toUpperCase()}
            </h3>
            <p className="text-xs md:text-sm text-[#948e9c] mb-6">
              Choose your target output format to start.
            </p>

            {/* Options Grid Layout (Non-scrolling layout) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
              {SUB_BUTTONS[activeFormat]?.map((sub) => (
                <button
                  key={sub.slug}
                  onClick={() => {
                    setActiveFormat(null);
                    router.push(`/convert/${sub.slug}`);
                  }}
                  className="bg-[#141218]/80 hover:bg-[#cfbcff]/15 border border-[#494551]/60 hover:border-[#cfbcff]/60 rounded-xl p-4 text-center cursor-pointer group/opt transition-all flex flex-col justify-between items-center h-28"
                >
                  <span className="text-xs font-bold text-[#e6e0e9] group-hover:text-[#cfbcff] mb-2 transition-colors line-clamp-2">
                    {sub.label}
                  </span>
                  <span className="text-[10px] bg-[#6750a4]/20 border border-[#cfbcff]/10 text-[#cfbcff] px-2.5 py-0.5 rounded-full font-semibold group-hover/opt:bg-[#cfbcff] group-hover/opt:text-[#381e72] transition-all">
                    Convert
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
