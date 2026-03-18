"use client";

import { useState } from "react";
import { signIn } from "@/lib/supabase/auth";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

function getDeviceInfo() {
    const ua = navigator.userAgent;
    let device = "Unknown Device";
    
    if (ua.includes("Mobile")) {
        device = "Mobile Device";
    } else if (ua.includes("Tablet")) {
        device = "Tablet";
    } else {
        device = "Computer";
    }
    
    let browser = "Unknown Browser";
    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari")) browser = "Safari";
    else if (ua.includes("Edge")) browser = "Edge";
    
    let os = "Unknown OS";
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac")) os = "Mac";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iOS")) os = "iOS";
    
    return `${browser} (${os}) - ${device}`;
}

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        // First, sign in to check credentials
        const { data, error: authError } = await signIn(email, password);

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        // Check if user already has an active session
        const { data: existingSession } = await supabase
            .from("user_sessions")
            .select("*")
            .eq("user_id", data.user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (existingSession) {
            // User already logged in elsewhere - sign out and show error
            await supabase.auth.signOut();
            setError(`User is already logged in on: ${existingSession.device_info}`);
            setLoading(false);
            return;
        }

        // Create new session record
        await supabase.from("user_sessions").insert({
            user_id: data.user.id,
            device_info: getDeviceInfo(),
        });

        router.push("/dashboard/pos");
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl text-gray-600 font-bold text-center mb-6">
                    Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            className="w-full text-gray-600 font-semibold border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-600 text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full text-gray-600 font-semibold border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {error && (
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    )}
                </form>

            </div>
        </main>
    );
}
