

import Navbar from "@/components/dashboard/home-user/NavBar";
import "../../../globals.css";

export default function DashboardLayout({ children }) {
  return (

        <div className="flex flex-col min-h-screen bg-[#101a23]">
          <Navbar />
          <main className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 flex-col py-5">
            {children}
          </main>
        </div>

  );
}
