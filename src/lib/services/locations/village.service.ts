import { Params } from "@/types/api";
import { VillageRequest } from "@/types/locations/village";

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

export const villageService = {
	getVillages: async (params: Params) => {
		const cacheKey = JSON.stringify(params);
		const cachedData = cache.get(cacheKey);

		if (cachedData) {
			return cachedData;
		}

		const query = buildQueryParams(params);
		const response = await fetch(
			`${BASE_API_URL}/locations/villages?${query}`,
			{
				headers,
				credentials: "include",
			}
		);

		if (response.status === 403) {
			throw new Error("You don't have permission to access this resource");
		}

		if (!response.ok) {
			throw new Error("Failed to fetch villages");
		}

		const data = await response.json();
		cache.set(cacheKey, data);
		setTimeout(() => cache.delete(cacheKey), CACHE_DURATION);

		return data;
	},

	storeVillage: async (request: VillageRequest) => {
		const response = await fetch(`${BASE_API_URL}/locations/villages`, {
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

	showVillage: async (uuid: string) => {
		const cacheKey = `village-${uuid}`;
		const cachedData = cache.get(cacheKey);

		if (cachedData) {
			return cachedData;
		}

		const response = await fetch(`${BASE_API_URL}/locations/villages/${uuid}`, {
			headers,
			credentials: "include",
		});

		if (!response.ok) {
			throw new Error("Failed to fetch village");
		}

		const data = await response.json();
		cache.set(cacheKey, data);
		setTimeout(() => cache.delete(cacheKey), CACHE_DURATION);

		return data;
	},

	updateVillage: async (uuid: string, request: VillageRequest) => {
		const response = await fetch(`${BASE_API_URL}/locations/villages/${uuid}`, {
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
		cache.delete(`village-${uuid}`);
		Array.from(cache.keys())
			.filter((key) => key.startsWith('{"page":'))
			.forEach((key) => cache.delete(key));

		return result;
	},

	deleteVillage: async (uuid: string) => {
		const response = await fetch(`${BASE_API_URL}/locations/villages/${uuid}`, {
			method: "DELETE",
			headers,
			credentials: "include",
		});

		const result = await response.json();

		if (!response.ok) {
			throw result;
		}

		// Clear related caches
		cache.delete(`village-${uuid}`);
		Array.from(cache.keys())
			.filter((key) => key.startsWith('{"page":'))
			.forEach((key) => cache.delete(key));

		return result;
	},

	bulkDeleteVillages: async (ids: string[]) => {
		const response = await fetch(
			`${BASE_API_URL}/locations/villages/bulk-delete`,
			{
				method: "DELETE",
				headers,
				credentials: "include",
				body: JSON.stringify({ ids }),
			}
		);

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
