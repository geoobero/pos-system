"use client";

import { useState } from "react";
import { signIn } from "@/lib/supabase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [error, setError] = useState(() => {
        if (typeof window === "undefined") return "";
        const params = new URLSearchParams(window.location.search);
        return params.get("reason") === "inactivity"
            ? "Session expired due to inactivity. Please login again."
            : "";
    });

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { error: authError } = await signIn(email, password);

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

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
