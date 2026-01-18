"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BACKEND_URL } from "@/app/config";
import { getAuthToken, setAuthToken } from "@/lib/auth";

type AuthPageProps = {
    isSignin: boolean;
};

export const AuthPage = ({ isSignin }: AuthPageProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const titleText = isSignin ? "Sign in" : "Sign up";
    const buttonText = isSignin ? "Sign in" : "Sign up";
    const helperText = isSignin
        ? "Welcome back. Please enter your details."
        : "Create your account to get started.";

    const nextPath = searchParams.get("next") ?? "/";

    const handleSubmit = async () => {
        if (!username.trim() || !password.trim()) {
            setErrorMessage("Please enter a username and password.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");

        try {
            if (!isSignin) {
                const signupResponse = await fetch(`${BACKEND_URL}/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        password,
                        name: username
                    })
                });

                if (!signupResponse.ok) {
                    const data = await signupResponse.json().catch(() => null);
                    setErrorMessage(data?.message ?? "Signup failed. Try again.");
                    setIsSubmitting(false);
                    return;
                }
            }

            const signinResponse = await fetch(`${BACKEND_URL}/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if (!signinResponse.ok) {
                const data = await signinResponse.json().catch(() => null);
                setErrorMessage(data?.message ?? "Signin failed. Try again.");
                setIsSubmitting(false);
                return;
            }

            const signinData = await signinResponse.json();
            if (!signinData?.token) {
                setErrorMessage("No token returned. Try again.");
                setIsSubmitting(false);
                return;
            }

            setAuthToken(signinData.token);
            router.push(nextPath);
        } catch (error) {
            setErrorMessage("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        event.preventDefault();
        handleSubmit();
    };

    useEffect(() => {
        const token = getAuthToken();
        if (!token) {
            return;
        }

        router.push("/");
    }, [router]);
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

                    {errorMessage ? (
                        <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                            {errorMessage}
                        </p>
                    ) : null}

                    <button
                        type="button"
                        onClick={handleSubmit}
                        onKeyDown={handleButtonKeyDown}
                        className="w-full rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label={buttonText}
                        tabIndex={0}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Please wait..." : buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};
