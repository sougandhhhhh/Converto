"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Compass, FileText, FileSpreadsheet, Presentation, FileImage, FileCode, ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

// Defined tools list
const ALL_TOOLS: { name: string; from: string; to: string; category: string; desc: string }[] = [
  // ── PDF ──
  { name: "PDF to DOCX",  from: "pdf",  to: "docx",  category: "pdf",  desc: "Convert PDF documents to editable Microsoft Word files." },
  { name: "PDF to PPTX",  from: "pdf",  to: "pptx",  category: "pdf",  desc: "Convert PDF slides to editable Microsoft PowerPoint decks." },
  { name: "PDF to XLSX",  from: "pdf",  to: "xlsx",  category: "pdf",  desc: "Extract tables from PDF to Excel spreadsheets." },
  { name: "PDF to TXT",   from: "pdf",  to: "txt",   category: "pdf",  desc: "Extract raw plain text from PDF documents." },
  { name: "PDF to JPG",   from: "pdf",  to: "jpg",   category: "pdf",  desc: "Convert PDF pages into high-resolution JPG images." },
  { name: "PDF to PNG",   from: "pdf",  to: "png",   category: "pdf",  desc: "Convert PDF pages into transparent PNG images." },
  { name: "PDF to WEBP",  from: "pdf",  to: "webp",  category: "pdf",  desc: "Optimize PDF pages for web distribution in WebP format." },
  { name: "PDF to HTML",  from: "pdf",  to: "html",  category: "pdf",  desc: "Convert PDF documents into clean, readable HTML pages." },
  { name: "PDF to HEIC",  from: "pdf",  to: "heic",  category: "pdf",  desc: "Convert PDF pages into HEIC image format." },
  { name: "PDF to CSV",   from: "pdf",  to: "csv",   category: "pdf",  desc: "Extract tabular data from PDF into CSV spreadsheets." },
  { name: "PDF to ZIP",   from: "pdf",  to: "zip",   category: "pdf",  desc: "Compress PDF documents into ZIP archives." },

  // ── DOCX ──
  { name: "DOCX to PDF",  from: "docx", to: "pdf",   category: "document", desc: "Convert Word documents to industry-standard PDF layout." },
  { name: "DOCX to TXT",  from: "docx", to: "txt",   category: "document", desc: "Strip formatting and convert Word text to plain TXT." },
  { name: "DOCX to HTML", from: "docx", to: "html",  category: "document", desc: "Convert Word documents to clean web pages." },
  { name: "DOCX to XLSX", from: "docx", to: "xlsx",  category: "document", desc: "Convert Word documents into Excel spreadsheets." },
  { name: "DOCX to WEBP", from: "docx", to: "webp",  category: "document", desc: "Convert Word document pages into WebP images." },
  { name: "DOCX to JPG",  from: "docx", to: "jpg",   category: "document", desc: "Convert Word document pages into JPEG images." },
  { name: "DOCX to PNG",  from: "docx", to: "png",   category: "document", desc: "Convert Word document pages into PNG images." },
  { name: "DOCX to PPTX", from: "docx", to: "pptx",  category: "document", desc: "Convert Word documents into PowerPoint presentations." },
  { name: "DOCX to ZIP",  from: "docx", to: "zip",   category: "document", desc: "Compress Word documents into ZIP archives." },
  { name: "DOCX to HEIC", from: "docx", to: "heic",  category: "document", desc: "Convert Word document pages into HEIC images." },

  // ── PPTX ──
  { name: "PPTX to PDF",  from: "pptx", to: "pdf",   category: "presentation", desc: "Export PowerPoint slide presentations directly to PDF." },
  { name: "PPTX to DOCX", from: "pptx", to: "docx",  category: "presentation", desc: "Convert PowerPoint presentations into Word documents." },
  { name: "PPTX to TXT",  from: "pptx", to: "txt",   category: "presentation", desc: "Extract text content from PowerPoint presentations." },
  { name: "PPTX to JPG",  from: "pptx", to: "jpg",   category: "presentation", desc: "Save PowerPoint slides as separate JPEG images." },
  { name: "PPTX to PNG",  from: "pptx", to: "png",   category: "presentation", desc: "Export PowerPoint slides as transparent PNG images." },
  { name: "PPTX to WEBP", from: "pptx", to: "webp",  category: "presentation", desc: "Optimize PowerPoint slides as WebP images." },
  { name: "PPTX to HTML", from: "pptx", to: "html",  category: "presentation", desc: "Convert PowerPoint slides into HTML presentations." },
  { name: "PPTX to HEIC", from: "pptx", to: "heic",  category: "presentation", desc: "Convert PowerPoint slides into HEIC images." },
  { name: "PPTX to ZIP",  from: "pptx", to: "zip",   category: "presentation", desc: "Compress PowerPoint files into ZIP archives." },

  // ── XLSX ──
  { name: "XLSX to PDF",  from: "xlsx", to: "pdf",   category: "spreadsheet", desc: "Convert spreadsheets to readable PDF page printouts." },
  { name: "XLSX to CSV",  from: "xlsx", to: "csv",   category: "spreadsheet", desc: "Convert Excel sheets to comma-separated text sheets." },
  { name: "XLSX to TXT",  from: "xlsx", to: "txt",   category: "spreadsheet", desc: "Extract plain text content from Excel spreadsheets." },
  { name: "XLSX to HTML", from: "xlsx", to: "html",  category: "spreadsheet", desc: "Convert Excel spreadsheets into HTML table format." },
  { name: "XLSX to DOCX", from: "xlsx", to: "docx",  category: "spreadsheet", desc: "Convert Excel spreadsheets into Word documents." },
  { name: "XLSX to JSON", from: "xlsx", to: "json",  category: "spreadsheet", desc: "Export Excel data as structured JSON files." },
  { name: "XLSX to XML",  from: "xlsx", to: "xml",   category: "spreadsheet", desc: "Convert Excel spreadsheets into XML data files." },
  { name: "XLSX to ZIP",  from: "xlsx", to: "zip",   category: "spreadsheet", desc: "Compress Excel files into ZIP archives." },
  { name: "XLSX to JPG",  from: "xlsx", to: "jpg",   category: "spreadsheet", desc: "Convert spreadsheet pages into JPEG images." },
  { name: "XLSX to PNG",  from: "xlsx", to: "png",   category: "spreadsheet", desc: "Convert spreadsheet pages into PNG images." },
  { name: "XLSX to HEIC", from: "xlsx", to: "heic",  category: "spreadsheet", desc: "Convert spreadsheet pages into HEIC images." },

  // ── TXT ──
  { name: "TXT to PDF",  from: "txt", to: "pdf",   category: "text", desc: "Convert plain text files into PDF documents." },
  { name: "TXT to DOCX", from: "txt", to: "docx",  category: "text", desc: "Convert plain text into Word documents." },
  { name: "TXT to HTML", from: "txt", to: "html",  category: "text", desc: "Convert plain text into HTML web pages." },
  { name: "TXT to CSV",  from: "txt", to: "csv",   category: "text", desc: "Structure plain text into CSV spreadsheet format." },
  { name: "TXT to JSON", from: "txt", to: "json",  category: "text", desc: "Convert plain text data into JSON format." },
  { name: "TXT to XML",  from: "txt", to: "xml",   category: "text", desc: "Convert plain text into XML structured data." },

  // ── MD ──
  { name: "MD to HTML", from: "md", to: "html", category: "text", desc: "Convert Markdown documents into HTML web pages." },
  { name: "MD to PDF",  from: "md", to: "pdf",  category: "text", desc: "Convert Markdown files into PDF documents." },
  { name: "MD to TXT",  from: "md", to: "txt",  category: "text", desc: "Convert Markdown documents into plain text files." },

  // ── JPG ──
  { name: "JPG to PNG",   from: "jpg",  to: "png",   category: "image", desc: "Change JPG graphics to PNG formatting." },
  { name: "JPG to WEBP",  from: "jpg",  to: "webp",  category: "image", desc: "Compress JPEG images to lightweight WebP formats." },
  { name: "JPG to PDF",   from: "jpg",  to: "pdf",   category: "image", desc: "Compile JPG photos into a single PDF document." },
  { name: "JPG to GIF",   from: "jpg",  to: "gif",   category: "image", desc: "Convert JPEG images into animated GIF format." },
  { name: "JPG to DOCX",  from: "jpg",  to: "docx",  category: "image", desc: "Embed JPEG images into Word documents." },
  { name: "JPG to HEIC",  from: "jpg",  to: "heic",  category: "image", desc: "Convert JPEG images into HEIC format." },
  { name: "JPG to AVIF",  from: "jpg",  to: "avif",  category: "image", desc: "Convert JPEG images into AVIF format." },

  // ── PNG ──
  { name: "PNG to JPG",   from: "png",  to: "jpg",   category: "image", desc: "Convert PNG images to standard JPG format." },
  { name: "PNG to WEBP",  from: "png",  to: "webp",  category: "image", desc: "Convert PNG images to lightweight WebP format." },
  { name: "PNG to PDF",   from: "png",  to: "pdf",   category: "image", desc: "Compile PNG screenshots into a PDF workbook." },
  { name: "PNG to GIF",   from: "png",  to: "gif",   category: "image", desc: "Convert PNG images into animated GIF format." },
  { name: "PNG to DOCX",  from: "png",  to: "docx",  category: "image", desc: "Embed PNG images into Word documents." },
  { name: "PNG to HEIC",  from: "png",  to: "heic",  category: "image", desc: "Convert PNG images into HEIC format." },
  { name: "PNG to AVIF",  from: "png",  to: "avif",  category: "image", desc: "Convert PNG images into AVIF format." },

  // ── WEBP ──
  { name: "WEBP to JPG",  from: "webp", to: "jpg",   category: "image", desc: "Convert WebP images to standard JPEG format." },
  { name: "WEBP to PNG",  from: "webp", to: "png",   category: "image", desc: "Convert WebP images to PNG format." },
  { name: "WEBP to GIF",  from: "webp", to: "gif",   category: "image", desc: "Convert WebP images into animated GIF format." },
  { name: "WEBP to HEIC", from: "webp", to: "heic",  category: "image", desc: "Convert WebP images into HEIC format." },
  { name: "WEBP to AVIF", from: "webp", to: "avif",  category: "image", desc: "Convert WebP images into AVIF format." },
  { name: "WEBP to PDF",  from: "webp", to: "pdf",   category: "image", desc: "Compile WebP images into a PDF document." },

  // ── GIF ──
  { name: "GIF to JPG",  from: "gif", to: "jpg",   category: "image", desc: "Convert GIF images into JPEG format." },
  { name: "GIF to PNG",  from: "gif", to: "png",   category: "image", desc: "Convert GIF images into PNG format." },
  { name: "GIF to WEBP", from: "gif", to: "webp",  category: "image", desc: "Convert GIF images into WebP format." },
  { name: "GIF to HEIC", from: "gif", to: "heic",  category: "image", desc: "Convert GIF images into HEIC format." },
  { name: "GIF to AVIF", from: "gif", to: "avif",  category: "image", desc: "Convert GIF images into AVIF format." },
  { name: "GIF to PDF",  from: "gif", to: "pdf",   category: "image", desc: "Compile GIF images into a PDF document." },

  // ── HEIC ──
  { name: "HEIC to JPG",  from: "heic", to: "jpg",   category: "image", desc: "Convert iPhone HEIC photos to compatible JPG files." },
  { name: "HEIC to PNG",  from: "heic", to: "png",   category: "image", desc: "Convert iOS HEIC images to standard PNGs." },
  { name: "HEIC to WEBP", from: "heic", to: "webp",  category: "image", desc: "Convert HEIC images to WebP format for web use." },
  { name: "HEIC to PDF",  from: "heic", to: "pdf",   category: "image", desc: "Compile HEIC images into a PDF document." },
  { name: "HEIC to GIF",  from: "heic", to: "gif",   category: "image", desc: "Convert HEIC images into animated GIF format." },
  { name: "HEIC to DOCX", from: "heic", to: "docx",  category: "image", desc: "Embed HEIC images into Word documents." },
  { name: "HEIC to AVIF", from: "heic", to: "avif",  category: "image", desc: "Convert HEIC images into AVIF format." },

  // ── AVIF ──
  { name: "AVIF to JPG",  from: "avif", to: "jpg",   category: "image", desc: "Convert AVIF images to standard JPEG format." },
  { name: "AVIF to PNG",  from: "avif", to: "png",   category: "image", desc: "Convert AVIF images to PNG format." },
  { name: "AVIF to WEBP", from: "avif", to: "webp",  category: "image", desc: "Convert AVIF images to WebP format." },
  { name: "AVIF to GIF",  from: "avif", to: "gif",   category: "image", desc: "Convert AVIF images into animated GIF format." },
  { name: "AVIF to HEIC", from: "avif", to: "heic",  category: "image", desc: "Convert AVIF images into HEIC format." },
  { name: "AVIF to PDF",  from: "avif", to: "pdf",   category: "image", desc: "Compile AVIF images into a PDF document." },

  // ── CSV ──
  { name: "CSV to JSON", from: "csv", to: "json", category: "data", desc: "Convert CSV spreadsheets into JSON format." },
  { name: "CSV to XML",  from: "csv", to: "xml",  category: "data", desc: "Convert CSV data into XML structured format." },
  { name: "CSV to HTML", from: "csv", to: "html", category: "data", desc: "Convert CSV data into HTML table format." },
  { name: "CSV to TXT",  from: "csv", to: "txt",  category: "data", desc: "Convert CSV spreadsheets into plain text." },

  // ── JSON ──
  { name: "JSON to CSV", from: "json", to: "csv",  category: "data", desc: "Convert JSON data into CSV spreadsheet format." },
  { name: "JSON to XML", from: "json", to: "xml",  category: "data", desc: "Convert JSON data into XML structured format." },
  { name: "JSON to HTML", from: "json", to: "html", category: "data", desc: "Convert JSON data into HTML pages." },
  { name: "JSON to TXT", from: "json", to: "txt",  category: "data", desc: "Convert JSON data into plain text." },

  // ── XML ──
  { name: "XML to CSV",  from: "xml", to: "csv",  category: "data", desc: "Convert XML data into CSV spreadsheet format." },
  { name: "XML to JSON", from: "xml", to: "json", category: "data", desc: "Convert XML data into JSON format." },
  { name: "XML to HTML", from: "xml", to: "html", category: "data", desc: "Convert XML data into HTML pages." },
  { name: "XML to TXT",  from: "xml", to: "txt",  category: "data", desc: "Convert XML data into plain text." },

  // ── HTML ──
  { name: "HTML to PDF", from: "html", to: "pdf",  category: "web", desc: "Convert HTML pages into PDF documents." },
  { name: "HTML to CSV", from: "html", to: "csv",  category: "web", desc: "Extract data from HTML tables into CSV." },
  { name: "HTML to JSON", from: "html", to: "json", category: "web", desc: "Convert HTML content into JSON format." },
  { name: "HTML to XML", from: "html", to: "xml",  category: "web", desc: "Convert HTML content into XML structured format." },
  { name: "HTML to TXT", from: "html", to: "txt",  category: "web", desc: "Strip HTML tags and convert to plain text." },
];

