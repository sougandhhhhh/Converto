"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Mail, Lock, User, ShieldCheck, ArrowRight, Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLogin, setIsLogin] = useState(pathname !== "/register");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; name?: string } = {};
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (!isLogin && !name) {
      newErrors.name = "Full name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate successful auth and redirect to dashboard
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative bg-background text-foreground transition-colors duration-300">
      
      {/* Global Navbar */}
      <Navbar />

      <main className="flex-1 flex items-center justify-center positivus-container py-16">
        <div className="w-full max-w-[420px]">
          
          {/* Header branding */}
          <div className="text-center mb-8">
            <Link href="/" className="text-3xl font-bold tracking-tight select-none">
              <span className="text-foreground">Conver</span>
              <span className="text-[#b9ff66]">to</span>
            </Link>
            <h1 className="text-xl font-bold text-foreground mt-4">
              {isLogin ? "Welcome back to Converto" : "Create your student account"}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {isLogin ? "Sign in to manage your conversions." : "Sign up to track and access files from any device."}
            </p>
          </div>

          {/* Form wrapper */}
          <div className="p-8 sm:p-10 rounded-[30px] border positivus-card shadow-xl">
            
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <AnimatePresence mode="popLayout" initial={false}>
                {/* Full name input for sign up */}
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5"
                  >
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-[14px] bg-background border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#b9ff66] transition-colors"
                      />
                    </div>
                    {errors.name && <p className="text-xs text-rose-500 font-semibold">{errors.name}</p>}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-[14px] bg-background border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#b9ff66] transition-colors"
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-500 font-semibold">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                  {isLogin && (
                    <button 
                      type="button"
                      onClick={() => alert("Password reset link sent to mock email address.")}
                      className="text-xs font-semibold text-[#b9ff66] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 rounded-[14px] bg-background border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-[#b9ff66] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground touch-target"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-rose-500 font-semibold">{errors.password}</p>}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-[14px] positivus-btn-primary font-bold text-sm cursor-pointer"
              >
                {isLogin ? "Sign In" : "Create Account"} <ArrowRight size={16} />
              </button>
            </form>

            <div className="relative my-6 text-center select-none">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
              <span className="relative bg-card/10 backdrop-blur-sm px-3 text-xs font-semibold text-muted-foreground uppercase">or continue with</span>
            </div>

            {/* Social credentials */}
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] border border-border bg-background hover:bg-secondary text-sm font-semibold cursor-pointer transition-colors"
              >
                <svg className="w-4 h-4 text-rose-500 mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.41 0-6.19-2.78-6.19-6.19s2.78-6.19 6.19-6.19c1.47 0 2.82.51 3.9 1.37l3.018-3.018C18.675 2.43 15.66 1.31 12.24 1.31 5.92 1.31.78 6.45.78 12.77s5.14 11.46 11.46 11.46c6.6 0 10.97-4.63 10.97-11.16 0-.75-.07-1.32-.2-1.785H12.24z"/>
                </svg> Google
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] border border-border bg-background hover:bg-secondary text-sm font-semibold cursor-pointer transition-colors"
              >
                <svg className="w-4 h-4 text-foreground mr-1" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg> Github
              </button>
            </div>

            {/* Toggles */}
            <div className="text-center mt-6">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-sm text-muted-foreground hover:text-foreground font-semibold"
              >
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span className="text-[#b9ff66] font-bold hover:underline">
                  {isLogin ? "Sign Up" : "Log In"}
                </span>
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />

    </div>
  );
}
