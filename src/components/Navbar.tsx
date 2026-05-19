"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Sun, Moon, HelpCircle, User, LayoutDashboard, Compass, CreditCard, Settings } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = theme === "dark";

  const navLinks = [
    { name: "Convert", href: "/", icon: Compass },
    { name: "All Tools", href: "/tools", icon: Compass },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Pricing", href: "/pricing", icon: CreditCard },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-extrabold tracking-tight select-none">
            <span className="text-foreground">Conver</span>
            <span className="gradient-brand-text">to</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-indicator"
                      className="absolute inset-0 bg-secondary/80 rounded-full -z-10 border border-border/20"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="touch-target rounded-full p-2 text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-all focus:outline-none"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Sign In Mock Trigger */}
          <button
            onClick={() => handleLinkClick("/login")}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full bg-foreground text-background hover:opacity-90 transition-all cursor-pointer shadow-sm shadow-foreground/10"
          >
            <User size={13} /> Sign In
          </button>

          {/* Hamburger Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="touch-target p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/60 rounded-full md:hidden transition-all focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile sliding navigation panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="fixed right-0 top-16 bottom-0 z-40 w-full max-w-[280px] bg-background border-l border-border/50 p-6 md:hidden flex flex-col justify-between"
            >
              <div className="space-y-6">
                <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">Navigation</p>
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const IconComponent = link.icon;
                    return (
                      <button
                        key={link.href}
                        onClick={() => handleLinkClick(link.href)}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${
                          isActive
                            ? "bg-secondary text-foreground font-semibold border border-border/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                        }`}
                      >
                        <IconComponent size={16} />
                        {link.name}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Profile Actions */}
              <div className="space-y-3 pt-6 border-t border-border/40">
                <button
                  onClick={() => handleLinkClick("/login")}
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-foreground text-background font-semibold text-sm transition-all"
                >
                  <User size={15} /> Sign In
                </button>
                <div className="text-center">
                  <span className="text-xs text-muted-foreground font-medium">Converto Student Platform v1.0</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
