export const TokenStorage = {
	getAccessToken: () => document.cookie.split("token=")[1]?.split(";")[0],
	getRefreshToken: () =>
		document.cookie.split("refresh_token=")[1]?.split(";")[0],
	setTokens: (access: string, refresh: string) => {
		const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
		document.cookie = `token=${access}; expires=${expires.toUTCString()}; path=/`;
		document.cookie = `refresh_token=${refresh}; expires=${expires.toUTCString()}; path=/`;
	},
	clearTokens: () => {
		document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie =
			"refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	},
};
