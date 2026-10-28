"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { SparkleStar, GlitterField } from "./GlitterEffects";
import { AnimatedGirlAvatar } from "./AnimatedGirlAvatar";
import { User, KeyRound, Eye, EyeOff, ArrowRight } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { login, quickLogin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      login(username, password, true);
      setIsSubmitting(false);
    }, 200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#F7F2EB] dark:bg-[#150E0A] text-[#2A1810] dark:text-[#FAF5F0] relative overflow-hidden transition-colors selection:bg-[#E8D9C8] selection:text-[#2A1810]">
      {/* Moving Glitter & Twinkling Sparkles Background */}
      <GlitterField count={14} />

      {/* Aesthetic Luxury Ambient Radial Glows */}
      <div className="absolute -top-36 -left-36 w-96 h-96 rounded-full bg-gradient-to-br from-[#E8D4C0]/60 via-[#D9BEA5]/30 to-transparent dark:from-[#3D2417]/50 dark:via-[#26150D]/20 blur-3xl pointer-events-none ambient-glow" />
      <div className="absolute -bottom-36 -right-36 w-96 h-96 rounded-full bg-gradient-to-tl from-[#E2C7B0]/50 via-[#CFAC8F]/25 to-transparent dark:from-[#351D12]/40 dark:via-[#1F1008]/20 blur-3xl pointer-events-none ambient-glow" />

      {/* Main Aesthetic Login Card */}
      <div className="w-full max-w-sm relative z-10">
        {/* Top Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <AnimatedGirlAvatar size={70} className="mb-3" />
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#2A1810] dark:text-[#FAF5EE]">
            Yuli&apos;s Vault
          </h1>
          <p className="text-xs sm:text-sm text-[#7A5F4E] dark:text-[#CBB5A3] mt-1 font-medium tracking-wide">
            Academic Second Brain & Task Management
          </p>
        </div>

        {/* Clean, Aesthetic Form Card */}
        <div className="bg-[#FFFDFB] dark:bg-[#1E140E] rounded-3xl p-6 sm:p-7 border border-[#E3D6C9] dark:border-[#38261B] shadow-xl shadow-stone-900/5 dark:shadow-black/50 backdrop-blur-md relative">
          {/* Subtle card corner sparkle */}
          <div className="absolute top-4 right-4 pointer-events-none">
            <SparkleStar size={13} color="#E5B97A" className="glitter-star" style={{ animationDelay: "0.5s" }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-bold text-[#5C4537] dark:text-[#CBB5A3] uppercase tracking-wider mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#947866] dark:text-[#A08878]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username atau NIM (240511130)"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-[#F9F5F0] dark:bg-[#281B13] border border-[#DECFC0] dark:border-[#422C1F] text-[#2A1810] dark:text-[#FAF5F0] placeholder-[#A89484] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/30 focus:border-[#8B5A2B] transition-all"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold text-[#5C4537] dark:text-[#CBB5A3] uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#947866] dark:text-[#A08878]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-2xl bg-[#F9F5F0] dark:bg-[#281B13] border border-[#DECFC0] dark:border-[#422C1F] text-[#2A1810] dark:text-[#FAF5F0] placeholder-[#A89484] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/30 focus:border-[#8B5A2B] transition-all"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#947866] hover:text-[#2A1810] dark:text-[#A08878] dark:hover:text-[#FAF5F0] transition-colors cursor-pointer"
                  aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Masuk ke Vault Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#2B1810] via-[#3A2216] to-[#25150E] text-[#FAF5EE] hover:from-[#1C0F0A] hover:to-[#1C0F0A] text-xs sm:text-sm font-bold shadow-md shadow-[#2B1810]/20 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer group"
            >
              <span>{isSubmitting ? "Memverifikasi..." : "Masuk ke Vault"}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Masuk Cepat sebagai Yuli Indiyanti Button */}
            <button
              type="button"
              onClick={() => quickLogin()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#F6EFE7] dark:bg-[#281B13] text-[#3D2417] dark:text-[#E8CBAE] hover:bg-[#EFE5DA] dark:hover:bg-[#322218] border border-[#DECFC0] dark:border-[#422C1F] text-xs font-bold transition-all shadow-2xs active:scale-[0.99] cursor-pointer"
            >
              <SparkleStar size={13} color="#D4A373" className="glitter-star" />
              <span>Masuk Cepat sebagai Yuli Indiyanti</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
