import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function DashboardLayout({ children }) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex flex-col flex-1">
                {/* Top navbar */}
                <Navbar />

                {/* Page content */}
                <main className="flex-1 p-6 bg-gray-50">
                    {children}
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
}
