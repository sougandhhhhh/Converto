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
    <div className="flex flex-col min-h-screen relative bg-background text-foreground transition-colors duration-300">
      
      {/* Global Navbar */}
      <Navbar />

      <main className="flex-1 w-full positivus-container py-16">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Simple, Transparent <span className="text-[#b9ff66]">Pricing</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-10">
            Converto is 100% free for students. Upgrade if you need larger size capacities or team collaboration options.
          </p>

          {/* Toggle Billing switch */}
          <div className="inline-flex items-center gap-2 p-2 rounded-full bg-card border border-border select-none">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-3 text-sm font-semibold rounded-full transition-all cursor-pointer ${
                billingPeriod === "monthly"
                  ? "positivus-btn-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("annually")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full transition-all cursor-pointer ${
                billingPeriod === "annually"
                  ? "positivus-btn-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annually <span className="px-3 py-1 rounded-full positivus-card-green text-[#191a23] text-xs font-extrabold">Save 35%</span>
            </button>
          </div>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[40px] max-xl:gap-[30px] mb-20 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative flex flex-col justify-between p-8 rounded-[30px] border transition-all duration-300 ${
                plan.featured 
                  ? 'positivus-card-green text-[#191a23] shadow-xl' 
                  : index % 2 === 0 
                  ? 'positivus-card-dark' 
                  : 'positivus-card'
              } ${plan.featured ? "" : "hover:border-foreground/10 hover:shadow-lg"}`}
            >
              {/* Highlight badge for Pro */}
              {plan.featured && (
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#191a23] border border-[#191a23] text-xs font-extrabold text-white select-none shadow-md">
                  <Star size={12} className="fill-current" /> Recommended
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{plan.desc}</p>

                {/* Price block */}
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl sm:text-5xl font-bold">
                    ${billingPeriod === "monthly" ? plan.price.monthly : plan.price.annually}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">/ month</span>
                </div>

                <div className="h-px bg-border mb-8" />

                {/* Features list */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-tight font-medium">
                      <Check size={18} className={`${plan.featured ? "text-[#191a23]" : "text-[#b9ff66]"} flex-shrink-0 mt-0.5`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action CTA */}
              <button
                className={`w-full py-4 rounded-[14px] text-sm font-bold transition-all cursor-pointer ${
                  plan.featured
                    ? "bg-[#191a23] text-white hover:bg-[#2a2a2a]"
                    : "positivus-btn-primary"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Security / FAQ small section */}
        <div className="p-8 rounded-[30px] border positivus-card max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl positivus-card-green">
              <ShieldCheck size={24} className="text-[#191a23]" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-foreground">Student Security Guarantee</h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                Whether you use the free plan or a paid scholar tier, our zero data retention security policy is identically enforced.
              </p>
            </div>
          </div>
          <div className="text-sm text-muted-foreground font-semibold flex items-center gap-2 select-none">
            <Sparkles size={16} className="text-[#b9ff66]" /> Fully Encrypted Transit
          </div>
        </div>

      </main>

      {/* Global Footer */}
      <Footer />

    </div>
  );
}
