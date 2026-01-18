import { AUTH_TOKEN_KEY } from "@/app/config";

export const getAuthToken = () => {
    if (typeof window === "undefined") {
        return null;
    }

    return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string) => {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = () => {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.removeItem(AUTH_TOKEN_KEY);
};

