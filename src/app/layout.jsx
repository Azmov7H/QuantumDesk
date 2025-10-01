import React from "react";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
export const metadata = {
  title: {
    default: "QuantumLeap — Scientific Publishing & Collaboration",
    template: "%s | QuantumLeap",
  },
  description: "Publish theories, review facts, and collaborate in real-time.",
  keywords: [
    "scientific publishing",
    "research",
    "theory",
    "collaboration",
    "science",
    "academic",
    "peer review",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "QuantumLeap",
    description:
      "Publish theories, review facts, and collaborate in real-time.",
    siteName: "QuantumLeap",
    url: "https://quantum-desk.vercel.app",
    images: [
      {
        url: "/https://res.cloudinary.com/ddho5u074/image/upload/v1759079266/openart-image_d4W2XbU__1759076724028_raw_t9udjz.jpg",
        width: 1200,
        height: 630,
        alt: "QuantumLeap preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@quantumleap",
    creator: "@quantumleap",
    title: "QuantumLeap",
    description:
      "Publish theories, review facts, and collaborate in real-time.",
    images: [
      "/https://res.cloudinary.com/ddho5u074/image/upload/v1759079266/openart-image_d4W2XbU__1759076724028_raw_t9udjz.jpg",
    ],
  },
};

export default function home({ children }) {
  return (
    <html>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ThemeProvider >
                  <div>{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
