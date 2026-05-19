import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Converto",
  description: "Read the Terms of Service for using Converto file conversion tools.",
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-[#141218] text-[#e6e0e9] min-h-screen w-full flex flex-col font-sans selection:bg-[#6750a4] selection:text-[#e0d2ff]">
      {/* Header */}
      <header className="bg-[#141218] border-b border-[#494551]/60 flex items-center justify-between w-full px-5 md:px-10 h-16 shrink-0 z-40">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <ArrowLeft className="text-[#cbc4d2] group-hover:text-[#cfbcff] transition-colors" size={18} />
          <span className="text-sm font-semibold text-[#cbc4d2] group-hover:text-[#cfbcff] transition-colors">
            Back to Converter
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#6750a4]/30 flex items-center justify-center border border-[#cfbcff]/20">
            <span className="text-[#cfbcff] font-bold text-sm">C</span>
          </div>
          <span className="font-extrabold tracking-wider text-[#cfbcff] text-base">CONVERTO</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto px-6 py-12 md:py-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-[#cfbcff]/10 text-[#cfbcff] rounded-xl border border-[#cfbcff]/20">
            <FileText size={24} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
        </div>
        <p className="text-sm text-[#948e9c] mb-10">
          Last Updated: May 20, 2026
        </p>

        {/* Content Sections */}
        <div className="space-y-8 text-[#cbc4d2] leading-relaxed">
          <section className="bg-[#211f24] border border-[#494551]/40 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Converto, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our online conversion tool.
            </p>
          </section>

          <section className="bg-[#211f24] border border-[#494551]/40 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">2. Proper Use & Limitations</h2>
            <p className="mb-4">
              Converto provides file conversion services. When using our service, you agree not to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Upload files containing malicious code, viruses, or spyware.</li>
              <li>Attempt to disrupt, reverse-engineer, or overload our infrastructure.</li>
              <li>Upload materials that violate applicable copyright, intellectual property, or local laws.</li>
              <li>Bypass file size limits (50MB maximum) or automated rate limits.</li>
            </ul>
          </section>

          <section className="bg-[#211f24] border border-[#494551]/40 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">3. Disclaimer of Warranties</h2>
            <p>
              Our conversion service is provided on an **"as is"** and **"as available"** basis. We make no guarantees, warranties, or representations regarding the accuracy, formatting completeness, or availability of the conversion outputs. You assume all risks associated with file processing.
            </p>
          </section>

          <section className="bg-[#211f24] border border-[#494551]/40 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">4. Limitation of Liability</h2>
            <p>
              Converto and its developers shall not be liable for any direct, indirect, incidental, or consequential damages resulting from data loss, corrupted files, security breaches, or temporary downtime of the service.
            </p>
          </section>

          <section className="bg-[#211f24] border border-[#494551]/40 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">5. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Your continued use of Converto following any updates constitutes acceptance of the modified Terms of Service.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#141218] border-t border-[#494551]/60 flex justify-center items-center w-full h-12 shrink-0 text-xs text-[#948e9c]">
        © 2026 CONVERTO. All rights reserved.
      </footer>
    </div>
  );
}
