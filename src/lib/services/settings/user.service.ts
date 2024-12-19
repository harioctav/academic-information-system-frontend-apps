import { BaseService } from "@/lib/base.service";
import { Params } from "@/types/api";
import { User, UserRequest } from "@/types/settings/user";
import { TokenStorage } from "@/lib/utils/token-storage";

class UserService extends BaseService {
	constructor() {
		super("/settings/users");
	}

	getUsers = (params: Params) => {
		return this.get<User[]>("", params);
	};

	storeUser = (request: UserRequest) => {
		const formData = new FormData();
		formData.append("name", request.name);
		formData.append("email", request.email);
		formData.append("roles", request.roles.toString());

		if (request.phone) {
			formData.append("phone", request.phone);
		}

		if (request.photo) {
			formData.append("photo", request.photo);
		}

		return fetch(this.baseUrl, {
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
			return result;
		});
	};

	showUser = (uuid: string) => {
		return this.get<User>(`/${uuid}`);
	};

	updateUser = (uuid: string, request: UserRequest) => {
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

		return fetch(`${this.baseUrl}/${uuid}`, {
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
			return result;
		});
	};

	deleteUser = (uuid: string) => {
		return this.delete<void, User>(`/${uuid}`);
	};

	bulkDeleteUsers = (ids: string[]) => {
		return this.delete<{ ids: string[] }, User>("/bulk-delete", { ids });
	};
}

export const userService = new UserService();
