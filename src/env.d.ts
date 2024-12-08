declare namespace NodeJS {
	interface ProcessEnv {
		NEXT_PUBLIC_API_URL: string;
		NEXT_PUBLIC_APP_URL: string;
		NEXT_PUBLIC_JWT_SECRET: string;
		NEXT_PUBLIC_TOKEN_EXPIRE_DAYS: number;
		GENERATE_SOURCEMAP: boolean;
	}
}
