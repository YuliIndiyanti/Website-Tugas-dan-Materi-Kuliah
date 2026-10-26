import type { Metadata } from "next";
import "./globals.css";
import { VaultProvider } from "@/context/VaultContext";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Yuli's Vault 🌸 - Yuli's Second Brain",
  description:
    "Streamline your study workflow. Track tasks and manage materials effortlessly with Yuli's Vault.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased selection:bg-[#EDE3D6] selection:text-[#453120]">
        <VaultProvider>
          <AppShell>{children}</AppShell>
        </VaultProvider>
      </body>
    </html>
  );
}