const CATEGORIES = [
  { id: "all",         label: "All Tools",    icon: Compass },
  { id: "pdf",         label: "PDF Tools",    icon: FileText },
  { id: "document",    label: "Word Tools",   icon: FileCode },
  { id: "spreadsheet", label: "Excel Tools",  icon: FileSpreadsheet },
  { id: "presentation",label: "PowerPoint",   icon: Presentation },
  { id: "image",       label: "Image Tools",  icon: FileImage },
  { id: "text",        label: "Text Tools",   icon: FileCode },
  { id: "data",        label: "Data Tools",   icon: FileCode },
  { id: "web",         label: "Web Tools",    icon: FileCode },
];

export default function ToolsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTools = useMemo(() => {
    return ALL_TOOLS.filter((tool) => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "all" || tool.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      
      {/* Decorative Blur */}
      <div className="absolute top-[-5%] left-[20%] w-[45vw] h-[45vw] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Global Navbar */}
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Block */}
        <div className="max-w-2xl mx-auto mb-12 flex flex-col">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6 self-start cursor-pointer">
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-center">
            Browse All <span className="gradient-brand-text">Conversion</span> Tools
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground text-center">
            Search our directory of secure, high-precision format encoders and converters.
          </p>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="flex flex-col gap-6 mb-12">
          
          {/* Search bar */}
          <div className="relative w-full max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search e.g., 'pdf to docx', 'excel'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-card/60 border border-border/40 text-foreground placeholder-muted-foreground focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 shadow-sm transition-all text-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground touch-target"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-2 scrollbar-none max-w-full">
            {CATEGORIES.map((cat) => {
              const IconComponent = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full border transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card/40 text-muted-foreground border-border/40 hover:text-foreground hover:bg-secondary/40"
                  }`}
                >
                  <IconComponent size={13} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tools Grid */}
        <motion.div 
          layout 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool) => {
              // Map colors for layout categories
              const accentColor = 
                tool.category === "pdf" ? "var(--rose-500, #ef4444)" :
                tool.category === "spreadsheet" ? "var(--emerald-500, #10b981)" :
                tool.category === "presentation" ? "var(--pink-500, #ec4899)" :
                tool.category === "document" ? "var(--violet-500, #8b5cf6)" :
                "var(--indigo-500, #6366f1)";

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={tool.name}
                  onClick={() => router.push(`/convert/${tool.from}-to-${tool.to}`)}
                  className="group relative flex flex-col justify-between p-6 rounded-2xl border border-border/40 bg-card/60 hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/[0.02] cursor-pointer transition-all duration-200 select-none overflow-hidden"
                >
                  <div>
                    {/* Header: source icon badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span 
                        className="text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border"
                        style={{
                          borderColor: `${accentColor}30`,
                          backgroundColor: `${accentColor}10`,
                          color: accentColor
                        }}
                      >
                        {tool.category}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                        {tool.from} → {tool.to}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-indigo-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground mt-6 group-hover:translate-x-1.5 transition-transform duration-200">
                    Open Tool <ArrowRight size={13} className="text-indigo-500" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredTools.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-card/20 rounded-3xl border border-border/30 max-w-md mx-auto"
          >
            <Compass size={40} className="text-muted-foreground mx-auto mb-4 animate-pulse" />
            <h3 className="text-base font-bold text-foreground mb-1">No matching tools found</h3>
            <p className="text-xs text-muted-foreground px-4">
              Try searching with another query or reset your category filter tabs.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-6 px-4 py-2 text-xs font-bold bg-foreground text-background rounded-full hover:opacity-90 transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </main>

      {/* Global Footer */}
      <Footer />

    </div>
  );
}
