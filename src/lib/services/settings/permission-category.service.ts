import { Params } from "@/types/api";

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

export const permissionCategoryService = {
	getPermissionCategories: async (params: Params) => {
		const cacheKey = JSON.stringify(params);
		const cachedData = cache.get(cacheKey);

		if (cachedData) {
			return cachedData;
		}

		const query = buildQueryParams(params);
		const response = await fetch(
			`${BASE_API_URL}/settings/permission-categories?${query}`,
			{
				headers,
				credentials: "include",
			}
		);

		if (response.status === 403) {
			throw new Error("You don't have permission to access this resource");
		}

		if (!response.ok) {
			throw new Error("Failed to fetch permissions-categories");
		}

		const data = await response.json();
		cache.set(cacheKey, data);
		setTimeout(() => cache.delete(cacheKey), CACHE_DURATION);

		return data;
	},
};
