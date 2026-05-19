"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Compass, FileText, FileSpreadsheet, Presentation, FileImage, FileCode, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

// Defined tools list
const ALL_TOOLS = [
  { name: "PDF to DOCX",  from: "pdf",  to: "docx",  category: "pdf",  desc: "Convert PDF documents to editable Microsoft Word files." },
  { name: "PDF to PPTX",  from: "pdf",  to: "pptx",  category: "pdf",  desc: "Convert PDF slides to editable Microsoft PowerPoint decks." },
  { name: "PDF to XLSX",  from: "pdf",  to: "xlsx",  category: "pdf",  desc: "Extract tables from PDF to Excel spreadsheets." },
  { name: "PDF to TXT",   from: "pdf",  to: "txt",   category: "pdf",  desc: "Extract raw plain text from PDF documents." },
  { name: "PDF to JPG",   from: "pdf",  to: "jpg",   category: "pdf",  desc: "Convert PDF pages into high-resolution JPG images." },
  { name: "PDF to PNG",   from: "pdf",  to: "png",   category: "pdf",  desc: "Convert PDF pages into transparent PNG images." },
  { name: "PDF to WEBP",  from: "pdf",  to: "webp",  category: "pdf",  desc: "Optimize PDF pages for web distribution in WebP format." },
  
  { name: "DOCX to PDF",  from: "docx", to: "pdf",   category: "document", desc: "Convert Word documents to industry-standard PDF layout." },
  { name: "DOCX to TXT",  from: "docx", to: "txt",   category: "document", desc: "Strip formatting and convert Word text to plain TXT." },
  { name: "DOCX to HTML", from: "docx", to: "html",  category: "document", desc: "Convert Word documents to clean web pages." },
  
  { name: "PPTX to PDF",  from: "pptx", to: "pdf",   category: "presentation", desc: "Export PowerPoint slide presentations directly to PDF." },
  { name: "PPTX to JPG",  from: "pptx", to: "jpg",   category: "presentation", desc: "Save PowerPoint slides as separate JPEG images." },
  
  { name: "XLSX to PDF",  from: "xlsx", to: "pdf",   category: "spreadsheet", desc: "Convert spreadsheets to readable PDF page printouts." },
  { name: "XLSX to CSV",  from: "xlsx", to: "csv",   category: "spreadsheet", desc: "Convert Excel sheets to comma-separated text sheets." },
  
  { name: "JPG to PNG",   from: "jpg",  to: "png",   category: "image", desc: "Change JPG graphics to PNG formatting." },
  { name: "JPG to WEBP",  from: "jpg",  to: "webp",  category: "image", desc: "Compress JPEG images to lightweight WebP formats." },
  { name: "JPG to PDF",   from: "jpg",  to: "pdf",   category: "image", desc: "Compile JPG photos into a single PDF document." },
  
  { name: "PNG to JPG",   from: "png",  to: "jpg",   category: "image", desc: "Convert PNG images to standard JPG format." },
  { name: "PNG to PDF",   from: "png",  to: "pdf",   category: "image", desc: "Compile PNG screenshots into a PDF workbook." },
  
  { name: "HEIC to JPG",  from: "heic", to: "jpg",   category: "image", desc: "Convert iPhone HEIC photos to compatible JPG files." },
  { name: "HEIC to PNG",  from: "heic", to: "png",   category: "image", desc: "Convert iOS HEIC images to standard PNGs." }
];

const CATEGORIES = [
  { id: "all",         label: "All Tools",    icon: Compass },
  { id: "pdf",         label: "PDF Tools",    icon: FileText },
  { id: "document",    label: "Word Tools",   icon: FileCode },
  { id: "spreadsheet", label: "Excel Tools",  icon: FileSpreadsheet },
  { id: "presentation",label: "PowerPoint",   icon: Presentation },
  { id: "image",       label: "Image Tools",  icon: FileImage }
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
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Browse All <span className="gradient-brand-text">Conversion</span> Tools
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
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
