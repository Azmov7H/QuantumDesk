import { Toaster } from "sonner";
import Navbar from "../components/Navbar";
import "../globals.css";
import Footer from "../components/Footer";

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
    <html lang="en">
      <body className={` antialiased bg-[#172633] text-white font-mono`}>
        <Navbar />
        <main className="p-2 mt-4 ">{children}</main>
        <Toaster richColors position="top-center" />
        <Footer />
      </body>
    </html>
  );
}
