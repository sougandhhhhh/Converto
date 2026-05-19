import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Converto",
  description: "Learn how Converto protects your privacy, files, and personal data during file conversion.",
};

export default function PrivacyPolicyPage() {
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
            <Shield size={24} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy
          </h1>
        </div>
        <p className="text-sm text-[#948e9c] mb-10">
          Last Updated: May 20, 2026
        </p>

        {/* Content Sections */}
        <div className="space-y-8 text-[#cbc4d2] leading-relaxed">
          <section className="bg-[#211f24] border border-[#494551]/40 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">1. Our Commitment to Your Privacy</h2>
            <p>
              At Converto, we believe that your files and personal data belong to you. We are committed to maintaining a secure, private environment where you can convert your media and documents without worrying about unauthorized access, data mining, or retention of your content.
            </p>
          </section>

          <section className="bg-[#211f24] border border-[#494551]/40 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">2. File Protection & Retention Policy</h2>
            <p className="mb-4">
              Our conversion pipeline is designed with a strict **zero-retention** approach:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white">Processing:</strong> Files uploaded to Converto are processed entirely in memory or stored temporarily on secure instances only for the duration of the conversion.
              </li>
              <li>
                <strong className="text-white">Deletion:</strong> Immediately after the conversion is complete and the download link is served, the source and target files are deleted from our servers.
              </li>
              <li>
                <strong className="text-white">No backups:</strong> We do not keep logs, backups, or copies of your files.
              </li>
            </ul>
          </section>

          <section className="bg-[#211f24] border border-[#494551]/40 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">3. Data We Collect</h2>
            <p className="mb-4">
              We collect minimal information to operate and improve the service:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white">Usage Analytics:</strong> Anonymous, aggregated telemetry details such as browser type, conversion speed, and selected formats to help optimize server capacity.
              </li>
              <li>
                <strong className="text-white">IP Addresses:</strong> Temporary logging to prevent abuse, rate-limit requests, and protect against security incidents.
              </li>
            </ul>
          </section>

          <section className="bg-[#211f24] border border-[#494551]/40 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">4. Security Infrastructure</h2>
            <p>
              We enforce industry-standard security protocols, including End-to-End SSL/TLS encryption for all uploads and downloads. Access to our internal processing microservices is restricted to secure network perimeters to prevent interception.
            </p>
          </section>

          <section className="bg-[#211f24] border border-[#494551]/40 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white mb-4">5. Contact Us</h2>
            <p>
              If you have any questions or feedback regarding this Privacy Policy, please contact us at:
              <br />
              <span className="text-[#cfbcff] font-semibold mt-2 block">privacy@converto.example.com</span>
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
