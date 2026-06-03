"use client";
import Link from "next/link";
import { FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {

  const sections = [
    {
      title: "1. Acceptance of Terms",
      paras: ['By accessing or using Converto (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use the Service.'],
      items: [] as string[],
    },
    {
      title: "2. Description of Service",
      paras: ["Converto is a free, browser-based file conversion platform that converts documents, spreadsheets, presentations, and images between 68+ formats. The Service uses a dual architecture: Tier 1 conversions (images, text, DOCX→TXT, XLSX→CSV/JSON, HTML→PDF, and similar) run entirely in your browser using Canvas, WASM, and JavaScript libraries — no file upload required. Tier 2-4 conversions use server-side professional engines (LibreOffice, Camelot, OCRmyPDF) for complex formatting. The Service is provided free of charge for personal and educational use."],
      items: [] as string[],
    },
    {
      title: "3. Acceptable Use",
      paras: ["You agree to use the Service only for lawful purposes. You must not:"],
      items: [
        "Upload files containing malware, viruses, or malicious code",
        "Convert, distribute, or process files that infringe on third-party copyrights or intellectual property rights",
        "Attempt to overload, exploit, or reverse-engineer the Service infrastructure",
        "Use automated scripts to submit large volumes of conversion requests without permission",
        "Upload files containing illegal content of any kind",
      ],
    },
    {
      title: "4. File Upload Responsibility",
      paras: ["You are solely responsible for the files you upload. By uploading a file, you confirm that you have the right to convert and download that content. Converto does not inspect, store, or review the contents of uploaded files beyond what is necessary for conversion processing."],
      items: [] as string[],
    },
    {
      title: "5. Service Availability",
      paras: ["Converto is provided on an as-is and as-available basis. We do not guarantee 100% uptime. The Service may be temporarily unavailable due to maintenance, updates, or factors outside our control. We reserve the right to modify or discontinue the Service at any time without notice."],
      items: [] as string[],
    },
    {
      title: "6. File Size & Rate Limits",
      paras: ["Server-side conversions: individual files are limited to 50 MB per upload. Client-side (browser) conversions: no file size limit — your device memory is the only constraint. We reserve the right to implement rate limits on server-side conversions to ensure fair access for all users. Abuse of the Service may result in IP-level restrictions."],
      items: [] as string[],
    },
    {
      title: "7. Disclaimer of Warranties",
      paras: ["The Service is provided without warranties of any kind, express or implied, including but not limited to merchantability, fitness for a particular purpose, or non-infringement. Converto does not warrant that conversion output will be perfectly accurate or maintain 100% fidelity in all cases."],
      items: [] as string[],
    },
    {
      title: "8. Limitation of Liability",
      paras: ["To the maximum extent permitted by applicable law, Converto shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including loss of data, loss of profits, or any other damages even if advised of the possibility of such damages."],
      items: [] as string[],
    },
    {
      title: "9. Changes to Terms",
      paras: ["We reserve the right to update these Terms at any time. Continued use of the Service following any changes constitutes your acceptance of the revised terms. The Last Updated date at the top of this page indicates when the most recent revision was made."],
      items: [] as string[],
    },
    {
      title: "10. Governing Law",
      paras: ["These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising under these terms shall be subject to the jurisdiction of applicable courts."],
      items: [] as string[],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen relative bg-background text-foreground transition-colors duration-300">
      
      {/* Global Navbar */}
      <Navbar />

      {/* Content */}
      <main className="flex-1 w-full positivus-container py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full positivus-card-green text-[#191a23] text-sm font-semibold mb-6">
            <FileText size={16} /> Terms of Service
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Simple, fair <span className="text-[#b9ff66]">terms</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-4">
            By using Converto you agree to these terms. We have kept them short and human-readable.
          </p>
          <p className="text-sm text-muted-foreground">Last updated: June 2026</p>
        </div>

        <div className="h-px bg-border mb-12" />

        <div className="p-8 rounded-[30px] positivus-card-green text-[#191a23] mb-12">
          <p className="text-base leading-relaxed">
            <strong className="font-bold">TL;DR — </strong>
            Use Converto for legal file conversions. Do not abuse the service. We provide it as-is with no warranty. That is basically it.
          </p>
        </div>

          {sections.map((section) => (
            <div key={section.title} className="mb-10">
              <h2 className="text-2xl font-bold text-foreground mb-4">{section.title}</h2>
              {section.paras.map((p, i) => (
                <p key={i} className="text-base text-muted-foreground leading-relaxed mb-3">{p}</p>
              ))}
              {section.items.length > 0 && (
                <ul className="pl-6 flex flex-col gap-3 mt-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="text-base text-muted-foreground leading-relaxed">{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </main>

        {/* Global Footer */}
        <Footer />

    </div>
  );
}
