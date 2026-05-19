"use client";

import React from "react";
import Link from "next/link";
import { Compass, ArrowLeft, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      
      {/* Background Decorative glow panels */}
      <div className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Global Navbar */}
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 text-center max-w-md mx-auto">
        {/* Animated Error Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative inline-block mb-6 select-none"
        >
          <span className="text-[120px] font-black tracking-tighter leading-none opacity-10 bg-gradient-to-b from-foreground to-transparent bg-clip-text text-transparent">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-black tracking-tight gradient-brand-text">Lost in Transit</span>
          </div>
        </motion.div>

        {/* Error Info */}
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Page Not Found</h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-10 font-medium">
          The link you requested does not exist, or the format conversion route specified is currently unsupported.
        </p>

        {/* Action Triggers */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 px-6 py-3 rounded-2xl bg-foreground text-background font-bold text-xs hover:opacity-90 transition-all"
          >
            <ArrowLeft size={13} /> Back
          </Link>
          <Link
            href="/tools"
            className="flex items-center justify-center gap-1.5 px-6 py-3 rounded-2xl bg-secondary/80 hover:bg-secondary border border-border/40 font-semibold text-xs text-foreground transition-all"
          >
            <Compass size={13} /> Browse Tools
          </Link>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />

    </div>
  );
}
