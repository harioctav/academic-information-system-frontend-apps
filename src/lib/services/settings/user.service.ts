import { BaseService } from "@/lib/base.service";
import { TokenStorage } from "@/lib/utils/token-storage";
import { Params } from "@/types/api";
import { User, UserRequest } from "@/types/settings/user";

class UserService extends BaseService {
	constructor() {
		super("/settings/users");
	}

	/**
	 * Display a listing of the resource.
	 *
	 * @param params
	 * @returns
	 */
	getUsers = (params: Params) => {
		return this.get<User[]>("", params);
	};

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param request
	 * @returns
	 */
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
			return {
				...result,
				success: true,
				status: response.status,
			};
		});
	};

	/**
	 * Display the specified resource.
	 *
	 * @param uuid
	 * @returns
	 */
	showUser = (uuid: string) => {
		return this.get<User>(`/${uuid}`);
	};

	/**
	 * Update the specified resource in storage.
	 *
	 * @param uuid
	 * @param request
	 * @returns
	 */
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
			return {
				...result,
				success: true,
				status: response.status,
			};
		});
	};

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param uuid
	 * @returns
	 */
	deleteUser = (uuid: string) => {
		return this.delete<void, User>(`/${uuid}`);
	};

	/**
	 * Change the status of the specified user.
	 *
	 * @param uuid
	 * @returns The updated user object.
	 */
	changeUserStatus = (uuid: string) => {
		return this.put<Record<string, never>, User>(`/status/${uuid}`, {});
	};

	/**
	 * Remove multiple resources from storage.
	 *
	 * @param ids
	 * @returns
	 */
	bulkDeleteUsers = (ids: string[]) => {
		return this.delete<{ ids: string[] }, User>("/bulk-delete", { ids });
	};
}

export const userService = new UserService();
