"use client";

import Sidebar from "@/components/layout/sidebar";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useAuth } from "@/contexts/authContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/shared/loading";

const adminOnlyPaths = ["/dashboard/products", "/dashboard/categories", "/dashboard/users"];

export default function DashboardLayout({ children }) {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        if (!loading && user && !isAdmin) {
            const isAdminPage = adminOnlyPaths.some(path => pathname.startsWith(path));
            if (isAdminPage) {
                router.push("/dashboard/pos");
            }
        }
    }, [user, loading, isAdmin, pathname, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading message="Checking authentication..." />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar isAdmin={isAdmin} />
            <div className="flex flex-col flex-1">
                <Navbar />
                <main className="flex-1 p-6 bg-gray-50">
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}
