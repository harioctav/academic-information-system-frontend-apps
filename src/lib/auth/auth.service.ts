import { AuthRequest, AuthResponse } from "@/types/auth/auth";

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
				credentials: "include",
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

		document.cookie = `token=${data.user.token.access_token}; path=/`;
		document.cookie = `refresh_token=${data.user.token.refresh_token}; path=/`;
		return data;
	},

	checkSession: async () => {
		try {
			const token = document.cookie.split("token=")[1]?.split(";")[0];

			// Return early if no token exists
			if (!token) {
				return { user: null };
			}

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/user`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						Authorization: `Bearer ${token}`,
					},
					credentials: "include",
				}
			);

			if (!response.ok) {
				return { user: null };
			}

			return response.json();
		} catch {
			return { user: null };
		}
	},

	refreshToken: async (refresh_token: string): Promise<AuthResponse> => {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ refresh_token }),
			}
		);

		const data = await response.json();
		if (!response.ok) throw data;

		document.cookie = `token=${data.token.access_token}; path=/`;
		return data;
	},

	logout: async () => {
		const token = document.cookie.split("token=")[1]?.split(";")[0];

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: `Bearer ${token}`,
				},
				credentials: "include",
			}
		);

		if (!response.ok) {
			throw new Error("Logout failed");
		}

		document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		return response.json();
	},
};
