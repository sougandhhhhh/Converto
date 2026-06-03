"use client";

import React, { useState } from "react";
import { Check, HelpCircle, ArrowRight, Star, ShieldCheck, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("annually");

  const plans = [
    {
      name: "Free Student",
      desc: "Perfect for quick homework assignments and standard conversion jobs.",
      price: { monthly: 0, annually: 0 },
      features: [
        "Unlimited daily conversions",
        "Up to 50 MB file size limit",
        "LibreOffice precision engine",
        "Immediate cache deletions",
        "Web sandbox mode access"
      ],
      cta: "Get Started",
      featured: false,
      glow: "border-border/40 bg-card/60"
    },
    {
      name: "Pro Scholar",
      desc: "For heavy research pipelines, thesis papers, and high-volume media processing.",
      price: { monthly: 8, annually: 5 },
      features: [
        "Everything in Free Student",
        "High-priority server queue",
        "Up to 500 MB file size limit",
        "Bulk download as ZIP archives",
        "Advanced folder directory mappings",
        "Dedicated student support"
      ],
      cta: "Upgrade to Pro",
      featured: true,
      glow: "border-indigo-500/50 bg-indigo-500/[0.02]"
    },
    {
      name: "Campus Team",
      desc: "For study groups, departments, and developer APIs integration.",
      price: { monthly: 24, annually: 15 },
      features: [
        "Everything in Pro Scholar",
        "Simultaneous parallel threads",
        "Developer API endpoints access",
        "Group usage diagnostics",
        "Custom retention timer control",
        "24/7 priority support"
      ],
      cta: "Contact Sales",
      featured: false,
      glow: "border-border/40 bg-card/60"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden text-foreground transition-colors duration-300">
      
      {/* Global Navbar */}
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Simple, Transparent <span className="gradient-brand-text">Pricing</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-10">
            Converto is 100% free for students. Upgrade if you need larger size capacities or team collaboration options.
          </p>

          {/* Toggle Billing switch */}
          <div className="inline-flex items-center gap-1.5 p-1.5 rounded-full bg-card border border-border/50 select-none shadow-sm">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                billingPeriod === "monthly"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annually")}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                billingPeriod === "annually"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annually <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[9px] font-extrabold">Save 35%</span>
            </button>
          </div>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between p-8 rounded-3xl border backdrop-blur-sm transition-all duration-300 ${
                plan.glow
              } ${plan.featured ? "shadow-xl shadow-indigo-500/[0.02]" : "hover:border-foreground/10 hover:shadow-lg"}`}
            >
              {/* Highlight badge for Pro */}
              {plan.featured && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500 border border-indigo-400 text-[10px] font-extrabold text-white select-none shadow-md">
                  <Star size={10} className="fill-current" /> Recommended
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">{plan.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-6">{plan.desc}</p>

                {/* Price block */}
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-3xl sm:text-4xl font-extrabold text-foreground">
                    ${billingPeriod === "monthly" ? plan.price.monthly : plan.price.annually}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">/ month</span>
                </div>

                <div className="h-px bg-border/30 mb-8" />

                {/* Features list */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-foreground/95 leading-tight font-medium">
                      <Check size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action CTA */}
              <button
                className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                  plan.featured
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-600"
                    : "bg-secondary text-foreground hover:bg-secondary/80 border border-border/40"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Security / FAQ small section */}
        <div className="p-6 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-sm max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground">Student Security Guarantee</h4>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Whether you use the free plan or a paid scholar tier, our zero data retention security policy is identically enforced.
              </p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1 select-none">
            <Sparkles size={13} className="text-indigo-400" /> Fully Encrypted Transit
          </div>
        </div>

      </main>

      {/* Global Footer */}
      <Footer />

    </div>
  );
}
