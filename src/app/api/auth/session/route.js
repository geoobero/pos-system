import { NextResponse } from "next/server";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
};

export async function POST(request) {
    const { accessToken, refreshToken, expiresAt } = await request.json();

    if (!accessToken || !refreshToken) {
        return NextResponse.json({ error: "Missing tokens" }, { status: 400 });
    }

    const response = NextResponse.json({ ok: true });
    const maxAge = expiresAt
        ? Math.max(expiresAt - Math.floor(Date.now() / 1000), 60)
        : 60 * 60 * 24;

    response.cookies.set("sb-access-token", accessToken, { ...cookieOptions, maxAge });
    response.cookies.set("sb-refresh-token", refreshToken, { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });

    return response;
}

export async function DELETE() {
    const response = NextResponse.json({ ok: true });
    response.cookies.set("sb-access-token", "", { ...cookieOptions, maxAge: 0 });
    response.cookies.set("sb-refresh-token", "", { ...cookieOptions, maxAge: 0 });
    return response;
}