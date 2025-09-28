import React from 'react'
import "./globals.css"
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
export default function home({children}) {
  return (
    <html>
        <body>
            <div>{children}</div>
        </body>
    </html>
  )
}
