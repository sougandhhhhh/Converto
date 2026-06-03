"use client";

import React, { useState } from "react";
import { 
  BarChart3, Clock, Database, Leaf, Download, 
  Trash2, FileText, RefreshCw, CheckCircle2, 
  Search, ArrowRight, ArrowUpRight, ShieldCheck 
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_HISTORY = [
  { id: "1", name: "CS_Assignment_4.docx", from: "docx", to: "pdf", date: "Today, 2:40 PM", size: "2.4 MB", status: "completed" },
  { id: "2", name: "Lecture_Notes_Slides.pptx", from: "pptx", to: "pdf", date: "Yesterday, 10:15 AM", size: "14.2 MB", status: "completed" },
  { id: "3", name: "Research_Paper_Draft.docx", from: "docx", to: "pdf", date: "May 18, 2026", size: "1.1 MB", status: "completed" },
  { id: "4", name: "Receipt_Scan_293.jpg", from: "jpg", to: "png", date: "May 17, 2026", size: "4.8 MB", status: "completed" },
  { id: "5", name: "Database_Schema_Export.xlsx", from: "xlsx", to: "pdf", date: "May 15, 2026", size: "8.9 MB", status: "failed", error: "Workbook password protected" },
  { id: "6", name: "Lab_Report_Final.pdf", from: "pdf", to: "docx", date: "May 12, 2026", size: "3.5 MB", status: "completed" }
];

export default function DashboardPage() {
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    { label: "Total Conversions", value: "34 files", icon: BarChart3, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Data Saved", value: "185.4 MB", icon: Database, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Avg. Conversion Speed", value: "1.8s", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Carbon Savings", value: "120 sheets", icon: Leaf, color: "text-teal-500", bg: "bg-teal-500/10" }
  ];

  const filteredHistory = history.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden text-foreground transition-colors duration-300">
      
      {/* Global Navbar */}
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-border/40">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Student <span className="gradient-brand-text">Dashboard</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
              Manage your conversions, view performance stats, and download converted formats.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-semibold text-xs select-none">
            <ShieldCheck size={14} /> Local cache secure
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index} 
                className="p-5 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm shadow-sm select-none"
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl mb-4 ${stat.bg} ${stat.color}`}>
                  <IconComponent size={18} />
                </div>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-lg sm:text-2xl font-black tracking-tight text-foreground mt-1">{stat.value}</h3>
              </div>
            );
          })}
        </div>

        {/* History Table Container */}
        <div className="p-6 rounded-3xl border border-border/40 bg-card/50 backdrop-blur-sm">
          
          {/* List Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-6">
            <h2 className="text-lg font-bold tracking-tight text-foreground">Recent Conversions</h2>
            
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <input
                type="text"
                placeholder="Search history name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-background border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-indigo-500/50 shadow-inner text-xs"
              />
            </div>
          </div>

          {/* History List */}
          <div className="overflow-x-auto">
            <div className="min-w-[600px] divide-y divide-border/30">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 pb-3 text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">
                <div className="col-span-5">File Name</div>
                <div className="col-span-2">Format</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {/* Rows */}
              <AnimatePresence initial={false}>
                {filteredHistory.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="grid grid-cols-12 gap-4 py-4 items-center px-2 hover:bg-secondary/20 rounded-xl transition-all duration-150"
                  >
                    {/* Name */}
                    <div className="col-span-5 flex items-center gap-3 min-w-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex-shrink-0">
                        <FileText size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-foreground truncate max-w-[200px]">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{item.date}</p>
                      </div>
                    </div>

                    {/* Format direction */}
                    <div className="col-span-2 text-xs font-semibold text-muted-foreground">
                      <span className="uppercase">{item.from}</span>
                      <span className="mx-1.5">→</span>
                      <span className="uppercase text-foreground font-bold">{item.to}</span>
                    </div>

                    {/* Size */}
                    <div className="col-span-2 text-xs font-semibold text-muted-foreground">
                      {item.size}
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      {item.status === "completed" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-bold text-emerald-500">
                          <CheckCircle2 size={10} /> Completed
                        </span>
                      ) : (
                        <span 
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/25 text-[10px] font-bold text-rose-500 cursor-help"
                          title={item.error}
                        >
                          <Clock size={10} /> Failed
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-end gap-1.5">
                      {item.status === "completed" ? (
                        <button
                          onClick={() => alert(`Simulated download for ${item.name}`)}
                          className="touch-target p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer"
                          aria-label="Download again"
                        >
                          <Download size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={() => alert(`Simulating retry for ${item.name}`)}
                          className="touch-target p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer"
                          aria-label="Retry conversion"
                        >
                          <RefreshCw size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="touch-target p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                        aria-label="Delete record"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredHistory.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-xs">
                  No recent files or conversions matched the search filter.
                </div>
              )}
            </div>
          </div>
        </div>

      </main>

      {/* Global Footer */}
      <Footer />

    </div>
  );
}
