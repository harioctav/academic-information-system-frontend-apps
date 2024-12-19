import { TokenStorage } from "@/lib/utils/token-storage";
import { AuthRequest } from "@/types/auth/auth";

export const authService = {
	login: async (credentials: AuthRequest) => {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify(credentials),
			}
		);

		if (!response.ok) {
			if (response.status === 429) {
				throw new Error("Too many attempts. Please try again later.");
			}
			const data = await response.json();
			throw data;
		}

		const data = await response.json();
		TokenStorage.setTokens(
			data.user.token.access_token,
			data.user.token.refresh_token
		);
		return data;
	},

	checkSession: async () => {
		const token = TokenStorage.getAccessToken();
		if (!token) return { user: null };

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/user`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: "application/json",
					},
				}
			);

			if (!response.ok) {
				TokenStorage.clearTokens();
				return { user: null };
			}

			return response.json();
		} catch {
			TokenStorage.clearTokens();
			return { user: null };
		}
	},

	refreshToken: async () => {
		const refresh_token = TokenStorage.getRefreshToken();
		if (!refresh_token) throw new Error("No refresh token");

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({ refresh_token }),
			}
		);

		if (!response.ok) {
			TokenStorage.clearTokens();
			throw new Error("Failed to refresh token");
		}

		const data = await response.json();
		TokenStorage.setTokens(data.token.access_token, data.token.refresh_token);
		return data;
	},

	logout: async () => {
		const token = TokenStorage.getAccessToken();
		if (!token) return;

		try {
			await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/json",
				},
			});
		} finally {
			TokenStorage.clearTokens();
		}
	},
};
