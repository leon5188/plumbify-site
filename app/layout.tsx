import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plumbify | The AI-First Operating System for Plumbing Businesses",
  description: "Automate missed calls, speed up hiring, and get paid faster with Plumbify's AI suite designed for the modern plumber.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
