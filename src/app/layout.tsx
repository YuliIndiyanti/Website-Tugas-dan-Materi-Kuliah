import type { Metadata } from "next";
import "./globals.css";
import { VaultProvider } from "@/context/VaultContext";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "KuliahVault 🌸 - Personal Academic Vault & Assignment Management",
  description:
    "Aplikasi web manajemen akademik pribadi dengan Soft Pastel Design System untuk mengorganisir seluruh materi kuliah, tugas, riwayat pengumpulan, dan nilai.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased selection:bg-[#E0E7FF] selection:text-[#3730A3]">
        <VaultProvider>
          <AppShell>{children}</AppShell>
        </VaultProvider>
      </body>
    </html>
  );
}
