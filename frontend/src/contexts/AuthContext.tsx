"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthResponse } from "@/lib/types";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Load user from localStorage on mount
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.auth.login({ email, password });
            const data: AuthResponse = response.data;

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setToken(data.token);
            setUser(data.user);

            toast.success("Logged in successfully!");
            router.push("/");
        } catch (error: any) {
            const message = error.response?.data?.error?.message || "Login failed";
            toast.error(message);
            throw error;
        }
    };

    const register = async (name: string, email: string, password: string) => {
        try {
            const response = await api.auth.register({ name, email, password });
            const data: AuthResponse = response.data;

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            setToken(data.token);
            setUser(data.user);

            toast.success("Account created successfully!");
            router.push("/");
        } catch (error: any) {
            const message = error.response?.data?.error?.message || "Registration failed";
            toast.error(message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        toast.success("Logged out successfully");
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
