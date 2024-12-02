import { Params } from "@/types/api";
import { RegencyRequest } from "@/types/locations/regency";

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

export const regencyService = {
	getRegencies: async (params: Params) => {
		const cacheKey = JSON.stringify(params);
		const cachedData = cache.get(cacheKey);

		if (cachedData) {
			return cachedData;
		}

		const query = buildQueryParams(params);
		const response = await fetch(
			`${BASE_API_URL}/locations/regencies?${query}`,
			{
				headers,
				credentials: "include",
			}
		);

		if (response.status === 403) {
			throw new Error("You don't have permission to access this resource");
		}

		if (!response.ok) {
			throw new Error("Failed to fetch regencies");
		}

		const data = await response.json();
		cache.set(cacheKey, data);
		setTimeout(() => cache.delete(cacheKey), CACHE_DURATION);

		return data;
	},

	storeRegency: async (request: RegencyRequest) => {
		const response = await fetch(`${BASE_API_URL}/locations/regencies`, {
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

	showRegency: async (uuid: string) => {
		const cacheKey = `regency-${uuid}`;
		const cachedData = cache.get(cacheKey);

		if (cachedData) {
			return cachedData;
		}

		const response = await fetch(
			`${BASE_API_URL}/locations/regencies/${uuid}`,
			{
				headers,
				credentials: "include",
			}
		);

		if (!response.ok) {
			throw new Error("Failed to fetch regency");
		}

		const data = await response.json();
		cache.set(cacheKey, data);
		setTimeout(() => cache.delete(cacheKey), CACHE_DURATION);

		return data;
	},

	updateRegency: async (uuid: string, request: RegencyRequest) => {
		const response = await fetch(
			`${BASE_API_URL}/locations/regencies/${uuid}`,
			{
				method: "PUT",
				headers,
				credentials: "include",
				body: JSON.stringify(request),
			}
		);

		const result = await response.json();

		if (!response.ok) {
			throw result;
		}

		// Clear related caches
		cache.delete(`regency-${uuid}`);
		Array.from(cache.keys())
			.filter((key) => key.startsWith('{"page":'))
			.forEach((key) => cache.delete(key));

		return result;
	},

	deleteRegency: async (uuid: string) => {
		const response = await fetch(
			`${BASE_API_URL}/locations/regencies/${uuid}`,
			{
				method: "DELETE",
				headers,
				credentials: "include",
			}
		);

		const result = await response.json();

		if (!response.ok) {
			throw result;
		}

		// Clear related caches
		cache.delete(`regency-${uuid}`);
		Array.from(cache.keys())
			.filter((key) => key.startsWith('{"page":'))
			.forEach((key) => cache.delete(key));

		return result;
	},

	bulkDeleteRegencies: async (ids: string[]) => {
		const response = await fetch(
			`${BASE_API_URL}/locations/regencies/bulk-delete`,
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
