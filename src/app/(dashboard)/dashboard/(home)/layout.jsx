

import Navbar from "@/components/dashboard/home-user/NavBar";
import "../../../globals.css";
export const metadata = {
  title: "Dashboard | QuantumLeap",
  description: "Overview of your posts, chats, and collaborations.",
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

        <div className="flex flex-col min-h-screen bg-[#101a23] bg-white dark:bg-black text-black dark:text-white">
          <Navbar />
          <main className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 flex-col py-5">
            {children}
          </main>
        </div>

  );
}
