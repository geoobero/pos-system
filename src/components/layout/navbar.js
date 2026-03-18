"use client";

import { useAuth } from "@/contexts/authContext";
import { signOut } from "@/lib/supabase/auth";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Navbar({ onMenuClick }) {
    const { user, isAdmin } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        // Remove session from database
        if (user?.id) {
            await supabase
                .from("user_sessions")
                .delete()
                .eq("user_id", user.id);
        }
        
        await signOut();
        router.push("/login");
    };

    return (
        <header className="h-14 bg-white border-b flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                <button 
                    onClick={onMenuClick}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 hidden sm:block">
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
