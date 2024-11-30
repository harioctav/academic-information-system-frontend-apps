import { User } from "@/types/settings/user";
import { ValidationErrors } from "@/types/api";

export interface AuthResponse {
	message: string;
	user: User & {
		token: {
			token_type: string;
			expires_in: number;
			access_token: string;
			refresh_token: string;
		};
	};
}

export interface ApiError {
	message?: string;
	errors?: ValidationErrors;
}

export interface AuthRequest {
	email: string;
	password: string;
}
