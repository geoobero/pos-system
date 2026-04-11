import { supabase } from "./client";

export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
}

export async function signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: metadata },
    });
    return { data, error };
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    await fetch("/api/auth/session", { method: "DELETE" });
    return { error };
}

export async function getUser() {
    return supabase.auth.getUser();
}

export async function syncAuthSession(session) {
    if (!session?.access_token || !session?.refresh_token) {
        return { error: new Error("Session is missing tokens") };
    }

    const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
            expiresAt: session.expires_at,
        }),
    });

    if (!response.ok) {
        return { error: new Error("Failed to sync auth session") };
    }

    return { error: null };
}