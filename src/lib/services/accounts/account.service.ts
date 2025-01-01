import { BaseService } from "@/lib/base.service";
import { TokenStorage } from "@/lib/utils/token-storage";
import { UserRequest } from "@/types/settings/user";

class AccountService extends BaseService {
	constructor() {
		super("/accounts");
	}

	updateProfile = (request: UserRequest, uuid: string) => {
		const formData = new FormData();
		formData.append("name", request.name);
		formData.append("email", request.email);
		formData.append("roles", request.roles.toString());
		formData.append("_method", "PATCH");

		if (request.phone) {
			formData.append("phone", request.phone);
		}

		if (request.photo) {
			formData.append("photo", request.photo);
		}

		return fetch(`${this.baseUrl}/change-profile/${uuid}`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${TokenStorage.getAccessToken()}`,
			},
			credentials: "include",
			body: formData,
		}).then(async (response) => {
			const result = await response.json();
			if (!response.ok) throw result;
			this.clearListCache();
			return {
				...result,
				success: true,
				status: response.status,
			};
		});
	};

	deleteUserImage = (uuid: string) => {
		return fetch(`${this.baseUrl}/users/${uuid}/delete-image`, {
			method: "GET",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${TokenStorage.getAccessToken()}`,
			},
			credentials: "include",
		}).then(async (response) => {
			const result = await response.json();
			if (!response.ok) throw result;
			this.clearListCache();
			return {
				code: result.code,
				message: result.message,
				success: true,
			};
		});
	};
}

export const accountService = new AccountService();
