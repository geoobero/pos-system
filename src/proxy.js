import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const adminOnlyPaths = ["/dashboard/products", "/dashboard/categories", "/dashboard/users", "/dashboard/overview"];

function createSupabase() {
    return createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
        },
    });
}

export async function proxy(request) {
    const { pathname } = request.nextUrl;

    if (!pathname.startsWith("/dashboard")) {
        return NextResponse.next();
    }

    const accessToken = request.cookies.get("sb-access-token")?.value;
    const refreshToken = request.cookies.get("sb-refresh-token")?.value;

    if (!accessToken || !refreshToken) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const supabase = createSupabase();
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    const user = sessionData?.user || sessionData?.session?.user;

    if (sessionError || !user) {
        const response = NextResponse.redirect(new URL("/login?reason=expired", request.url));
        response.cookies.delete("sb-access-token");
        response.cookies.delete("sb-refresh-token");
        return response;
    }

    const response = NextResponse.next();
    const nextSession = sessionData?.session;

    if (nextSession?.access_token) {
        response.cookies.set("sb-access-token", nextSession.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: nextSession.expires_at
                ? Math.max(nextSession.expires_at - Math.floor(Date.now() / 1000), 60)
                : 60 * 60 * 24,
        });
    }

    if (nextSession?.refresh_token) {
        response.cookies.set("sb-refresh-token", nextSession.refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        });
    }

    const role = user.user_metadata?.role || "cashier";

    if (role !== "admin" && adminOnlyPaths.some((path) => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL("/dashboard/pos", request.url));
    }

    return response;
}

export const config = {
    matcher: ["/dashboard/:path*"],
};