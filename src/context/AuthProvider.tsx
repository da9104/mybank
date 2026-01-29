import { createContext, useContext, useEffect, useState } from "react";
import type { Dispatch, SetStateAction, ReactNode } from 'react';
import { supabase } from "@/lib/supabase";

type StringSetter = Dispatch<SetStateAction<string>>;

interface AuthContextValue {
    session: any | null;
    loading: boolean;
    username: string;
    randomUsername: () => string;
    setUsername: StringSetter;
}

const AuthContext = createContext<AuthContextValue>({
    session: null,
    loading: true,
    username: '',
    randomUsername: () => '',
    setUsername: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");

    const randomUsername = () => {
        return `@user${Date.now().toString().slice(-4)}`;
    };

    // Handles setting the session from Supabase auth state
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (loading) return;

        let currentUsername: string;

        if (session?.user) {
            // Authenticated user logic
            currentUsername = session.user.user_metadata.name || session.user.email;
        } else {
            // Guest user logic
            currentUsername = localStorage.getItem("username") || randomUsername();
            const guestId = localStorage.getItem("guestId") || `guest-${Date.now()}`;
            localStorage.setItem("username", currentUsername);
            localStorage.setItem("guestId", guestId);
        }
        setUsername(currentUsername);

    }, [session, loading, setUsername]); // Re-runs whenever session or loading state changes

    return (
        <AuthContext.Provider
            value={{ session, loading, randomUsername, username, setUsername }}
        >
            {!loading && (
                <>
                    {children}
                </>
            )}
        </AuthContext.Provider>
    );
};

export const useAppContext = () => useContext(AuthContext);
export { AuthContext as default }