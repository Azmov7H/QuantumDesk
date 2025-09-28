// src/app/layout.jsx
import { Toaster } from "sonner";
import Navbar from "@/components/comp/Navbar";
import Footer from "@/components/comp/Footer";
import "../globals.css";

export const metadata = {
  title: {
    default: "QuantumLeap — Scientific Publishing & Collaboration",
    template: "%s | QuantumLeap",
  },
  description: "Publish theories, review facts, and collaborate in real‑time.",
  keywords: ["scientific publishing", "research", "theory", "collaboration"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "QuantumLeap",
    images: [{ url: "/preview.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@quantumleap",
    images: ["/preview.png"],
  },
};

export default function RootLayout({ children }) {
  return (

    <dev className="antialiased flex flex-col min-h-screen bg-[#172633] text-white font-mono">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 px-4 py-6 sm:py-8 md:py-12 lg:px-8">{children}</main>

      {/* Toast notifications */}
      <Toaster richColors position="top-center" />

      {/* Footer */}
      <Footer />
    </dev>
  );
}
