import Sidebar from "@/components/dashboard/profiel-user/Sidebar"
import "../../../../../globals.css"
export default function PrfofileLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <div className="flex h-screen bg-[#101a23]">
                    <div className=" hidden md:flex">
<Sidebar />
                    </div>
                    
                    <div className="flex-1 overflow-y-auto">{children}</div>
                </div>
            </body>
        </html>
    )
}
