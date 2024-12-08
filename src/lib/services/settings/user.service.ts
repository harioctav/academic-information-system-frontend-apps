import { Params } from "@/types/api";
import { UserRequest, UserResponse } from "@/types/settings/user";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;
const CACHE_DURATION = 60000; // 1 minute
const cache = new Map();

const getToken = () => document.cookie.split("token=")[1]?.split(";")[0];

const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
	Authorization: `Bearer ${getToken()}`,
};

const buildQueryParams = (params: Params) => {
	const queryParams = new URLSearchParams({
		page: params.page.toString(),
		per_page: params.perPage.toString(),
		sort_by: params.sortBy,
		sort_direction: params.sortDirection,
		...(params.search && { search: params.search }),
	});

	if (params.filters) {
		Object.entries(params.filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				queryParams.append(key, value.toString());
			}
		});
	}

	return queryParams.toString();
};

export const userService = {
	/**
	 * Display a listing of the resource.
	 *
	 * @param params
	 * @returns
	 */
	getUsers: async (params: Params) => {
		const cacheKey = JSON.stringify(params);
		const cachedData = cache.get(cacheKey);

		if (cachedData) {
			return cachedData;
		}

		const query = buildQueryParams(params);
		const response = await fetch(`${BASE_API_URL}/settings/users?${query}`, {
			headers,
			credentials: "include",
		});

		if (response.status === 403) {
			throw new Error("You don't have permission to access this resource");
		}

		if (!response.ok) {
			throw new Error("Failed to fetch users");
		}

		const data = await response.json();
		cache.set(cacheKey, data);
		setTimeout(() => cache.delete(cacheKey), CACHE_DURATION);

		return data;
	},

	/**
	 * Store a newly created resource in storage.
	 *
	 * @param request
	 * @returns
	 */
	storeUser: async (request: UserRequest) => {
		const data = new FormData();

		data.append("name", request.name);
		data.append("email", request.email);
		data.append("roles", request.roles.toString());

		if (request.photo) {
			data.append("photo", request.photo);
		}

		const response = await fetch(`${BASE_API_URL}/settings/users`, {
			method: "POST",
			headers,
			credentials: "include",
			body: JSON.stringify(request),
		});

		const result = await response.json();

		if (!response.ok) {
			throw result;
		}

		return result;
	},

	/**
	 *  Display the specified resource.
	 *
	 * @param uuid
	 * @returns
	 */
	showUser: async (uuid: string) => {
		const response = await fetch(`${BASE_API_URL}/settings/users/${uuid}`, {
			headers,
			credentials: "include",
		});

		if (response.status === 403) {
			throw new Error("You don't have permission to access this resource");
		}

		if (!response.ok) {
			throw new Error("Failed to fetch user data");
		}

		return response.json() as Promise<UserResponse>;
	},

	/**
	 * Update the specified resource in storage.
	 *
	 * @param uuid
	 * @param request
	 * @returns
	 */
	updateUser: async (uuid: string, request: UserRequest) => {
		const data = new FormData();

		// Append text fields
		data.append("name", request.name);
		data.append("email", request.email);
		data.append("phone", request.phone);
		data.append("roles", request.roles.toString());
		data.append("_method", "PUT");

		const response = await fetch(`${BASE_API_URL}/settings/users/${uuid}`, {
			method: "POST",
			headers,
			credentials: "include",
			body: JSON.stringify(request),
		});

		if (response.status === 403) {
			throw new Error("You don't have permission to access this resource");
		}

		const result = await response.json();

		if (!response.ok) {
			throw result;
		}

		return result;
	},

	/**
	 * Remove the specified resource from storage.
	 *
	 * @param uuid
	 * @returns
	 */
	deleteUser: async (uuid: string) => {
		const response = await fetch(`${BASE_API_URL}/settings/users/${uuid}`, {
			method: "DELETE",
			headers,
			credentials: "include",
		});

		const result = await response.json();

		if (response.status === 403) {
			throw new Error("You don't have permission to access this resource");
		}

		if (!response.ok) {
			throw result;
		}

		return result;
	},

	/**
	 * Remove multiple resources from storage.
	 *
	 * @param ids
	 * @returns
	 */
	bulkDeleteUsers: async (ids: string[]) => {
		const response = await fetch(`${BASE_API_URL}/settings/users/bulk-delete`, {
			method: "DELETE",
			headers,
			credentials: "include",
			body: JSON.stringify({ ids }),
		});

		const result = await response.json();

		if (response.status === 403) {
			throw new Error("You don't have permission to access this resource");
		}

		if (!response.ok) {
			throw result;
		}

		return result;
	},
};
