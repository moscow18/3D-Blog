import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import ParticleBackground from "@/components/ui/ParticleBackground";

export const metadata: Metadata = {
  title: "DevPulse | 3D Interactive Blog Experience",
  description: "A premium full-stack blogging platform with immersive 3D interactions, real-time social features, and neural network aesthetics.",
  keywords: ["3D Blog", "Next.js", "SQL Server", "Full Stack", "Framer Motion", "Interactive UI"],
  authors: [{ name: "DevPulse Team" }],
  openGraph: {
    title: "DevPulse | 3D Interactive Blog Experience",
    description: "The future of writing and interactive discourse.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black overflow-x-hidden">
          <AuthProvider>
            <ToastProvider>
              <ParticleBackground />
              <div className="relative z-10 flex-grow">
                  {children}
              </div>
            </ToastProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
