"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Settings, HelpCircle, FileText, FileSpreadsheet, FileImage, FileCode2, ArrowRight } from "lucide-react";

const FORMAT_CONFIG = [
  { id: "word-to-pdf", title: "Word to PDF", icon: FileText, desc: "Convert .docx to .pdf" },
  { id: "excel-to-pdf", title: "Excel to PDF", icon: FileSpreadsheet, desc: "Convert .xlsx to .pdf" },
  { id: "ppt-to-pdf", title: "PowerPoint to PDF", icon: FileCode2, desc: "Convert .pptx to .pdf" },
  { id: "jpg-to-pdf", title: "JPG to PDF", icon: FileImage, desc: "Convert .jpg to .pdf" },
  { id: "pdf-to-word", title: "PDF to Word", icon: FileText, desc: "Convert .pdf to .docx" },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="bg-[#141218] text-[#e6e0e9] min-h-screen flex flex-col font-sans selection:bg-[#6750a4] selection:text-[#e0d2ff]">
      <header className="bg-[#141218] border-b border-[#494551] flex justify-between items-center w-full px-5 md:px-10 h-16 sticky top-0 z-50">
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

      <main className="flex-grow flex flex-col items-center px-5 md:px-10 py-16">
        <div className="w-full max-w-4xl flex flex-col items-center gap-12 text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Universal File Converter
            </h1>
            <p className="text-lg text-[#cbc4d2] max-w-2xl mx-auto">
              Fast, secure, and professional document conversion powered by CloudConvert and LibreOffice. Select a format below to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full mt-8">
            {FORMAT_CONFIG.map((format) => {
              const Icon = format.icon;
              return (
                <button
                  key={format.id}
                  onClick={() => router.push(`/convert/${format.id}`)}
                  className="bg-[#211f24] border border-[#494551]/50 rounded-xl p-6 text-left hover:border-[#cfbcff] hover:bg-[#1d1b20] transition-all group flex flex-col gap-4 relative overflow-hidden"
                >
                  <div className="w-12 h-12 bg-[#6750a4]/20 rounded-lg flex items-center justify-center text-[#cfbcff] group-hover:scale-110 transition-transform">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1 group-hover:text-[#cfbcff] transition-colors">{format.title}</h3>
                    <p className="text-sm text-[#948e9c]">{format.desc}</p>
                  </div>
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all text-[#cfbcff]">
                    <ArrowRight size={20} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="bg-[#141218] border-t border-[#494551] flex flex-col md:flex-row justify-between items-center w-full px-5 md:px-10 py-8 gap-4 mt-auto">
        <div className="text-sm font-bold text-[#cfbcff]">
          © 2026 CONVERTO. Technical Precision.
        </div>
        <div className="flex items-center gap-6">
          <a className="text-sm text-[#cbc4d2] hover:text-[#cfbcff] transition-colors" href="#">Privacy Policy</a>
          <a className="text-sm text-[#cbc4d2] hover:text-[#cfbcff] transition-colors" href="#">Terms of Service</a>
          <a className="text-sm text-[#cbc4d2] hover:text-[#cfbcff] transition-colors" href="#">API Docs</a>
        </div>
      </footer>
    </div>
  );
}
