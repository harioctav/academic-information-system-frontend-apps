import { Params } from "@/types/api";
import { RoleRequest } from "@/types/settings/role";

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

export const roleService = {
	getRoles: async (params: Params) => {
		const cacheKey = JSON.stringify(params);
		const cachedData = cache.get(cacheKey);

		if (cachedData) {
			return cachedData;
		}

		const query = buildQueryParams(params);
		const response = await fetch(`${BASE_API_URL}/settings/roles?${query}`, {
			headers,
			credentials: "include",
		});

		if (response.status === 403) {
			throw new Error("You don't have permission to access this resource");
		}

		if (!response.ok) {
			throw new Error("Failed to fetch roles");
		}

		const data = await response.json();
		cache.set(cacheKey, data);
		setTimeout(() => cache.delete(cacheKey), CACHE_DURATION);

		return data;
	},

	showRole: async (uuid: string) => {
		const cacheKey = `role-${uuid}`;
		const cachedData = cache.get(cacheKey);

		if (cachedData) {
			return cachedData;
		}

		const response = await fetch(`${BASE_API_URL}/settings/roles/${uuid}`, {
			headers,
			credentials: "include",
		});

		if (!response.ok) {
			throw new Error("Failed to fetch role");
		}

		const data = await response.json();
		cache.set(cacheKey, data);
		setTimeout(() => cache.delete(cacheKey), CACHE_DURATION);

		return data;
	},

	updateRole: async (uuid: string, request: RoleRequest) => {
		const response = await fetch(`${BASE_API_URL}/settings/roles/${uuid}`, {
			method: "PUT",
			headers,
			credentials: "include",
			body: JSON.stringify(request),
		});

		const result = await response.json();

		if (!response.ok) {
			throw result;
		}

		// Clear related caches
		cache.delete(`role-${uuid}`);
		Array.from(cache.keys())
			.filter((key) => key.startsWith('{"page":'))
			.forEach((key) => cache.delete(key));

		return result;
	},

	deleteRole: async (uuid: string) => {
		const response = await fetch(`${BASE_API_URL}/settings/roles/${uuid}`, {
			method: "DELETE",
			headers,
			credentials: "include",
		});

		const result = await response.json();

		if (!response.ok) {
			throw result;
		}

		// Clear related caches
		cache.delete(`role-${uuid}`);
		Array.from(cache.keys())
			.filter((key) => key.startsWith('{"page":'))
			.forEach((key) => cache.delete(key));

		return result;
	},

	bulkDeleteRoles: async (ids: string[]) => {
		const response = await fetch(`${BASE_API_URL}/settings/roles/bulk-delete`, {
			method: "DELETE",
			headers,
			credentials: "include",
			body: JSON.stringify({ ids }),
		});

		const result = await response.json();

		if (!response.ok) {
			throw result;
		}

		// Clear all list-related caches
		Array.from(cache.keys())
			.filter((key) => key.startsWith('{"page":'))
			.forEach((key) => cache.delete(key));

		return result;
	},
};
