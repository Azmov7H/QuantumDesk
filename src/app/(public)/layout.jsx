// src/app/layout.jsx
import { Toaster } from "sonner";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import "../globals.css";



export default function RootLayout({ children }) {
  return (

    <div className="antialiased flex flex-col min-h-screen bg-[#172633] text-white font-mono">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 px-4 py-6 sm:py-8 md:py-12 lg:px-8">{children}</main>

      {/* Toast notifications */}
      <Toaster richColors position="top-center" />

      {/* Footer */}
      <Footer />
    </div>
  );
}
