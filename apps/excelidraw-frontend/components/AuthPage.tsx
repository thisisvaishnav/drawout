"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AuthPageProps = {
    isSignin: boolean;
};

export const AuthPage = ({ isSignin }: AuthPageProps) => {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const titleText = isSignin ? "Sign in" : "Sign up";
    const buttonText = isSignin ? "Sign in" : "Sign up";
    const helperText = isSignin
        ? "Welcome back. Please enter your details."
        : "Create your account to get started.";

    const handleSubmit = () => {
        router.push(isSignin ? "/signin" : "/signup");
    };

    const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        event.preventDefault();
        handleSubmit();
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-semibold tracking-tight text-white">{titleText}</h1>
                    <p className="mt-2 text-sm text-white/70">{helperText}</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/90" htmlFor="auth-username">
                            Username
                        </label>
                        <input
                            id="auth-username"
                            type="text"
                            value={username}
                            onChange={event => setUsername(event.target.value)}
                            placeholder="Enter your username"
                            className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            aria-label="Username"
                            tabIndex={0}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/90" htmlFor="auth-password">
                            Password
                        </label>
                        <input
                            id="auth-password"
                            type="password"
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                            placeholder="Enter your password"
                            className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            aria-label="Password"
                            tabIndex={0}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        onKeyDown={handleButtonKeyDown}
                        className="w-full rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        aria-label={buttonText}
                        tabIndex={0}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};
