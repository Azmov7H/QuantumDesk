

import Navbar from "@/components/dashboard/home-user/NavBar";
import "../../../globals.css";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import sNavbar from "@/components/dashboard/home-user/sNavbar";
export const metadata = {
  title: "Dashboard | QuantumLeap",
  description: "Overview of your posts, chats, and collaborations.",
  alternates: { canonical: "/dashboard" },
  openGraph: {
    title: "Dashboard | QuantumLeap",
    description: "Overview of your posts, chats, and collaborations.",
    url: "https://quantum-desk.vercel.app/dashboard",
  },
  twitter: {
    title: "Dashboard | QuantumLeap",
    description: "Overview of your posts, chats, and collaborations.",
  },
};

export default function DashboardLayout({ children }) {
  return (

        <div className="flex flex-col min-h-screen bg-[#101a23]">
          
            <Navbar />

          <main className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 flex-col py-5">
            <Suspense fallback={
              <div className="p-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-32 w-full mb-2" />
                    <Skeleton className="h-8 w-1/2" />
                  </Card>
                ))}
              </div>
            }>
              {children}
            </Suspense>
          </main>
        </div>

  );
}
