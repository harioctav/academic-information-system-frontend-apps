"use client";

import { User } from "@/types/settings/user";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/lib/auth/auth.service";

interface AuthToken {
	accessToken: string;
	refreshToken: string;
}

interface AuthResponse {
	user: User & { token: AuthToken };
}

interface AuthContextType {
	user: User | null;
	login: (response: AuthResponse) => void;
	logout: () => Promise<void>;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = useState(false);
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const initAuth = async () => {
			setMounted(true);
			const token = document.cookie.includes("token");

			if (token) {
				try {
					const data = await authService.checkSession();
					setUser(data.user);
				} catch {
					setUser(null);
				}
			}
			setIsLoading(false);
		};

		initAuth();

		// Add to existing useEffect
		const refreshTokenInterval = setInterval(async () => {
			const refresh_token = document.cookie
				.split("refresh_token=")[1]
				?.split(";")[0];
			if (refresh_token) {
				try {
					const data = await authService.refreshToken(refresh_token);
					setUser(data.user);
				} catch {
					logout();
				}
			}
		}, 14 * 60 * 1000); // Refresh every 14 minutes

		return () => clearInterval(refreshTokenInterval);
	}, []);

	const login = (response: AuthResponse) => {
		setUser(response.user);
		router.push("/");
	};

	const logout = async () => {
		try {
			await authService.logout();
			document.cookie =
				"token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
			setUser(null);
			window.location.href = "/auth/login";
		} catch (error) {
			console.error("Logout failed:", error);
		}
	};

	if (!mounted) return null;

	return (
		<AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
