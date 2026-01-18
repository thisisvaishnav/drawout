"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/auth";

type AuthGateProps = {
    children: React.ReactNode;
};

type AuthStatus = "checking" | "guest" | "authed";

export const AuthGate = ({ children }: AuthGateProps) => {
    const router = useRouter();
    const [status, setStatus] = useState<AuthStatus>("checking");

    const handleNavigate = (path: string) => {
        router.push(path);
    };

    const handleButtonKeyDown = (
        event: React.KeyboardEvent<HTMLButtonElement>,
        path: string
    ) => {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        event.preventDefault();
        handleNavigate(path);
    };

    useEffect(() => {
        const token = getAuthToken();
        if (token) {
            setStatus("authed");
            return;
        }

        setStatus("guest");
    }, []);

    if (status === "checking") {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 text-white">
                <p className="text-sm text-white/70">Checking session...</p>
            </div>
        );
    }

    if (status === "guest") {
        return (
            <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 px-4 text-white">
                <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
                    <h1 className="text-2xl font-semibold">Welcome to Excelidraw</h1>
                    <p className="mt-2 text-sm text-white/70">
                        Choose how you want to continue.
                    </p>
                    <div className="mt-6 flex flex-col gap-3">
                        <button
                            type="button"
                            onClick={() => handleNavigate("/signin")}
                            onKeyDown={event => handleButtonKeyDown(event, "/signin")}
                            className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                            aria-label="Go to sign in"
                            tabIndex={0}
                        >
                            Sign in
                        </button>
                        <button
                            type="button"
                            onClick={() => handleNavigate("/signup")}
                            onKeyDown={event => handleButtonKeyDown(event, "/signup")}
                            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
                            aria-label="Go to sign up"
                            tabIndex={0}
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

