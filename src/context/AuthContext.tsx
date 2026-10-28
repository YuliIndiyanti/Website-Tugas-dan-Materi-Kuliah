"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export interface VaultUser {
  name: string;
  nim: string;
  className: string;
  major: string;
  role: string;
  avatar: string;
  email: string;
}

export const DEFAULT_VAULT_USER: VaultUser = {
  name: "Yuli Indiyanti",
  nim: "240511130",
  className: "TI24D",
  major: "Teknik Informatika",
  role: "Mahasiswa (Owner Vault)",
  avatar: "👩‍🎓",
  email: "yuli@kampus.ac.id",
};

interface AuthContextType {
  user: VaultUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, pass: string, remember?: boolean) => boolean;
  quickLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "yuli_vault_auth_session";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<VaultUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load existing session on client mount
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.isAuthenticated && parsed?.user) {
          setUser(parsed.user);
          setIsAuthenticated(true);
        }
      }
    } catch {
      // In case of invalid JSON in localStorage
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (identifier: string, pass: string, remember: boolean = true): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Verification logic: Accepts NIM 240511130, yuli, or campus email
    const validIds = ["240511130", "yuli", "yuli indiyanti", "yuli@kampus.ac.id", "admin", "ti24d"];
    const isIdValid = validIds.includes(cleanId) || cleanId.length >= 3;

    if (!cleanId) {
      toast.error("Harap masukkan NIM atau Username!");
      return false;
    }

    if (!cleanPass) {
      toast.error("Harap masukkan kata sandi!");
      return false;
    }

    if (!isIdValid) {
      toast.error("Akun tidak ditemukan. Gunakan NIM: 240511130 atau 'yuli'");
      return false;
    }

    // Default passwords accepted: password, 240511130, yuli123, or any password with length >= 4
    if (cleanPass.length < 4) {
      toast.error("Kata sandi minimal 4 karakter (default: password atau 240511130)!");
      return false;
    }

    const authUser = DEFAULT_VAULT_USER;
    setUser(authUser);
    setIsAuthenticated(true);

    if (remember) {
      try {
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            isAuthenticated: true,
            user: authUser,
            loginTime: new Date().toISOString(),
          })
        );
      } catch (err) {
        console.error("Failed to save auth session to localStorage", err);
      }
    }

    toast.success(`Selamat datang kembali, ${authUser.name}! ☕`, {
      description: `Masuk sebagai Mahasiswa ${authUser.className} (NIM: ${authUser.nim})`,
    });
    return true;
  };

  const quickLogin = () => {
    const authUser = DEFAULT_VAULT_USER;
    setUser(authUser);
    setIsAuthenticated(true);
    try {
      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          isAuthenticated: true,
          user: authUser,
          loginTime: new Date().toISOString(),
        })
      );
    } catch (err) {
      console.error("Failed to save auth session to localStorage", err);
    }
    toast.success(`Akses Cepat Diterima! Selamat datang, ${authUser.name}! ⚡`, {
      description: `Masuk ke Yuli's Vault (${authUser.className})`,
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear auth session from localStorage", err);
    }
    toast.info("Anda telah berhasil keluar dari Yuli's Vault.", {
      description: "Silakan masukkan NIM dan kata sandi untuk kembali masuk.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        quickLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
