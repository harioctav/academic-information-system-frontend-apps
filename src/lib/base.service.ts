import { TokenStorage } from "@/lib/utils/token-storage";
import { Params, ApiResponse } from "@/types/api";

export const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL;
export const CACHE_DURATION = 60000; // 1 minute

// type RequestBody =
// 	| Record<string, unknown>
// 	| {
// 			[key: string]: string | number | boolean | null | undefined;
// 	  };

export const headers = () => ({
	"Content-Type": "application/json",
	Accept: "application/json",
	...(TokenStorage.getAccessToken() && {
		Authorization: `Bearer ${TokenStorage.getAccessToken()}`,
	}),
});

export const buildQueryParams = (params: Params) => {
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

export class BaseService {
	protected cache = new Map();
	protected baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = `${BASE_API_URL}${baseUrl}`;
	}

	protected async get<T>(
		endpoint: string,
		params?: Params
	): Promise<ApiResponse<T>> {
		if (params) {
			const cacheKey = JSON.stringify(params);
			const cachedData = this.cache.get(cacheKey);
			if (cachedData) return cachedData;

			const query = buildQueryParams(params);
			endpoint = `${endpoint}?${query}`;
		}

		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			headers: headers(),
			credentials: "include",
		});

		if (response.status === 403) {
			throw new Error("You don't have permission to access this resource");
		}

		if (!response.ok) {
			throw new Error(`Failed to fetch data from ${endpoint}`);
		}

		const data = await response.json();

		if (params) {
			const cacheKey = JSON.stringify(params);
			this.cache.set(cacheKey, data);
			setTimeout(() => this.cache.delete(cacheKey), CACHE_DURATION);
		}

		return data;
	}

	protected async post<T, R = { message: string }>(
		endpoint: string,
		body: T
	): Promise<ApiResponse<R>> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			method: "POST",
			headers: headers(),
			credentials: "include",
			body: JSON.stringify(body),
		});

		const result = await response.json();

		if (!response.ok) {
			throw result;
		}

		this.clearListCache();
		return result;
	}

	protected async put<T, R = { message: string }>(
		endpoint: string,
		body: T
	): Promise<ApiResponse<R>> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			method: "PUT",
			headers: headers(),
			credentials: "include",
			body: JSON.stringify(body),
		});

		const result = await response.json();

		if (!response.ok) {
			throw result;
		}

		this.clearListCache();
		return result;
	}

	protected async delete<T, R>(
		endpoint: string,
		body?: T
	): Promise<ApiResponse<R>> {
		const response = await fetch(`${this.baseUrl}${endpoint}`, {
			method: "DELETE",
			headers: headers(),
			credentials: "include",
			...(body && { body: JSON.stringify(body) }),
		});

		const result = await response.json();

		if (!response.ok) {
			throw result;
		}

		this.clearListCache();
		return result;
	}

	protected clearListCache() {
		Array.from(this.cache.keys())
			.filter((key) => key.startsWith('{"page":'))
			.forEach((key) => this.cache.delete(key));
	}
}
