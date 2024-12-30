import { BaseService } from "@/lib/base.service";

class ForgotPasswordService extends BaseService {
	constructor() {
		super("/auth");
	}

	forgotPassword = (email: string) => {
		return this.post<{ email: string }>("/forgot-password", { email });
	};

	resetPassword = (data: {
		token: string;
		email: string;
		password: string;
		password_confirmation: string;
	}) => {
		return this.post<typeof data>("/reset-password", data);
	};
}

export const forgotPasswordService = new ForgotPasswordService();
