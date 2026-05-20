"use client";
import Link from "next/link";
import { FileText, ArrowLeft, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function TermsPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const bg       = isDark ? "#080808" : "#f8fafc";
  const textPrim = isDark ? "#f8fafc" : "#0f172a";
  const textMid  = isDark ? "#cbd5e1" : "#334155";
  const textMute = isDark ? "#64748b" : "#94a3b8";
  const border   = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";
  const navBg    = isDark ? "rgba(8,8,8,0.9)" : "rgba(248,250,252,0.9)";
  const callout  = isDark ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.05)";
  const calloutBorder = isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.15)";
  const btnBg    = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const btnBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      paras: ['By accessing or using Converto (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use the Service.'],
      items: [] as string[],
    },
    {
      title: "2. Description of Service",
      paras: ["Converto is a free, browser-based file conversion platform that converts documents, spreadsheets, presentations, and images between 68+ formats. The Service is provided free of charge for personal and educational use."],
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
      paras: ["Individual files are limited to 50 MB per upload. We reserve the right to implement rate limits to ensure fair access for all users. Abuse of the Service may result in IP-level restrictions."],
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif !important; background: ${bg} !important; transition: background 0.3s ease; }
        .gradient-text { background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        ::-webkit-scrollbar { width: 6.5px; } ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #6366f1 0%, #a855f7 50%, #ec4899 100%); border-radius: 4px; }
      `}</style>

      <div style={{ background: bg, minHeight: "100vh", display: "flex", flexDirection: "column", color: textMid, transition: "background 0.3s ease" }}>

        {/* Navbar */}
        <header style={{ position: "sticky", top: 0, zIndex: 50, background: navBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${border}` }}>
          <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Logo left */}
            <Link href="/" style={{ textDecoration: "none", fontSize: "18px", fontWeight: 800, letterSpacing: "-0.02em" }}>
              <span style={{ color: textPrim }}>Conver</span>
              <span className="gradient-text">to</span>
            </Link>

            {/* Right actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Visible theme toggle */}
              <button
                onClick={toggleTheme}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "10px", background: btnBg, border: `1px solid ${btnBorder}`, color: textMid, cursor: "pointer", fontSize: "13px", fontWeight: 500, transition: "all 0.2s" }}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={15} /> : <Moon size={15} />}
                {isDark ? "Light" : "Dark"}
              </button>
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "10px", background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", border: `1px solid ${border}`, color: textMute, textDecoration: "none", fontSize: "13px", fontWeight: 500 }}>
                <ArrowLeft size={14} /> Back
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, maxWidth: "860px", width: "100%", margin: "0 auto", padding: "64px 32px 80px" }}>
          <div style={{ marginBottom: "52px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "5px 16px", borderRadius: "100px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#a5b4fc", fontSize: "14px", fontWeight: 500, marginBottom: "24px" }}>
              <FileText size={14} /> Terms of Service
            </div>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.04em", color: textPrim, lineHeight: 1.08, marginBottom: "20px" }}>
              Simple, fair <span className="gradient-text">terms</span>
            </h1>
            <p style={{ fontSize: "18px", color: textMute, lineHeight: 1.65, maxWidth: "580px", marginBottom: "16px" }}>
              By using Converto you agree to these terms. We have kept them short and human-readable.
            </p>
            <p style={{ fontSize: "13px", color: isDark ? "#334155" : "#94a3b8" }}>Last updated: May 2026</p>
          </div>

          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.3), transparent)", marginBottom: "52px" }} />

          <div style={{ padding: "28px 32px", borderRadius: "20px", background: callout, border: `1px solid ${calloutBorder}`, marginBottom: "48px" }}>
            <p style={{ color: "#a5b4fc", fontSize: "16px", lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: "#c7d2fe", fontWeight: 700 }}>TL;DR — </strong>
              Use Converto for legal file conversions. Do not abuse the service. We provide it as-is with no warranty. That is basically it.
            </p>
          </div>

          {sections.map((section) => (
            <div key={section.title} style={{ marginBottom: "44px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: textPrim, marginBottom: "16px", letterSpacing: "-0.02em" }}>{section.title}</h2>
              {section.paras.map((p, i) => (
                <p key={i} style={{ fontSize: "16px", color: textMid, lineHeight: 1.75, marginBottom: "12px" }}>{p}</p>
              ))}
              {section.items.length > 0 && (
                <ul style={{ paddingLeft: "22px", display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
                  {section.items.map((item, i) => (
                    <li key={i} style={{ fontSize: "16px", color: textMid, lineHeight: 1.65 }}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </main>

        <footer style={{ borderTop: `1px solid ${border}`, padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <span style={{ fontSize: "14px", color: textMute, fontWeight: 600 }}>© 2026 CONVERTO.</span>
          <div style={{ display: "flex", gap: "24px" }}>
            <Link href="/privacy" style={{ fontSize: "14px", color: textMute, textDecoration: "none" }}>Privacy Policy</Link>
            <Link href="/terms" style={{ fontSize: "14px", color: "#6366f1", textDecoration: "none", fontWeight: 500 }}>Terms of Service</Link>
          </div>
        </footer>
      </div>
    </>
  );
}
