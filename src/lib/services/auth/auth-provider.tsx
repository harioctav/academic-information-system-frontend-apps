"use client";

import { User } from "@/types/settings/user";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/lib/services/auth/auth.service";
import { AuthResponse } from "@/types/auth/auth";

interface AuthContextType {
	user: User | null;
	login: (response: AuthResponse) => void;
	logout: () => Promise<void>;
	isLoading: boolean;
	refreshUser: () => Promise<void>; // Add this new function
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REFRESH_INTERVAL = 45 * 60 * 1000; // 45 minutes

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	const refreshUser = async () => {
		try {
			const { user: sessionUser } = await authService.checkSession();
			setUser(sessionUser);
		} catch {
			setUser(null);
		}
	};

	useEffect(() => {
		let mounted = true;

		const checkSession = async () => {
			try {
				const { user: sessionUser } = await authService.checkSession();
				if (mounted) {
					setUser(sessionUser);
				}
			} catch {
				if (mounted) {
					setUser(null);
				}
			} finally {
				if (mounted) {
					setIsLoading(false);
				}
			}
		};

		checkSession();

		return () => {
			mounted = false;
		};
	}, []);

	useEffect(() => {
		if (!isLoading && user) {
			const refreshInterval = setInterval(async () => {
				try {
					const data = await authService.refreshToken();
					setUser(data.user);
				} catch {
					await logout();
				}
			}, REFRESH_INTERVAL);

			return () => clearInterval(refreshInterval);
		}
	}, [isLoading, user]);

	const login = async (response: AuthResponse) => {
		setUser(response.user);
		router.replace("/");
	};

	const logout = async () => {
		await authService.logout();
		setUser(null);
		router.replace("/auth/login");
	};

	return (
		<AuthContext.Provider
			value={{ user, login, logout, isLoading, refreshUser }}
		>
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
