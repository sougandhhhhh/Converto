"use client";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen relative bg-background text-foreground transition-colors duration-300">
      
      {/* Global Navbar */}
      <Navbar />

      {/* Content */}
      <main className="flex-1 w-full positivus-container py-16">

        {/* Hero */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full positivus-card-green text-[#191a23] text-sm font-semibold mb-6">
            <ShieldCheck size={16} /> Privacy Policy
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Your privacy, <span className="text-[#b9ff66]">guaranteed</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-4">
            Converto is built with privacy-first principles. We don't store your files, we don't track you, and we don't sell your data.
          </p>
          <p className="text-sm text-muted-foreground">Last updated: June 2026</p>
        </div>

        <div className="h-px bg-border mb-12" />

          {/* TL;DR */}
          <div className="p-8 rounded-[30px] positivus-card-green text-[#191a23] mb-12">
            <p className="text-base leading-relaxed">
              <strong className="font-bold">TL;DR — </strong>
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
            <div key={section.title} className="mb-10">
              <h2 className="text-2xl font-bold text-foreground mb-4">{section.title}</h2>
              {section.content.map((block: any, bi: number) => (
                block.type === "p"
                  ? <p key={bi} className="text-base text-muted-foreground leading-relaxed mb-3">{block.text}</p>
                  : <ul key={bi} className="pl-6 flex flex-col gap-3 mt-2">
                      {block.items.map((item: string, ii: number) => (
                        <li key={ii} className="text-base text-muted-foreground leading-relaxed">{item}</li>
                      ))}
                    </ul>
              ))}
            </div>
          ))}
        </main>

        {/* Global Footer */}
        <Footer />

    </div>
  );
}
