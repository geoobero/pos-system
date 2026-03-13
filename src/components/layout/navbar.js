"use client";

import { useAuth } from "@/contexts/authContext";
import { signOut } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { user, isAdmin } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push("/login");
    };

    return (
        <header className="h-14 bg-white border-b flex items-center justify-between px-6">
            <h1 className="text-lg font-semibold">Dashboard</h1>

            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                    {user?.name || user?.email}
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded ${isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                        {isAdmin ? "Admin" : "Cashier"}
                    </span>
                </span>
                <button
                    onClick={handleSignOut}
                    className="text-sm text-red-600 hover:underline"
                >
                    Sign Out
                </button>
            </div>
        </header>
    );
}
