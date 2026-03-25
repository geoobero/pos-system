"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

const INACTIVITY_TIMEOUT = 0 * 1 * 0 * 1000;
const STORAGE_KEY = 'lastActivity';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const updateActivity = () => {
        if (user) {
            localStorage.setItem(STORAGE_KEY, Date.now().toString());
        }
    };

    const checkInactivity = () => {
        if (!user) return false;
        const lastActivity = localStorage.getItem(STORAGE_KEY);
        if (!lastActivity) return false;
        const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
        return timeSinceLastActivity > INACTIVITY_TIMEOUT;
    };

    const handleInactivityLogout = async () => {
        if (user) {
            await supabase
                .from("user_sessions")
                .delete()
                .eq("user_id", user.id);
        }
        localStorage.removeItem(STORAGE_KEY);
        await supabase.auth.signOut();
        setUser(null);
        window.location.href = '/login?reason=inactivity';
    };

    useEffect(() => {
        async function checkUser() {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session?.user) {
                const lastActivity = localStorage.getItem(STORAGE_KEY);
                if (lastActivity) {
                    const timeSinceLastActivity = Date.now() - parseInt(lastActivity, 10);
                    if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
                        await handleInactivityLogout();
                        return;
                    }
                }
                
                localStorage.setItem(STORAGE_KEY, Date.now().toString());
                
                const userRole = session.user.user_metadata?.role || "cashier";
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    role: userRole,
                    name: session.user.user_metadata?.name || session.user.email,
                });
            }
            setLoading(false);
        }

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const userRole = session.user.user_metadata?.role || "cashier";
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    role: userRole,
                    name: session.user.user_metadata?.name || session.user.email,
                });
            } else {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;

        const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
        
        const handleActivity = () => {
            updateActivity();
        };

        events.forEach(event => {
            window.addEventListener(event, handleActivity, { passive: true });
        });

        const intervalId = setInterval(() => {
            if (checkInactivity()) {
                handleInactivityLogout();
            }
        }, 60000);

        updateActivity();

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
            clearInterval(intervalId);
        };
    }, [user]);

    const isAdmin = user?.role === "admin";
    const isCashier = user?.role === "cashier";

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, isCashier }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
