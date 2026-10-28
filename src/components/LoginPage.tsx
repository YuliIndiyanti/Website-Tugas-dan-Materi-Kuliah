"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  Coffee,
} from "lucide-react";

export const LoginPage: React.FC = () => {
  const { login, quickLogin, isLoading } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      login(identifier, password, remember);
      setIsSubmitting(false);
    }, 200);
  };

  const handleQuick = () => {
    quickLogin();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#F8F7F5] dark:bg-[#110F0E] text-[#171310] dark:text-[#F5EFEB] relative overflow-hidden transition-colors selection:bg-[#EAE0D5] selection:text-[#382314]">
      {/* Subtle luxury ambient backdrops */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#EAE0D5]/50 via-[#DFCEBC]/30 to-transparent dark:from-[#3D2C20]/40 dark:via-[#261B14]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-tl from-[#E2D4C3]/40 via-[#DAC6B0]/20 to-transparent dark:from-[#332318]/30 dark:via-[#1F150F]/20 blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Top Header & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white dark:bg-[#1A1614] border border-[#E8E4DD] dark:border-[#2C241E] shadow-sm mb-4 relative group">
            <span className="text-3xl filter drop-shadow-xs">☕</span>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center text-[10px] shadow-xs">
              <Sparkles className="w-3 h-3" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171310] dark:text-[#F8F6F2]">
            Yuli&apos;s Vault
          </h1>
          <p className="text-xs sm:text-sm text-[#736B63] dark:text-[#A3998F] mt-1.5 font-medium">
            Academic Second Brain & Task Management
          </p>
        </div>

        {/* Card Body */}
        <div className="bg-white dark:bg-[#181513] rounded-3xl p-6 sm:p-8 border border-[#E8E4DD] dark:border-[#2A231E] shadow-xl shadow-stone-900/5 dark:shadow-black/40 backdrop-blur-md">
          {/* Student Owner Info Badge */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8F7F5] dark:bg-[#201B18] border border-[#EAE6E0] dark:border-[#2E2620] mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#EAE0D5] text-[#382314] dark:bg-[#3D2C20] dark:text-[#EAE0D5] flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-2xs">
              YI
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#171310] dark:text-[#F5EFEB] truncate">
                  Yuli Indiyanti
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-[#EFE9E0] text-[#544434] dark:bg-[#30241A] dark:text-[#D4C3B2]">
                  TI24D
                </span>
              </div>
              <p className="text-[11px] text-[#736B63] dark:text-[#A3998F] truncate mt-0.5">
                NIM: 240511130 • Teknik Informatika
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NIM / Identifier */}
            <div>
              <label
                htmlFor="login-nim"
                className="block text-xs font-semibold text-[#544C44] dark:text-[#B5AAA0] uppercase tracking-wider mb-1.5"
              >
                NIM / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C8278]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="login-nim"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="240511130 atau yuli"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-[#FAF9F7] dark:bg-[#221C18] border border-[#E2DDD5] dark:border-[#352B24] text-[#171310] dark:text-[#F5EFEB] placeholder-[#A89E94] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/30 focus:border-[#8B5A2B] transition-all"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-[#544C44] dark:text-[#B5AAA0] uppercase tracking-wider"
                >
                  Kata Sandi
                </label>
                <span className="text-[10px] text-[#8C8278] dark:text-[#887E74]">
                  Default: password / 240511130
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C8278]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm rounded-2xl bg-[#FAF9F7] dark:bg-[#221C18] border border-[#E2DDD5] dark:border-[#352B24] text-[#171310] dark:text-[#F5EFEB] placeholder-[#A89E94] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]/30 focus:border-[#8B5A2B] transition-all"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8C8278] hover:text-[#171310] dark:hover:text-[#F5EFEB] transition-colors"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded text-[#8B5A2B] focus:ring-[#8B5A2B] border-stone-300 dark:border-stone-700 bg-white dark:bg-[#221C18]"
                />
                <span className="text-xs text-[#544C44] dark:text-[#B5AAA0] font-medium">
                  Ingat sesi di peramban ini
                </span>
              </label>
              <span className="text-[11px] font-semibold text-[#8B5A2B] dark:text-[#D4A373] hover:underline cursor-pointer" onClick={() => {
                setIdentifier("240511130");
                setPassword("240511130");
              }}>
                Isi Otomatis
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#231A14] text-white hover:bg-[#150F0B] dark:bg-[#F5EFEB] dark:text-[#171310] dark:hover:bg-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{isSubmitting ? "Memverifikasi..." : "Masuk ke Vault"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Elegant Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8E4DD] dark:border-[#2A231E]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-[#8C8278] dark:text-[#786F66]">
              <span className="bg-white dark:bg-[#181513] px-3">
                Akses Langsung Demo
              </span>
            </div>
          </div>

          {/* Quick 1-Click Login Button */}
          <button
            type="button"
            onClick={handleQuick}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-[#F8F7F5] dark:bg-[#201B18] text-[#544434] dark:text-[#D4C3B2] hover:bg-[#EFE9E0] dark:hover:bg-[#29221E] border border-[#E2DDD5] dark:border-[#352B24] text-xs font-bold transition-all shadow-2xs active:scale-[0.99] cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8B5A2B] dark:text-[#D4A373]" />
            <span>⚡ Masuk Cepat sebagai Yuli Indiyanti</span>
          </button>

          {/* Credentials quick tip */}
          <div className="mt-5 p-3 rounded-xl bg-[#FAF9F7] dark:bg-[#1E1916] border border-[#ECE7E0] dark:border-[#2C241E] text-[11px] text-[#736B63] dark:text-[#9E9388] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#382B20] dark:text-[#E8DDD2]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5A2B] dark:text-[#D4A373]" />
              <span>Kredensial Default Terdaftar:</span>
            </div>
            <p className="pl-5 text-[10.5px]">
              • NIM: <span className="font-mono font-semibold text-[#171310] dark:text-[#F5EFEB]">240511130</span> atau Username: <span className="font-mono font-semibold text-[#171310] dark:text-[#F5EFEB]">yuli</span>
            </p>
            <p className="pl-5 text-[10.5px]">
              • Password: <span className="font-mono font-semibold text-[#171310] dark:text-[#F5EFEB]">password</span> atau <span className="font-mono font-semibold text-[#171310] dark:text-[#F5EFEB]">240511130</span>
            </p>
          </div>
        </div>

        {/* Footnote */}
        <div className="mt-6 text-center flex items-center justify-center gap-2 text-[11px] text-[#8C8278] dark:text-[#786F66]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#8B5A2B] dark:text-[#D4A373]" />
          <span>Sistem Akademik Mandiri • Keamanan Sesi Terenkripsi Lokal</span>
        </div>
      </div>
    </div>
  );
};
